import { useState, lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Catalog } from "@/components/Catalog";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { BackToTop } from "@/components/BackToTop";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/lib/productLabels";

const WishlistModal = lazy(() =>
  import("@/components/WishlistModal").then(m => ({ default: m.WishlistModal }))
);
const CartModal = lazy(() =>
  import("@/components/CartModal").then(m => ({ default: m.CartModal }))
);
const OrderModal = lazy(() =>
  import("@/components/OrderModal").then(m => ({ default: m.OrderModal }))
);

export default function Home() {
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<
    Array<{ id: string; name: string; imageUrl?: string; quantity?: number }>
  >([]);

  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveCartToPhone,
    loadCartFromPhone,
    totalItems,
    totalPrice,
  } = useCart();

  const handleCatalogClick = () => {
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLanguageChange = (newLang: "en" | "fr") => {
    setLanguage(newLang);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: language === "en" ? product.nameEn : product.nameFr,
      imageUrl: product.image,
      price: product.price,
    });
  };

  const handleOrderNowSingle = (product: Product) => {
    setOrderItems([
      {
        id: product.id,
        name: language === "en" ? product.nameEn : product.nameFr,
        imageUrl: product.image,
        quantity: 1,
      },
    ]);
    setIsOrderOpen(true);
  };

  const handleOrderFromWishlist = () => {
    setOrderItems(
      wishlist.map(w => ({
        id: w.id,
        name: w.name,
        imageUrl: w.imageUrl,
        quantity: 1,
      }))
    );
    setIsWishlistOpen(false);
    setIsOrderOpen(true);
  };

  const handleOrderFromCart = () => {
    setOrderItems(
      cart.map(c => ({
        id: c.id,
        name: c.name,
        imageUrl: c.imageUrl,
        quantity: c.quantity,
      }))
    );
    setIsCartOpen(false);
    setIsOrderOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
        cartCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-1">
        <Hero language={language} onCatalogClick={handleCatalogClick} />

        <FeaturedCarousel
          language={language}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNowSingle}
        />

        <Catalog
          language={language}
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNowSingle}
        />

        <About language={language} />
        <Contact language={language} />
      </main>

      <Footer language={language} />

      <BackToTop />
      <ScrollToBottom />

      <Suspense fallback={null}>
        {isWishlistOpen && (
          <WishlistModal
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            items={wishlist}
            onRemove={removeFromWishlist}
            onClear={clearWishlist}
            onOrderClick={handleOrderFromWishlist}
            language={language}
          />
        )}

        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClear={clearCart}
            onOrderClick={handleOrderFromCart}
            onSaveToPhone={saveCartToPhone}
            onLoadFromPhone={loadCartFromPhone}
            totalPrice={totalPrice}
            language={language}
          />
        )}

        {isOrderOpen && (
          <OrderModal
            isOpen={isOrderOpen}
            onClose={() => setIsOrderOpen(false)}
            items={orderItems}
            language={language}
          />
        )}
      </Suspense>
    </div>
  );
}
