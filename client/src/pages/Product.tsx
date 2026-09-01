import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { conditions } from "@/lib/productLabels";
import { getImageUrl } from "@/lib/utils";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { openWhatsAppChat } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { useSSRInitialData } from "@/lib/ssr-data-context";

const API_BASE = "https://api.niger-laptops.com";

interface ProductSpec {
  key: string;
  value: string;
}

interface ProductDetail {
  id: string;
  nameFr: string;
  nameEn: string;
  category: string;
  condition: "new" | "used";
  price: number;
  oldPrice: number | null;
  thumbnail: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  stockQuantity: number;
  rating: number | null;
  specs: ProductSpec[];
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const ssrProduct = useSSRInitialData<ProductDetail>(`product:${id}`);
  const [product, setProduct] = useState<ProductDetail | null>(ssrProduct);
  const [isLoading, setIsLoading] = useState(!ssrProduct);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (ssrProduct && ssrProduct.id === id) {
      return; // déjà fourni par le SSR, pas besoin de refetch au premier rendu
    }
    let cancelled = false;
    setIsLoading(true);
    fetch(`${API_BASE}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Produit non trouvé");
        return res.json();
      })
      .then(({ data }) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) setError("Produit introuvable.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          {error ?? "Produit introuvable."}
        </p>
        <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  const productName = language === "en" ? product.nameEn : product.nameFr;
  const description =
    language === "en" ? product.descriptionEn : product.descriptionFr;
  const conditionLabel =
    language === "en"
      ? conditions[product.condition].en
      : conditions[product.condition].fr;
  const isOutOfStock = product.stockQuantity <= 0;
  const isInWishlist = wishlist.some(w => w.id === product.id);
  const imageUrl = getImageUrl(product.thumbnail);

  const formattedPrice = new Intl.NumberFormat(
    language === "en" ? "en-US" : "fr-FR"
  ).format(product.price);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: productName,
      imageUrl,
      price: product.price,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: productName,
        imageUrl,
        addedAt: Date.now(),
      });
    }
  };

  const handleWhatsApp = () => {
    openWhatsAppChat(productName, imageUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {language === "en" ? "Back to catalog" : "Retour au catalogue"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            layoutId={`product-image-${product.id}`}
            className="relative aspect-square bg-secondary rounded-xl overflow-hidden border border-border"
          >
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              {conditionLabel}
            </div>
          </motion.div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              {productName}
            </h1>

            <div className="mb-6">
              {product.price > 0 ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-primary">
                    {formattedPrice} FCFA
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {new Intl.NumberFormat(
                        language === "en" ? "en-US" : "fr-FR"
                      ).format(product.oldPrice)}{" "}
                      FCFA
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xl font-medium text-muted-foreground">
                  {language === "en" ? "Price on Request" : "Prix sur demande"}
                </span>
              )}
            </div>

            {isOutOfStock && (
              <p className="text-sm text-destructive font-medium mb-4">
                {language === "en" ? "Out of stock" : "Rupture de stock"}
              </p>
            )}

            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {language === "en" ? "Add to Cart" : "Ajouter au panier"}
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                size="icon"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={isInWishlist ? "fill-red-500 text-red-500" : ""}
                />
              </Button>
            </div>

            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full mb-8 flex items-center justify-center gap-2"
            >
              {language === "en" ? "Chat on WhatsApp" : "Discutez sur WhatsApp"}
            </Button>

            {description && (
              <div className="mb-8">
                <h2 className="font-display text-lg font-semibold mb-3">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold mb-3">
                  {language === "en"
                    ? "Key Specifications"
                    : "Caractéristiques principales"}
                </h2>
                <dl className="divide-y divide-border border-t border-border">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2.5 text-sm"
                    >
                      <dt className="text-muted-foreground">{spec.key}</dt>
                      <dd className="font-medium text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
