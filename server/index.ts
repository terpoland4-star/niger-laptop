import "dotenv/config";
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routes/api";
import adminRouter from "./routes/admin";
import nitaRouter from "./routes/nita";
import accountingRouter from "./routes/accounting";
import customerAuthRouter from "./routes/customerAuth";
import agentRouter from "./routes/agent";
import cron from "node-cron";
import { cleanupOldCarts } from "./jobs/cleanupCarts";
import { expireNitaTransactions } from "./jobs/expireNitaTransactions";
import { setupSSR } from "./ssr";
import sitemapRouter from "./routes/sitemap";

function scrub(obj: any) {
  const sensitiveKeys = ["password", "apikey", "api_key", "token", "authorization", "secret"];
  if (!obj || typeof obj !== "object") return obj;
  for (const key of Object.keys(obj)) {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      obj[key] = "[Filtered]";
    } else if (typeof obj[key] === "object") {
      scrub(obj[key]);
    }
  }
  return obj;
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  beforeSend(event) {
    if (event.request) scrub(event.request);
    if (event.extra) scrub(event.extra);
    if (event.contexts) scrub(event.contexts);
    return event;
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const server = createServer(app);

  app.use(cors({
    origin: [
      "https://niger-laptops.com",
      "https://www.niger-laptops.com",
    ],
  }));

  app.use(express.json());
  app.use("/api", apiRouter);
  app.use("/api", nitaRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/accounting", accountingRouter);
  app.use("/api/auth", customerAuthRouter);
  app.use("/api/agent", agentRouter);
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath, { index: false })); // index:false — sinon Express sert dist/public/index.html brut (placeholders non remplis) pour "/" avant même d'atteindre le SSR

  Sentry.setupExpressErrorHandler(app);

  app.use(sitemapRouter); // avant setupSSR : sinon le catch-all SSR intercepte /sitemap.xml en premier
  await setupSSR(app, process.env.NODE_ENV === "production");

  const port = process.env.PORT || 3000;

  cron.schedule("0 3 * * *", () => {
    cleanupOldCarts().catch(console.error);
  });

  cron.schedule("0 * * * *", () => {
    expireNitaTransactions().catch(console.error);
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
