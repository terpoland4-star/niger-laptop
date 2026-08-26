import { db } from "../db/index";
import { nitaTransactions } from "../db/schema";
import { eq, and, lt } from "drizzle-orm";
import { cancelAchat, NitaApiError } from "../lib/nita";

/**
 * Annule côté NITA et marque comme expirées les transactions restées
 * en statut "0" (non payé) au-delà de leur date d'expiration.
 * Filet de sécurité pour ne jamais laisser une référence de paiement
 * traîner indéfiniment, ni chez nous ni chez NITA.
 */
export async function expireNitaTransactions() {
  const nowIso = new Date().toISOString();

  const expired = await db
    .select()
    .from(nitaTransactions)
    .where(and(eq(nitaTransactions.status, "0"), lt(nitaTransactions.expiresAt, nowIso)));

  if (expired.length === 0) {
    return { checked: 0, expired: 0, failed: 0 };
  }

  let expiredCount = 0;
  let failedCount = 0;

  for (const tx of expired) {
    try {
      await cancelAchat({
        codeAchat: tx.codeAchat ?? "",
        requestId: tx.requestId,
        adresseIp: tx.adresseIp ?? "unknown",
      });

      await db
        .update(nitaTransactions)
        .set({ status: "2", updatedAt: nowIso })
        .where(eq(nitaTransactions.id, tx.id));

      expiredCount++;
    } catch (err) {
      failedCount++;
      if (err instanceof NitaApiError) {
        console.error(
          `[nita][expire] Échec annulation ${tx.requestId} (codeAchat: ${tx.codeAchat}):`,
          err.message,
          err.raw
        );
      } else {
        console.error(`[nita][expire] Erreur inattendue pour ${tx.requestId}:`, err);
      }
      // On ne marque PAS la transaction comme expirée si l'annulation côté
      // NITA a échoué : on la retentera au prochain passage du cron.
    }
  }

  console.log(
    `[nita][expire] ${expired.length} transaction(s) expirée(s) trouvée(s), ${expiredCount} annulée(s), ${failedCount} échec(s)`
  );

  return { checked: expired.length, expired: expiredCount, failed: failedCount };
}
