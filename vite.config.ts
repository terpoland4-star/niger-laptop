import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

process.env.BROWSERSLIST_IGNORE_OLD_DATA = "true";

const plugins = [
  react(),
  tailwindcss(),
  VitePWA({
    strategies: "generateSW",
    injectRegister: "auto",
    manifest: false,
    includeManifestIcons: false,
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      navigateFallback: "/index.html",
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.niger-laptops\.com\/api\/products/,
          handler: "NetworkFirst",
          options: {
            cacheName: "products-cache",
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
          },
        },
      ],
    },
  }),
];

export default defineConfig({
  plugins,
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(import.meta.dirname, "client/src/test/setup.ts")],
  },
  css: {
    transformer: 'postcss',
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".niger-laptops.com",
      "terpoland4-star.github.io",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
