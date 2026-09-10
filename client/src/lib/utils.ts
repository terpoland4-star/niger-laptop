import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Chemin déjà absolu (/uploads, /assets) -> on garde
  if (path.startsWith("/")) return path;
  // Relatif -> on préfixe /
  return `/${path}`;
}
