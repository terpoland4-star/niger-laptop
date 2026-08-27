import { Router } from "express";
import { db } from "../db/index";
import { orders, nitaTransactions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { createNitaAchat, syncNitaTransactionStatus } from "../services/nitaAchat";
import { NitaApiError } from "../lib/nita";

const router = Router();

const payLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez dans une minute." },
  keyGenerator: (req) => (req.ip ? ipKeyGenerator(req.ip) : "unknown"),
});

/**
 * POST /api/orders/:id/pay-with-nita
 * Déclenché quand le client choisit "Payer avec NITA" pour une commande
 * déjà créée. Idempotent : si une référence active existe déjà pour cette
 * commande, elle est renvoyée telle quelle plutôt que d'en créer une nouvelle.
 */
router.post("/orders/:id/pay-with-nita", payLimiter, async (req, res) => {
  const orderId = req.params.id;

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  if (order.isPaid) {
    return res.status(400).json({ error: "Cette commande est déjà payée" });
  }

  // Idempotence : réutiliser une référence active non expirée si elle existe
  const nowIso = new Date().toISOString();
  const [existing] = await db
    .select()
    .from(nitaTransactions)
    .where(
      and(
        eq(nitaTransactions.orderId, orderId),
        eq(nitaTransactions.status, "0"),
        gt(nitaTransactions.expiresAt, nowIso)
      )
    );

  if (existing) {
    return res.json({
      data: {
        codeAchat: existing.codeAchat,
        montant: existing.montant,
        expiresAt: existing.expiresAt,
        reused: true,
      },
    });
  }

  // Montant TOUJOURS recalculé depuis la commande en base, jamais depuis le body client
  let items: { productName: string }[] = [];
  try {
    items = JSON.parse(order.itemsJson);
  } catch {
    items = [];
  }
  const descriptionAchat =
    items.length > 0
      ? items.map((i) => i.productName)
      : [`Commande ${order.orderNumber}`];

  try {
    const record = await createNitaAchat({
      descriptionAchat,
      montantTransaction: order.total,
      motifTransaction: `Achat commande ${order.orderNumber}`,
      phoneClient: order.customerPhone,
      adresseIp: req.ip ?? "unknown",
      orderId: order.id,
      urlCallback: process.env.NITA_CALLBACK_URL || undefined,
      expiresInHours: 48,
    });

    res.status(201).json({
      data: {
        codeAchat: record.codeAchat,
        montant: record.montant,
        expiresAt: record.expiresAt,
        reused: false,
      },
    });
  } catch (err) {
    if (err instanceof NitaApiError) {
      console.error("[nita] Échec création achat:", err.message, err.raw);
      
      // Transmettre les erreurs de validation spécifiques (ex: montant invalide) au frontend
      if (err.message.includes("Montant") || err.raw?.code === 400) {
        return res.status(400).json({ error: err.message });
      }
      
      // Garder le message générique uniquement pour les vraies pannes de service (502)
      return res.status(502).json({ error: "Le service de paiement NITA est momentanément indisponible. Réessayez dans un instant." });
    }
    throw err;
  }
});


/**
 * GET /api/orders/:id/nita-status
 * Vérifie l'état réel du paiement auprès de NITA (jamais en se fiant
 * uniquement à notre base) et synchronise orders + nita_transactions
 * si le statut a changé.
 */
router.get("/orders/:id/nita-status", async (req, res) => {
  const orderId = req.params.id;

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  const [transaction] = await db
    .select()
    .from(nitaTransactions)
    .where(eq(nitaTransactions.orderId, orderId));

  if (!transaction) {
    return res.status(404).json({ error: "Aucune tentative de paiement NITA trouvée pour cette commande" });
  }

  try {
    const result = await syncNitaTransactionStatus(transaction.id, req.ip ?? "unknown");
    res.json({ data: result });
  } catch (err) {
    if (err instanceof NitaApiError) {
      console.error("[nita] Échec vérification statut:", err.message, err.raw);
      return res.status(502).json({ error: "Impossible de vérifier le statut du paiement pour le moment." });
    }
    throw err;
  }
});


/**
 * POST /api/nita/callback
 * Reçoit la notification de NITA suite à un paiement.
 * SÉCURITÉ : ce endpoint ne fait jamais confiance au contenu reçu pour
 * marquer un paiement comme validé. Il ne sert que de déclencheur pour
 * revérifier l'état réel via checkAchatStatus (source de vérité unique).
 * La doc NITA ne fournit aucune signature/secret pour authentifier ces
 * appels, donc on traite ce endpoint comme potentiellement non fiable.
 */
router.post("/nita/callback", async (req, res) => {
  const codeAchat: string | undefined = req.body?.codeAchat;
  const requestIdFromBody: string | undefined = req.body?.requestId;

  if (!codeAchat && !requestIdFromBody) {
    // Réponse 200 quand même : NITA ne doit pas retenter indéfiniment
    // sur un appel malformé qui n'est de toute façon pas exploitable.
    console.warn("[nita][callback] Callback reçu sans codeAchat ni requestId");
    return res.status(200).json({ received: true });
  }

  const [transaction] = await db
    .select()
    .from(nitaTransactions)
    .where(
      codeAchat
        ? eq(nitaTransactions.codeAchat, codeAchat)
        : eq(nitaTransactions.requestId, requestIdFromBody!)
    );

  if (!transaction) {
    console.warn("[nita][callback] Transaction introuvable pour", { codeAchat, requestIdFromBody });
    return res.status(200).json({ received: true });
  }

  try {
    const result = await syncNitaTransactionStatus(transaction.id, req.ip ?? "unknown");
    console.log("[nita][callback] Statut synchronisé:", result);
  } catch (err) {
    // On log l'échec mais on répond quand même 200 : c'est NOUS qui
    // réessaierons via le job de reconciliation, pas NITA qui doit retenter.
    console.error("[nita][callback] Échec de synchronisation:", err);
  }

  res.status(200).json({ received: true });
});

export default router;
