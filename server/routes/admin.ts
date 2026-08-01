import { Router } from "express";
import { db } from "../db/index";
import { admins } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";

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

export default router;
