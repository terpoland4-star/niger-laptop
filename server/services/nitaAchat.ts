import crypto from "crypto";
import { db } from "../db/index";
import { nitaTransactions } from "../db/schema";
import { createAchat, NitaApiError } from "../lib/nita";

/**
 * Service partagé pour la création d'un achat MyNita.
 * Utilisé à la fois par la route publique (panier client) et la route admin
 * (création manuelle), pour garantir un comportement identique et un seul
 * point de vérité sur la logique métier.
 */

export interface CreateNitaAchatInput {
  descriptionAchat: string[];
  montantTransaction: number;
  motifTransaction: string;
  phoneClient: string;
  adresseIp: string;
  orderId?: string | null;
  longTransaction?: string | null;
  latTransaction?: string | null;
  urlCallback?: string | null;
  /** Durée de validité de la référence d'achat avant expiration, en heures (défaut : 48h) */
  expiresInHours?: number;
}

export interface NitaAchatRecord {
  id: string;
  orderId: string | null;
  requestId: string;
  codeAchat: string | null;
  montant: number;
  motifTransaction: string | null;
  longTransaction: string | null;
  latTransaction: string | null;
  urlCallback: string | null;
  status: string;
  phoneClient: string;
  adresseIp: string;
  descriptionAchat: string;
  rawResponse: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string | null;
}

export async function createNitaAchat(
  input: CreateNitaAchatInput
): Promise<NitaAchatRecord> {
  const requestId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + (input.expiresInHours ?? 48) * 60 * 60 * 1000
  ).toISOString();

  const response = await createAchat({
    descriptionAchat: input.descriptionAchat,
    montantTransaction: input.montantTransaction,
    motifTransaction: input.motifTransaction,
    requestId,
    phoneClient: input.phoneClient,
    adresseIp: input.adresseIp,
    longTransaction: input.longTransaction ?? undefined,
    latTransaction: input.latTransaction ?? undefined,
    urlCallback: input.urlCallback ?? undefined,
  });

  const data = (response as any)?.data ?? {};
  const codeAchat: string | null = data.codeAchat ?? null;

  const record: NitaAchatRecord = {
    id: crypto.randomUUID(),
    orderId: input.orderId ?? null,
    requestId,
    codeAchat,
    montant: input.montantTransaction,
    motifTransaction: input.motifTransaction,
    longTransaction: input.longTransaction ?? null,
    latTransaction: input.latTransaction ?? null,
    urlCallback: input.urlCallback ?? null,
    status: "0",
    phoneClient: input.phoneClient,
    adresseIp: input.adresseIp,
    descriptionAchat: JSON.stringify(input.descriptionAchat),
    rawResponse: JSON.stringify(response),
    expiresAt,
    createdAt: now.toISOString(),
    updatedAt: null,
  };

  await db.insert(nitaTransactions).values(record);

  return record;
}

export { NitaApiError };

/**
 * Vérifie l'état réel d'une transaction NITA auprès de leur API,
 * synchronise nita_transactions + orders si le statut a changé.
 * Utilisée à la fois par la route de statut (polling frontend) et
 * par le callback NITA (jamais fait confiance seul, toujours revérifié ici).
 */
export async function syncNitaTransactionStatus(
  transactionId: string,
  adresseIp: string
): Promise<{ status: string; codeAchat: string | null; isPaid: boolean }> {
  const { checkAchatStatus } = await import("../lib/nita");
  const { orders, orderStatusHistory } = await import("../db/schema");
  const { eq } = await import("drizzle-orm");

  const [transaction] = await db
    .select()
    .from(nitaTransactions)
    .where(eq(nitaTransactions.id, transactionId));

  if (!transaction) {
    throw new Error("Transaction NITA introuvable");
  }

  if (transaction.status === "1") {
    return { status: transaction.status, codeAchat: transaction.codeAchat, isPaid: true };
  }

  const response = await checkAchatStatus({
    requestId: transaction.requestId,
    adresseIp,
  });

  const data = (response as any)?.data ?? {};
  const newStatus: string = data.code ?? transaction.status;
  const now = new Date().toISOString();

  await db
    .update(nitaTransactions)
    .set({ status: newStatus, rawResponse: JSON.stringify(response), updatedAt: now })
    .where(eq(nitaTransactions.id, transaction.id));

  if (newStatus === "1" && transaction.orderId) {
    const [order] = await db.select().from(orders).where(eq(orders.id, transaction.orderId));
    if (order && !order.isPaid) {
      await db
        .update(orders)
        .set({ isPaid: true, paidAt: now, channel: "nita" })
        .where(eq(orders.id, transaction.orderId));

      await db.insert(orderStatusHistory).values({
        id: crypto.randomUUID(),
        orderId: transaction.orderId,
        status: order.status,
        note: `Paiement confirmé via NITA (codeAchat: ${transaction.codeAchat})`,
        changedBy: null,
        createdAt: now,
      });
    }
  }

  return { status: newStatus, codeAchat: transaction.codeAchat, isPaid: newStatus === "1" };
}
