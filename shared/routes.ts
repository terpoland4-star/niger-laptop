// Liste des routes connues du SPA, partagée entre client (App.tsx)
// et serveur (ssr.ts) pour détecter les 404 côté SSR.
// Format wouter : ":param" pour un segment dynamique.
export const APP_ROUTES = [
  "/",
  "/confidentialite",
  "/conditions",
  "/compte",
  "/suivi/:orderNumber",
  "/produit/:id",
  "/admin/login",
  "/admin",
  "/admin/orders",
  "/admin/customers",
  "/admin/accounting",
  "/admin/deliveries",
  "/agent/login",
  "/agent",
  "/404",
] as const;

function routeToRegex(route: string): RegExp {
  const pattern = route
    .split("/")
    .map((seg) => (seg.startsWith(":") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    .join("/");
  return new RegExp(`^${pattern}/?$`);
}

const ROUTE_REGEXES = APP_ROUTES.map(routeToRegex);

export function matchesKnownRoute(pathname: string): boolean {
  return ROUTE_REGEXES.some((re) => re.test(pathname));
}
