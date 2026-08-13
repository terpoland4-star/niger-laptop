export type ProductCategory =
  | "computers"
  | "components"
  | "storage"
  | "peripherals"
  | "monitors"
  | "networking"
  | "printers"
  | "gaming"
  | "phones_tablets"
  | "software"
  | "accessories";

export interface Product {
  id: string;
  nameEn: string;
  nameFr: string;
  category: ProductCategory;
  condition: "new" | "used";
  price: number;
  oldPrice?: number | null;
  image: string;
  description?: string;
  stockQuantity?: number;
  featured?: boolean;
  rating?: number | null;
}

export const categories: Record<ProductCategory, { en: string; fr: string }> = {
  computers: { en: "Computers", fr: "Ordinateurs" },
  components: { en: "Components", fr: "Composants" },
  storage: { en: "Storage", fr: "Stockage" },
  peripherals: { en: "Peripherals", fr: "Périphériques" },
  monitors: { en: "Monitors", fr: "Écrans" },
  networking: { en: "Networking", fr: "Réseau" },
  printers: { en: "Printers", fr: "Imprimantes" },
  gaming: { en: "Gaming", fr: "Gaming" },
  phones_tablets: { en: "Phones & Tablets", fr: "Téléphones & Tablettes" },
  software: { en: "Software", fr: "Logiciels" },
  accessories: { en: "Accessories", fr: "Accessoires" },
};

export const conditions = {
  new: { en: "New", fr: "Neuf" },
  used: { en: "Used", fr: "Occasion" },
};
