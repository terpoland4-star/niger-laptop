import { useState, useMemo } from "react";
import { categories, Product } from "@/lib/productLabels";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";

interface CatalogProps {
  language?: "en" | "fr";
  searchQuery?: string;
  onAddToCart?: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
}

export const Catalog = ({ language = "fr", searchQuery = "", onAddToCart, onOrderNow }: CatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | Product["category"]>("all");
  const { products, isLoading, error } = useProducts(language);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const name = (language === "en" ? p.nameEn : p.nameFr).toLowerCase();
        const description = (p.description || "").toLowerCase();
        const categoryLabel = categories[p.category][language].toLowerCase();
        return name.includes(q) || description.includes(q) || categoryLabel.includes(q);
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery, language]);

  const categoryList: Array<{ key: "all" | Product["category"]; label: string }> = [
    { key: "all", label: language === "en" ? "All Products" : "Tous les produits" },
    { key: "computers", label: categories.computers[language] },
    { key: "storage", label: categories.storage[language] },
    { key: "accessories", label: categories.accessories[language] }
  ];

  const handleWishlistToggle = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: language === "en" ? product.nameEn : product.nameFr,
        imageUrl: product.image,
        addedAt: Date.now()
      });
    }
  };

  return (
    <section id="catalog" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === "en" ? "Our Catalog" : "Notre Catalogue"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Explore our carefully selected collection of premium tech products"
              : "Explorez notre sélection minutieuse de produits informatiques premium"}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categoryList.map((cat) => (
            <Button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              variant={selectedCategory === cat.key ? "default" : "outline"}
              className={`rounded-full px-6 py-2 transition-all duration-200 ${
                selectedCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-border hover:border-primary"
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {language === "en" ? "Loading products..." : "Chargement des produits..."}
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInWishlist={isInWishlist(product.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={onAddToCart}
                  onOrderNow={onOrderNow}
                  language={language}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {language === "en" ? "No products found" : "Aucun produit trouvé"}
                </p>
              </div>
            )}

            <div className="text-center mt-12 text-muted-foreground">
              <p className="text-sm">
                {language === "en"
                  ? `Showing ${filteredProducts.length} of ${products.length} products`
                  : `Affichage de ${filteredProducts.length} sur ${products.length} produits`}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
