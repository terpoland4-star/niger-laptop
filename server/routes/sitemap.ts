import { Router } from "express";
import { db } from "../db/index";
import { products } from "../db/schema";

const router = Router();

router.get("/sitemap.xml", async (_req, res) => {
  const allProducts = await db.select().from(products);

  const urls = [
    { loc: "https://www.niger-laptops.com/", changefreq: "daily", priority: "1.0" },
    { loc: "https://www.niger-laptops.com/#catalog", changefreq: "daily", priority: "0.9" },
    ...allProducts.map((p) => ({
      loc: `https://www.niger-laptops.com/produit/${p.id}`,
      changefreq: "weekly",
      priority: "0.8",
    })),
    { loc: "https://www.niger-laptops.com/#about", changefreq: "monthly", priority: "0.5" },
    { loc: "https://www.niger-laptops.com/#contact", changefreq: "monthly", priority: "0.5" },
    { loc: "https://www.niger-laptops.com/confidentialite", changefreq: "yearly", priority: "0.3" },
    { loc: "https://www.niger-laptops.com/conditions", changefreq: "yearly", priority: "0.3" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml").send(xml);
});

export default router;
