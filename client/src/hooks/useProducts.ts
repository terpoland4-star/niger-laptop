import { useState, useEffect } from "react";
import { Product } from "@/lib/productLabels";
import { getImageUrl } from "@/lib/utils";

interface ApiProduct {
  id: string;
  nameFr: string;
  nameEn: string;
  category: string;
  condition: string;
  price: number;
  oldPrice: number | null;
  thumbnail: string;
  featured: boolean;
  rating: number | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  stockQuantity: number;
}

const API_BASE = "https://api.niger-laptops.com";

export const useProducts = (language: "en" | "fr" = "fr") => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error("Erreur réseau");
        const { data } = await res.json();
        if (cancelled) return;

        const mapped: Product[] = (data as ApiProduct[]).map(p => ({
          id: p.id,
          nameFr: p.nameFr,
          nameEn: p.nameEn,
          category: p.category as Product["category"],
          condition: p.condition as Product["condition"],
          price: p.price,
          oldPrice: p.oldPrice,
          image: getImageUrl(p.thumbnail),
          description:
            language === "en"
              ? (p.descriptionEn ?? undefined)
              : (p.descriptionFr ?? undefined),
          stockQuantity: p.stockQuantity,
          featured: p.featured,
          rating: p.rating,
        }));
        setProducts(mapped);
      } catch {
        if (!cancelled)
          setError("Impossible de charger les produits. Réessayez plus tard.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  return { products, isLoading, error };
};
