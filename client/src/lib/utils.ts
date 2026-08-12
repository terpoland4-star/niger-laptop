import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE = "https://api.niger-laptops.com";

/**
 * Résout un chemin d'image renvoyé par l'API (ex: "uploads/products/xxx.jpg")
 * en URL absolue vers le VPS. Les URLs déjà absolues (http/https) sont
 * retournées telles quelles.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE}/${cleanPath}`;
}
