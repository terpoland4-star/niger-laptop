import { useState, useMemo, useEffect, useRef } from "react";
import { categories, Product } from "@/lib/productLabels";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { SlidersHorizontal } from "lucide-react";
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { products, isLoading, error } = useProducts(language);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);
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

  const browseMode =
    selectedCategory === "all" && !searchQuery.trim() && sortBy === "default";

  const categoryList: Array<{
    key: "all" | Product["category"];
    label: string;
  }> = [
    {
      key: "all",
      label: language === "en" ? "All Products" : "Tous les produits",
    },
    ...(Object.keys(categories) as Array<Product["category"]>).map(key => ({
      key,
      label: categories[key][language],
    })),
  ];

  const sortOptions: Array<{ key: typeof sortBy; label: string }> = [
    { key: "default", label: language === "en" ? "Sort by" : "Trier par" },
    {
      key: "price-asc",
      label: language === "en" ? "Price: Low to High" : "Prix croissant",
    },
    {
      key: "price-desc",
      label: language === "en" ? "Price: High to Low" : "Prix décroissant",
    },
    { key: "rating", label: language === "en" ? "Top Rated" : "Mieux notés" },
  ];

  const hasActiveFilters = selectedCategory !== "all" || sortBy !== "default";

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

  const CategoryButtons = ({ large = false }: { large?: boolean }) => (
    <div className="flex flex-wrap gap-2">
      {categoryList.map(cat => (
        <Button
          key={cat.key}
          onClick={() => setSelectedCategory(cat.key)}
          variant={selectedCategory === cat.key ? "default" : "outline"}
          className={`rounded-full transition-all duration-200 ${
            large ? "px-6 py-3 text-sm" : "px-4 py-1.5 text-xs"
          } ${
            selectedCategory === cat.key
              ? "bg-primary text-primary-foreground"
              : "border-2 border-border hover:border-primary"
          }`}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );

  const SortSelect = ({ large = false }: { large?: boolean }) => (
    <select
      value={sortBy}
      onChange={e => setSortBy(e.target.value as typeof sortBy)}
      className={`border border-border rounded-lg bg-card text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all duration-200 ${
        large ? "text-sm px-3 py-3 w-full" : "text-xs px-3 py-1.5"
      }`}
    >
      {sortOptions.map(opt => (
        <option key={opt.key} value={opt.key}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  return (
    <section id="catalog" ref={sectionRef} className="py-16 bg-background">
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

        {/* Desktop — barre condensée sticky sous le header */}
        <div className="hidden md:flex sticky top-16 z-40 bg-background/95 backdrop-blur-sm justify-between items-center gap-4 py-3 mb-8 border-b border-border">
          <CategoryButtons />
          <div className="flex items-center gap-3 shrink-0">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {language === "en"
                ? `${filteredProducts.length} of ${products.length}`
                : `${filteredProducts.length} sur ${products.length}`}
            </p>
            <SortSelect />
          </div>
        </div>

        {/* Mobile — bouton fixe en bas, ouvre le drawer filtres */}
        <div
          className={`md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isSectionVisible
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <Drawer
            open={isFilterDrawerOpen}
            onOpenChange={setIsFilterDrawerOpen}
          >
            <DrawerTrigger asChild>
              <Button className="rounded-full px-5 py-3 shadow-lg flex items-center gap-2 bg-primary text-primary-foreground">
                <SlidersHorizontal size={16} />
                {language === "en" ? "Filters & Sort" : "Filtres & Tri"}
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {language === "en" ? "Filters & Sort" : "Filtres & Tri"}
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4 flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {language === "en" ? "Category" : "Catégorie"}
                  </p>
                  <CategoryButtons large />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {language === "en" ? "Sort by" : "Trier par"}
                  </p>
                  <SortSelect large />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {language === "en"
                    ? `${filteredProducts.length} of ${products.length} products`
                    : `${filteredProducts.length} sur ${products.length} produits`}
                </p>
                <DrawerClose asChild>
                  <Button className="w-full">
                    {language === "en" ? "Apply" : "Appliquer"}
                  </Button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

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

        {!isLoading && !error && browseMode && (
          <div className="space-y-12 pb-20 md:pb-0">
            {categoryList
              .filter(c => c.key !== "all")
              .map(cat => {
                const items = products.filter(p => p.category === cat.key);
                if (items.length === 0) return null;
                return (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {cat.label}
                      </h3>
                      <button
                        onClick={() => setSelectedCategory(cat.key)}
                        className="text-sm text-primary hover:underline shrink-0"
                      >
                        {language === "en" ? "View all" : "Voir tout"}
                      </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                      {items.map(product => (
                        <div
                          key={product.id}
                          className="shrink-0 w-[270px] sm:w-[290px] snap-start"
                        >
                          <ProductCard
                            product={product}
                            isInWishlist={isInWishlist(product.id)}
                            onWishlistToggle={handleWishlistToggle}
                            onAddToCart={onAddToCart}
                            onOrderNow={onOrderNow}
                            language={language}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {!isLoading && !error && !browseMode && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 md:pb-0">
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
