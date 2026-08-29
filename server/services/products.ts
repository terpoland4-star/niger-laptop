import { db } from "../db/index";
import { products } from "../db/schema";
import { eq } from "drizzle-orm";

export function parseProductSpecs<T extends { specs: string | null }>(product: T) {
  return {
    ...product,
    specs: product.specs ? JSON.parse(product.specs) : [],
  };
}

export async function getProductDetail(id: string) {
  const result = await db.select().from(products).where(eq(products.id, id));
  if (result.length === 0) return null;
  return parseProductSpecs(result[0]);
}
