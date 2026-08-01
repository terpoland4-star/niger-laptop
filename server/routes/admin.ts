import { Router } from "express";
import { db } from "../db/index";
import { admins, products, productHistory } from "../db/schema";
import { eq } from "drizzle-orm";
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
  category: z.string().min(1),
  condition: z.string().min(1),
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

export default router;
