import { Router } from "express";
import { db } from "../db/index";
import { deliveryAgents, deliveries, agentLocations, orders } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { requireAgent, AgentRequest } from "../middleware/agentAuth";

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

// ---------- Login ----------
router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Identifiants invalides" });
  }
  const { email, password } = parsed.data;

  const [agent] = await db
    .select()
    .from(deliveryAgents)
    .where(eq(deliveryAgents.email, email.toLowerCase().trim()));

  if (!agent || !agent.active) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  const valid = await bcrypt.compare(password, agent.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  const token = jwt.sign(
    { id: agent.id, email: agent.email, name: agent.name, kind: "agent" },
    secret,
    { expiresIn: "12h" }
  );

  res.json({
    data: {
      token,
      agent: { id: agent.id, email: agent.email, name: agent.name },
    },
  });
});

// ---------- Mes courses ----------
router.get("/deliveries", requireAgent, async (req: AgentRequest, res) => {
  const myDeliveries = await db
    .select()
    .from(deliveries)
    .where(and(eq(deliveries.agentId, req.agent!.id), ne(deliveries.status, "delivered")));

  const enriched = await Promise.all(
    myDeliveries.map(async d => {
      const [order] = await db.select().from(orders).where(eq(orders.id, d.orderId));
      return { ...d, order: order ?? null };
    })
  );

  res.json({ data: enriched });
});

// ---------- Changer le statut d'une course ----------
const statusSchema = z.object({
  status: z.enum(["picked_up", "en_route", "delivered"]),
});

router.patch("/deliveries/:id/status", requireAgent, async (req: AgentRequest, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  const [delivery] = await db
    .select()
    .from(deliveries)
    .where(and(eq(deliveries.id, req.params.id), eq(deliveries.agentId, req.agent!.id)));

  if (!delivery) {
    return res.status(404).json({ error: "Course introuvable" });
  }

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.status === "picked_up" && !delivery.startedAt) {
    updates.startedAt = now;
  }
  if (parsed.data.status === "delivered") {
    updates.deliveredAt = now;
  }

  await db.update(deliveries).set(updates).where(eq(deliveries.id, req.params.id));
  res.json({ ok: true });
});

// ---------- Ping de position ----------
const pingSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

router.post("/location", requireAgent, async (req: AgentRequest, res) => {
  const parsed = pingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Coordonnées invalides" });
  }

  const now = new Date().toISOString();
  const existing = await db
    .select()
    .from(agentLocations)
    .where(eq(agentLocations.agentId, req.agent!.id));

  if (existing.length > 0) {
    await db
      .update(agentLocations)
      .set({ lat: parsed.data.lat, lng: parsed.data.lng, updatedAt: now })
      .where(eq(agentLocations.agentId, req.agent!.id));
  } else {
    await db.insert(agentLocations).values({
      agentId: req.agent!.id,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      updatedAt: now,
    });
  }

  res.json({ ok: true });
});

export default router;
