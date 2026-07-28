import { lt } from "drizzle-orm";
import { db } from "../db/index";
import { carts } from "../db/schema";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function cleanupOldCarts() {
  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
  const deleted = await db.delete(carts).where(lt(carts.updatedAt, cutoff)).returning();
  console.log(`[cleanupCarts] ${deleted.length} panier(s) supprimé(s) (non mis à jour depuis 30+ jours)`);
  return deleted.length;
}
