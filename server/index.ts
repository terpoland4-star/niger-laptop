import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./routes/api";
import adminRouter from "./routes/admin";
import cron from "node-cron";
import { cleanupOldCarts } from "./jobs/cleanupCarts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(cors({
    origin: [
      "https://niger-laptops.com",
      "https://www.niger-laptops.com",
    ],
  }));

  app.use(express.json());
  app.use("/api", apiRouter);
  app.use("/api/admin", adminRouter);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  cron.schedule("0 3 * * *", () => {
    cleanupOldCarts().catch(console.error);
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
