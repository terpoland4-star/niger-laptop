import { Router } from "express";
import { db } from "../db/index";
import { products, orders } from "../db/schema";
import { eq, like, or } from "drizzle-orm";
import { orderSchema } from "../validators/orderValidator";
import { randomUUID } from "crypto";

const router = Router();

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

  res.json({ data: result, pagination: { page: 1, totalPages: 1, total: result.length } });
});

// GET /api/products/:id - un seul produit
router.get("/products/:id", async (req, res) => {
  const result = await db.select().from(products).where(eq(products.id, req.params.id));
  if (result.length === 0) {
    return res.status(404).json({ error: "Produit non trouvé" });
  }
  res.json({ data: result[0] });
});

// POST /api/orders - créer une commande
router.post("/orders", async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
  }

  const { customerName, customerPhone, deliveryAddress, items } = parsed.data;

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
    };
  });

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
  };

  await db.insert(orders).values(order);

  res.status(201).json({ data: { ...order, items: enrichedItems } });
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

export default router;
