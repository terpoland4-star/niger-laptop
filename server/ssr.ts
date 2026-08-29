import type { Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PassThrough } from "stream";
import { resolveHead } from "./seo";

// ESM n'a pas de __dirname natif — contrairement à server/index.ts, ce module
// est séparé et doit le recalculer lui-même. Après le bundle esbuild, ce
// import.meta.url pointe vers dist/index.js (tout est fusionné dans un seul
// fichier), donc __dirname vaut bien dist/ en prod, comme prévu par
// path.resolve(__dirname, "public/index.html") plus bas.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupSSR(app: Express, isProd: boolean) {
  let vite: any;

  if (!isProd) {
    const { createServer } = await import("vite");
    vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
    app.use(vite.middlewares);
  }

  app.get("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();

    const url = req.originalUrl;

    try {
      const head = await resolveHead(url);
      const initialDataMap = head.initialData ? { [head.initialData.key]: head.initialData.value } : {};

      let template = fs.readFileSync(
        isProd
          ? path.resolve(__dirname, "public/index.html")
          : path.resolve(__dirname, "../client/index.html"),
        "utf-8"
      );

      if (!isProd) template = await vite.transformIndexHtml(url, template);

      const filledTemplate = template
        .replaceAll("<!--app-title-->", head.title)
        .replaceAll("<!--app-description-->", head.description)
        .replaceAll("<!--app-canonical-->", head.canonical)
        .replaceAll("<!--app-og-image-->", head.ogImage)
        .replace(
          "<!--app-jsonld-->",
          head.jsonLd
            ? `<script type="application/ld+json">${JSON.stringify(head.jsonLd)}</script>`
            : ""
        );

      const [before, rawAfter] = filledTemplate.split("<!--ssr-outlet-->");
      const serializedInitialData = JSON.stringify(initialDataMap).replace(/</g, "\\u003c");
      const after = rawAfter.replace(
        "</body>",
        `<script>window.__INITIAL_DATA__=${serializedInitialData};</script></body>`
      );

      const render = isProd
        ? // chemin construit à l'exécution : un littéral ici serait résolu et
          // inliné statiquement par esbuild au build de server/index.ts,
          // ce qui exécuterait tout l'arbre React (donc Leaflet) au démarrage
          // du process au lieu de la requête, et plante ("window is not defined")
          // @ts-ignore - bundle généré au build, pas de déclaration de types
          (await import(path.resolve(__dirname, "..", "dist", "server", "entry-server.js"))).render
        : (await vite.ssrLoadModule("/src/entry-server.tsx")).render;

      res.status(head.notFound ? 404 : 200).set({ "Content-Type": "text/html" });

      const reactStream = new PassThrough();
      reactStream.pipe(res, { end: false });
      reactStream.on("end", () => {
        res.end(after);
      });

      render(
        url,
        initialDataMap,
        reactStream,
        () => {
          res.write(before);
        },
        (err: unknown) => {
          console.error("[SSR] Erreur de rendu:", err);
          if (!isProd) vite.ssrFixStacktrace(err as Error);
          next(err);
        }
      );
    } catch (e) {
      console.error("[SSR] Erreur:", e);
      next(e);
    }
  });
}
