import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Catalog } from "@/components/Catalog";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WishlistModal } from "@/components/WishlistModal";
import { useWishlist } from "@/hooks/useWishlist";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "fr">("fr");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const catalogRef = useRef<HTMLElement>(null);
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const handleCatalogClick = () => {
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLanguageChange = (newLang: "en" | "fr") => {
    setLanguage(newLang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero language={language} onCatalogClick={handleCatalogClick} />

        {/* Catalog Section */}
        <Catalog language={language} />

        {/* About Section */}
        <About language={language} />

        {/* Contact Section */}
        <Contact language={language} />
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemove={removeFromWishlist}
        onClear={clearWishlist}
        language={language}
      />
    </div>
  );
}
