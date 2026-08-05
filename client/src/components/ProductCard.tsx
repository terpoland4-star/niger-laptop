import { Product, conditions } from "@/lib/productLabels";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { openWhatsAppChat } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onWishlistToggle?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
  language?: "en" | "fr";
}

export const ProductCard = ({
  product,
  isInWishlist = false,
  onWishlistToggle,
  onAddToCart,
  onOrderNow,
  language = "fr",
}: ProductCardProps) => {
  const productName = language === "en" ? product.nameEn : product.nameFr;
  const conditionLabel =
    language === "en"
      ? conditions[product.condition].en
      : conditions[product.condition].fr;

  const handleWhatsApp = () => {
    openWhatsAppChat(productName, product.image);
  };

  const handleWishlist = () => {
    onWishlistToggle?.(product.id);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleOrderNow = () => {
    onOrderNow?.(product);
  };

  const formattedPrice = new Intl.NumberFormat(
    language === "en" ? "en-US" : "fr-FR"
  ).format(product.price);

  return (
    <div className="group relative h-full flex flex-col bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-border">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-secondary overflow-hidden">
        <img
          src={product.image}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Condition Badge */}
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
          {conditionLabel}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={cn(
              "transition-colors",
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col p-4">
        {/* Product Name */}
        <h3 className="font-display text-sm font-semibold text-foreground line-clamp-2 mb-2">
          {productName}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Price / Price on Request */}
        <div className="mb-4 mt-auto">
          <div className="text-sm font-semibold text-primary">
            {product.price > 0
              ? `${formattedPrice} FCFA`
              : language === "en"
                ? "Price on Request"
                : "Prix sur demande"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary/10 font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-xs"
            >
              <ShoppingCart size={16} />
              {language === "en" ? "Add to Cart" : "Ajouter au panier"}
            </Button>
            <Button
              onClick={handleOrderNow}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all duration-200 text-xs"
            >
              {language === "en" ? "Order Now" : "Commander"}
            </Button>
          </div>

          {/* WhatsApp Button */}
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="w-full font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-xs"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23 9.879 9.879 0 006.802 15.655c1.54 0 3.062-.4 4.413-1.162l.031.02 3.899.236-3.861-3.861.02.031c.76-1.351 1.162-2.873 1.162-4.413a9.879 9.879 0 00-7.516-9.515z" />
            </svg>
            {language === "en" ? "Chat on WhatsApp" : "Discutez sur WhatsApp"}
          </Button>
        </div>
      </div>
    </div>
  );
};
