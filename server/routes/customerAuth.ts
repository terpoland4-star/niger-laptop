import { Router } from "express";
import { db } from "../db/index";
import { customers, orders } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireCustomer, CustomerAuthenticatedRequest } from "../middleware/customerAuth";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez dans 15 minutes." },
});

function signCustomerToken(customer: { id: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET manquant");
  }
  return jwt.sign(
    { id: customer.id, email: customer.email, type: "customer" },
    secret,
    { expiresIn: "30d" }
  );
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(1),
  phone: z.string().optional(),
});

router.post("/register", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Données invalides" });
  }
  const { email, password, name, phone } = parsed.data;

  const existing = await db.select().from(customers).where(eq(customers.email, email));
  if (existing.length > 0) {
    return res.status(409).json({ error: "Un compte existe déjà avec cet email" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await db.insert(customers).values({ id, email, passwordHash, name, phone, createdAt });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[customerAuth] JWT_SECRET manquant");
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  const token = signCustomerToken({ id, email });
  res.status(201).json({ data: { token, customer: { id, email, name, phone: phone ?? null } } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email ou mot de passe invalide" });
  }
  const { email, password } = parsed.data;

  const result = await db.select().from(customers).where(eq(customers.email, email));
  if (result.length === 0) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const customer = result[0];
  const validPassword = await bcrypt.compare(password, customer.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("[customerAuth] JWT_SECRET manquant");
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  const token = signCustomerToken({ id: customer.id, email: customer.email });
  res.json({
    data: {
      token,
      customer: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
    },
  });
});

router.get("/me", requireCustomer, async (req: CustomerAuthenticatedRequest, res) => {
  const result = await db.select().from(customers).where(eq(customers.id, req.customer!.id));
  if (result.length === 0) {
    return res.status(404).json({ error: "Compte introuvable" });
  }
  const customer = result[0];
  res.json({
    data: { id: customer.id, email: customer.email, name: customer.name, phone: customer.phone },
  });
});

router.get("/orders", requireCustomer, async (req: CustomerAuthenticatedRequest, res) => {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, req.customer!.id))
    .orderBy(desc(orders.createdAt));
  res.json({ data: result });
});

export default router;
