export interface Product {
  id: string;
  nameEn: string;
  nameFr: string;
  category: "computers" | "storage" | "accessories";
  condition: "new" | "used";
  price: number;
  oldPrice?: number | null;
  image: string;
  description?: string;
  stockQuantity?: number;
  featured?: boolean;
  rating?: number | null;
}

export const categories = {
  computers: { en: "Computers", fr: "Ordinateurs" },
  storage: { en: "Storage", fr: "Stockage" },
  accessories: { en: "Accessories", fr: "Accessoires" }
};

export const conditions = {
  new: { en: "New", fr: "Neuf" },
  used: { en: "Used", fr: "Occasion" }
};
