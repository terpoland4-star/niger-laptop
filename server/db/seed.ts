import { db } from "./index";
import { products } from "./schema";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const demoProducts = require("../data/demoData.js");

async function seed() {
  console.log(`Importation de ${demoProducts.length} produits...`);

  for (const p of demoProducts) {
    await db.insert(products).values({
      id: p.id,
      nameFr: p.name_fr,
      nameEn: p.name_en,
      category: p.category,
      condition: p.condition,
      price: p.price,
      oldPrice: p.oldPrice,
      thumbnail: p.thumbnail,
      featured: p.featured,
      rating: p.rating,
      descriptionFr: p.description_fr,
      descriptionEn: p.description_en,
      stockQuantity: p.stock_quantity,
    }).onConflictDoNothing();
  }

  console.log("Importation terminée !");
}

seed().catch(console.error);
