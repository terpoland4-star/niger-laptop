import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/productLabels";

interface FeaturedCarouselProps {
  language?: "en" | "fr";
  onAddToCart?: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
}

export const FeaturedCarousel = ({
  language = "fr",
  onAddToCart,
  onOrderNow,
}: FeaturedCarouselProps) => {
  const { products, isLoading } = useProducts(language);

  const highlighted = useMemo(() => {
    return products.filter(
      p => p.featured || (p.oldPrice != null && p.oldPrice > p.price)
    );
  }, [products]);

  const autoplayRef = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (isLoading || highlighted.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {language === "en" ? "Featured & Deals" : "Vedettes & Promos"}
          </h2>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[autoplayRef.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {highlighted.map(product => {
              const isPromo =
                product.oldPrice != null && product.oldPrice > product.price;
              return (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="relative h-full">
                    <span className="absolute top-2 left-2 z-10 text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                      {isPromo
                        ? language === "en"
                          ? "Deal"
                          : "Promo"
                        : language === "en"
                          ? "Featured"
                          : "Vedette"}
                    </span>
                    <ProductCard
                      product={product}
                      language={language}
                      onAddToCart={onAddToCart}
                      onOrderNow={onOrderNow}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};
