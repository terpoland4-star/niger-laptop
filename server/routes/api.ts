import { Router } from "express";
import { db } from "../db/index";
import { products, orders, carts, customers, deliveries, agentLocations, nitaTransactions } from "../db/schema";
import { eq, like, or, and, ne } from "drizzle-orm";
import { orderSchema } from "../validators/orderValidator";
import { randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { phoneParamSchema, cartItemsSchema } from "../validators/cartValidator";
import { sendOrderNotifications } from "../lib/notifications";
import { syncNitaTransactionStatus, NitaApiError } from "../services/nitaAchat";
import { optionalCustomer, CustomerAuthenticatedRequest } from "../middleware/customerAuth";
import { getProductDetail, parseProductSpecs } from "../services/products";

const router = Router();

const cartLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez dans une minute." },
});

// GET /api/products - liste tous les produits (avec recherche optionnelle)
router.get("/products", async (req, res) => {
  const search = req.query.search as string | undefined;

  let result;
  if (search) {
    const q = `%${search}%`;
    result = await db.select().from(products).where(
      or(like(products.nameFr, q), like(products.nameEn, q))
    );
  } else {
    result = await db.select().from(products);
  }

  res.json({
    data: result.map(parseProductSpecs),
    pagination: { page: 1, totalPages: 1, total: result.length },
  });
});

// GET /api/products/:id - un seul produit
router.get("/products/:id", async (req, res) => {
  const product = await getProductDetail(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Produit non trouvé" });
  }
  res.json({ data: product });
});

// POST /api/orders - créer une commande
router.post("/orders", optionalCustomer, async (req: CustomerAuthenticatedRequest, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
  }

  const { customerName, customerPhone, deliveryAddress, items, createAccountEmail, createAccountPassword } = parsed.data;

  // Récupère les produits concernés pour calculer le total et enrichir les items
  const productIds = items.map((i) => i.productId);
  const foundProducts = await db.select().from(products);
  const productMap = new Map(foundProducts.map((p) => [p.id, p]));

  let total = 0;
  const enrichedItems = items.map((item) => {
    const product = productMap.get(item.productId);
    const price = product?.price ?? 0;
    const lineTotal = price * item.quantity;
    total += lineTotal;
    return {
      productId: item.productId,
      productName: product?.nameFr ?? "Produit inconnu",
      quantity: item.quantity,
      unitPrice: price,
      lineTotal,
      thumbnail: product?.thumbnail ?? null,
    };
  });

  // Détermine le customerId à lier : token existant en priorité, sinon
  // création automatique d'un compte si email + mot de passe fournis.
  let customerId: string | null = req.customer?.id ?? null;
  let newAccountToken: string | null = null;

  if (!customerId && createAccountEmail && createAccountPassword) {
    const existingCustomer = await db.select().from(customers).where(eq(customers.email, createAccountEmail));
    if (existingCustomer.length > 0) {
      // Un compte existe déjà avec cet email : on ne le lie pas automatiquement
      // sans authentification, la commande reste en mode invité.
    } else {
      const passwordHash = await bcrypt.hash(createAccountPassword, 10);
      const newCustomerId = randomUUID();
      await db.insert(customers).values({
        id: newCustomerId,
        email: createAccountEmail,
        passwordHash,
        name: customerName,
        phone: customerPhone,
        createdAt: new Date().toISOString(),
      });
      customerId = newCustomerId;
      const secret = process.env.JWT_SECRET;
      if (secret) {
        newAccountToken = jwt.sign(
          { id: newCustomerId, email: createAccountEmail, type: "customer" },
          secret,
          { expiresIn: "30d" }
        );
      }
    }
  }

  const order = {
    id: randomUUID(),
    orderNumber: "NL-" + Date.now(),
    customerName,
    customerPhone,
    deliveryAddress: deliveryAddress ?? null,
    status: "pending",
    total,
    itemsJson: JSON.stringify(enrichedItems),
    createdAt: new Date().toISOString(),
    customerId,
  };

  await db.insert(orders).values(order);

  sendOrderNotifications({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    total: order.total,
    items: enrichedItems,
  }).catch((err) => console.error("[orders] Erreur notification:", err));

  res.status(201).json({
    data: { ...order, items: enrichedItems },
    ...(newAccountToken ? { newAccountToken } : {}),
  });
});

// GET /api/orders/:id - consulter une commande par son id
router.get("/orders/:id", async (req, res) => {
  const result = await db.select().from(orders).where(eq(orders.id, req.params.id));
  if (result.length === 0) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }
  const order = result[0];
  res.json({ data: { ...order, items: JSON.parse(order.itemsJson) } });
});

