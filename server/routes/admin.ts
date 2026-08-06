import { Router } from "express";
import { db } from "../db/index";
import { admins, products, productHistory, orders, customers, orderStatusHistory } from "../db/schema";
import { sendOrderStatusUpdateEmail, sendReceiptEmail } from "../lib/notifications";
import { generateReceiptPdf } from "../lib/receipt";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives de connexion, réessayez dans 15 minutes." },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email ou mot de passe invalide" });
  }

  const { email, password } = parsed.data;

  const result = await db.select().from(admins).where(eq(admins.email, email));
  if (result.length === 0) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const admin = result[0];
  const validPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[admin] JWT_SECRET manquant");
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    secret,
    { expiresIn: "8h" }
  );

  res.json({ data: { token, admin: { id: admin.id, email: admin.email, role: admin.role } } });
});

const productSchema = z.object({
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  category: z.enum(["computers", "storage", "accessories"], {
    message: "Catégorie invalide (computers, storage ou accessories attendu)",
  }),
  condition: z.enum(["new", "used"], {
    message: "État invalide (new ou used attendu)",
  }),
  price: z.number().int().positive().optional(),
  oldPrice: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  descriptionFr: z.string().optional(),
  descriptionEn: z.string().optional(),
  stockQuantity: z.number().int().min(0).optional(),
});

router.post("/products", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
  }

  const id = randomUUID();
  const productData = { id, ...parsed.data };

  await db.insert(products).values(productData);

  await db.insert(productHistory).values({
    id: randomUUID(),
    productId: id,
    action: "create",
    changesJson: JSON.stringify(parsed.data),
    adminId: req.admin!.id,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ data: productData });
});

const productUpdateSchema = productSchema.partial();

router.put("/products/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
  }

  const productId = req.params.id;
  const existing = await db.select().from(products).where(eq(products.id, productId));
  if (existing.length === 0) {
    return res.status(404).json({ error: "Produit non trouvé" });
  }

  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({ error: "Aucun champ à mettre à jour" });
  }

  await db.update(products).set(parsed.data).where(eq(products.id, productId));

  await db.insert(productHistory).values({
    id: randomUUID(),
    productId,
    action: "update",
    changesJson: JSON.stringify(parsed.data),
    adminId: req.admin!.id,
    createdAt: new Date().toISOString(),
  });

  const updated = await db.select().from(products).where(eq(products.id, productId));
  res.json({ data: updated[0] });
});

router.get("/products/:id/history", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const productId = req.params.id;
  const history = await db
    .select()
    .from(productHistory)
    .where(eq(productHistory.productId, productId));

  res.json({ data: history });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "products"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non autorisé (jpg, png, webp uniquement)"));
    }
  },
});

router.post(
  "/products/:id/image",
  requireAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: AuthenticatedRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const productId = req.params.id;
    const existing = await db.select().from(products).where(eq(products.id, productId));
    if (existing.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    const thumbnailUrl = `uploads/products/${req.file.filename}`;

    await db.update(products).set({ thumbnail: thumbnailUrl }).where(eq(products.id, productId));

    await db.insert(productHistory).values({
      id: randomUUID(),
      productId,
      action: "update_image",
      changesJson: JSON.stringify({ thumbnail: thumbnailUrl }),
      adminId: req.admin!.id,
      createdAt: new Date().toISOString(),
    });

    res.json({ data: { thumbnail: thumbnailUrl } });
  }
);



const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const statusUpdateSchema = z.object({
  status: z.enum(VALID_STATUSES, {
    message: "Statut invalide (pending, confirmed, shipped, delivered ou cancelled attendu)",
  }),
  note: z.string().optional(),
});

router.get("/orders", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  res.json({ data: allOrders });
});

router.patch("/orders/:id/status", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = statusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
  }

  const orderId = req.params.id;
  const existing = await db.select().from(orders).where(eq(orders.id, orderId));
  if (existing.length === 0) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  const { status, note } = parsed.data;
  const order = existing[0];

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    id: randomUUID(),
    orderId,
    status,
    note: note ?? null,
    changedBy: req.admin!.id,
    createdAt: new Date().toISOString(),
  });

  // Notifie le client par email si la commande est liée à un compte
  if (order.customerId) {
    const customerResult = await db.select().from(customers).where(eq(customers.id, order.customerId));
    if (customerResult.length > 0 && customerResult[0].email) {
      const customer = customerResult[0];
      sendOrderStatusUpdateEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        toEmail: customer.email,
        status,
      }).catch((err) => console.error("[orders] Erreur notification statut:", err));
    } else {
      console.log(`[orders] Pas d'email pour la commande ${order.orderNumber}, notification statut ignorée`);
    }
  }

  const updated = await db.select().from(orders).where(eq(orders.id, orderId));
  res.json({ data: updated[0] });
});

router.patch("/orders/:id/mark-paid", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const orderId = req.params.id;
  const existing = await db.select().from(orders).where(eq(orders.id, orderId));
  if (existing.length === 0) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  const order = existing[0];

  if (order.isPaid) {
    return res.status(400).json({ error: "Cette commande est déjà marquée comme payée" });
  }

  const paidAt = new Date().toISOString();

  let receiptPath: string;
  try {
    const items = JSON.parse(order.itemsJson);
    receiptPath = generateReceiptPdf({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      total: order.total,
      items,
      paidAt,
    });
  } catch (err) {
    console.error("[orders] Échec génération du reçu PDF:", err);
    return res.status(500).json({ error: "Erreur lors de la génération du reçu" });
  }

  await db
    .update(orders)
    .set({ isPaid: true, paidAt })
    .where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    id: randomUUID(),
    orderId,
    status: order.status,
    note: "Commande marquée comme payée, reçu généré",
    changedBy: req.admin!.id,
    createdAt: paidAt,
  });

  const API_BASE_URL = "https://api.niger-laptops.com";
  const absoluteReceiptUrl = `${API_BASE_URL}/${receiptPath}`;

  if (order.customerId) {
    const customerResult = await db.select().from(customers).where(eq(customers.id, order.customerId));
    if (customerResult.length > 0 && customerResult[0].email) {
      sendReceiptEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        toEmail: customerResult[0].email,
        receiptUrl: absoluteReceiptUrl,
        total: order.total,
      }).catch((err) => console.error("[orders] Erreur envoi email reçu:", err));
    } else {
      console.log(`[orders] Pas d'email pour la commande ${order.orderNumber}, envoi du reçu par email ignoré`);
    }
  }

  const updatedOrder = await db.select().from(orders).where(eq(orders.id, orderId));
  res.json({ data: { ...updatedOrder[0], receiptUrl: absoluteReceiptUrl } });
});


router.get("/customers", requireAdmin, async (req: AuthenticatedRequest, res) => {
  const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
  const allOrders = await db.select({ customerId: orders.customerId }).from(orders);

  const orderCounts: Record<string, number> = {};
  for (const o of allOrders) {
    if (o.customerId) {
      orderCounts[o.customerId] = (orderCounts[o.customerId] || 0) + 1;
    }
  }

  const data = allCustomers.map((c) => ({
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    createdAt: c.createdAt,
    orderCount: orderCounts[c.id] || 0,
  }));

  res.json({ data });
});

export default router;
