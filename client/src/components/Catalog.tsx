import { useState, useMemo } from "react";
import { categories, Product } from "@/lib/productLabels";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";

interface CatalogProps {
  language?: "en" | "fr";
  searchQuery?: string;
  onAddToCart?: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
}

export const Catalog = ({
  language = "fr",
  searchQuery = "",
  onAddToCart,
  onOrderNow,
}: CatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | Product["category"]
  >("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "rating"
  >("default");
  const { products, isLoading, error } = useProducts(language);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(p => {
        const name = (language === "en" ? p.nameEn : p.nameFr).toLowerCase();
        const description = (p.description || "").toLowerCase();
        const categoryLabel = categories[p.category][language].toLowerCase();
        return (
          name.includes(q) ||
          description.includes(q) ||
          categoryLabel.includes(q)
        );
      });
    }

    const sorted = [...result];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return sorted;
  }, [products, selectedCategory, searchQuery, language, sortBy]);

  const categoryList: Array<{
    key: "all" | Product["category"];
    label: string;
  }> = [
    {
      key: "all",
      label: language === "en" ? "All Products" : "Tous les produits",
    },
    { key: "computers", label: categories.computers[language] },
    { key: "storage", label: categories.storage[language] },
    { key: "accessories", label: categories.accessories[language] },
  ];

  const handleWishlistToggle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: language === "en" ? product.nameEn : product.nameFr,
        imageUrl: product.image,
        addedAt: Date.now(),
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

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categoryList.map(cat => (
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

        {!isLoading && !error && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-8">
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? `Showing ${filteredProducts.length} of ${products.length} products`
                : `Affichage de ${filteredProducts.length} sur ${products.length} produits`}
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all duration-200"
            >
              <option value="default">
                {language === "en" ? "Sort by" : "Trier par"}
              </option>
              <option value="price-asc">
                {language === "en" ? "Price: Low to High" : "Prix croissant"}
              </option>
              <option value="price-desc">
                {language === "en" ? "Price: High to Low" : "Prix décroissant"}
              </option>
              <option value="rating">
                {language === "en" ? "Top Rated" : "Mieux notés"}
              </option>
            </select>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
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
              {filteredProducts.map(product => (
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
                  {language === "en"
                    ? "No products found"
                    : "Aucun produit trouvé"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