const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez dans quelques minutes." },
});

// GET /api/orders/track/:orderNumber - suivi public limité (sans infos sensibles)
router.get("/orders/track/:orderNumber", trackingLimiter, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const result = await db.select().from(orders).where(eq(orders.orderNumber, req.params.orderNumber));
  if (result.length === 0) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }
  const order = result[0];

  let delivery: { status: string; location: { lat: number; lng: number; updatedAt: string } | null } | null = null;
  const [activeDelivery] = await db
    .select()
    .from(deliveries)
    .where(and(eq(deliveries.orderId, order.id), ne(deliveries.status, "delivered")));

  if (activeDelivery) {
    const [loc] = await db
      .select()
      .from(agentLocations)
      .where(eq(agentLocations.agentId, activeDelivery.agentId));
    delivery = {
      status: activeDelivery.status,
      location: loc ? { lat: loc.lat, lng: loc.lng, updatedAt: loc.updatedAt } : null,
    };
  }

  let [nitaTx] = await db
    .select()
    .from(nitaTransactions)
    .where(eq(nitaTransactions.orderId, order.id));

  let freshOrder = order;

  // Si une transaction NITA existe et n'est pas encore confirmée, on revérifie
  // l'état réel auprès de NITA (source de vérité) avant de répondre au client.
  // Sans ça, le polling frontend affiche indéfiniment "non payé" même après
  // un paiement réel, car il ne lit que l'état figé en base.
  if (nitaTx && nitaTx.status !== "1" && !order.isPaid) {
    try {
      await syncNitaTransactionStatus(nitaTx.id, req.ip ?? "unknown");
      const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, order.id));
      if (updatedOrder) freshOrder = updatedOrder;
      const [updatedTx] = await db
        .select()
        .from(nitaTransactions)
        .where(eq(nitaTransactions.orderId, order.id));
      if (updatedTx) nitaTx = updatedTx;
    } catch (err) {
      // On ne bloque jamais le suivi de commande si NITA est indisponible ;
      // on retombe simplement sur les dernières données connues en base.
      if (err instanceof NitaApiError) {
        console.error("[track] Échec sync NITA:", err.message);
      } else {
        console.error("[track] Erreur inattendue lors de la sync NITA:", err);
      }
    }
  }

  res.json({
    data: {
      id: freshOrder.id,
      orderNumber: freshOrder.orderNumber,
      status: freshOrder.status,
      total: freshOrder.total,
      createdAt: freshOrder.createdAt,
      items: JSON.parse(freshOrder.itemsJson),
      delivery,
      isPaid: freshOrder.isPaid,
      nita: nitaTx
        ? {
            codeAchat: nitaTx.codeAchat,
            status: nitaTx.status,
            expiresAt: nitaTx.expiresAt,
          }
        : null,
    },
  });
});


// PUT /api/cart/:phone - sauvegarder le panier
router.put("/cart/:phone", cartLimiter, async (req, res) => {
  const phoneCheck = phoneParamSchema.safeParse(req.params.phone);
  if (!phoneCheck.success) {
    return res.status(400).json({ error: "Numéro de téléphone invalide" });
  }
  const bodyCheck = cartItemsSchema.safeParse(req.body);
  if (!bodyCheck.success) {
    return res.status(400).json({ error: "Données du panier invalides", details: bodyCheck.error.issues });
  }

  const { items } = bodyCheck.data;
  const phone = phoneCheck.data;
  const updatedAt = new Date().toISOString();

  await db
    .insert(carts)
    .values({ phone, itemsJson: JSON.stringify(items), updatedAt })
    .onConflictDoUpdate({
      target: carts.phone,
      set: { itemsJson: JSON.stringify(items), updatedAt },
    });

  res.json({ data: { phone, updatedAt } });
});

// GET /api/cart/:phone - récupérer le panier
router.get("/cart/:phone", cartLimiter, async (req, res) => {
  const phoneCheck = phoneParamSchema.safeParse(req.params.phone);
  if (!phoneCheck.success) {
    return res.status(400).json({ error: "Numéro de téléphone invalide" });
  }
  const result = await db.select().from(carts).where(eq(carts.phone, phoneCheck.data));
  if (result.length === 0) {
    return res.status(404).json({ error: "Aucun panier trouvé pour ce numéro" });
  }
  res.json({ data: { items: JSON.parse(result[0].itemsJson), updatedAt: result[0].updatedAt } });
});
router.get("/test-sentry-error", (req, res) => {
  throw new Error("Test Sentry — erreur volontaire pour vérification");
});

export default router;
