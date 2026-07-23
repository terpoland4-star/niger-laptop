import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";

interface HeaderProps {
  wishlistCount?: number;
  onWishlistClick?: () => void;
  language?: "en" | "fr";
  onLanguageChange?: (lang: "en" | "fr") => void;
}

export const Header = ({
  wishlistCount = 0,
  onWishlistClick,
  language = "fr",
  onLanguageChange
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">NL</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-bold text-foreground text-sm">Niger Laptops</span>
              <span className="text-xs text-muted-foreground">Expert Informatique</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {language === "en" ? "Home" : "Accueil"}
            </Link>
            <a href="#catalog" className="text-sm font-medium hover:text-primary transition-colors">
              {language === "en" ? "Catalog" : "Catalogue"}
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              {language === "en" ? "About" : "À propos"}
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              {language === "en" ? "Contact" : "Contact"}
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLanguageChange?.(language === "en" ? "fr" : "en")}
              className="hidden sm:flex"
            >
              {language === "en" ? "FR" : "EN"}
            </Button>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onWishlistClick}
              className="relative rounded-full"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/" className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">
                {language === "en" ? "Home" : "Accueil"}
              </Link>
              <a href="#catalog" className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">
                {language === "en" ? "Catalog" : "Catalogue"}
              </a>
              <a href="#about" className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">
                {language === "en" ? "About" : "À propos"}
              </a>
              <a href="#contact" className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors">
                {language === "en" ? "Contact" : "Contact"}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange?.(language === "en" ? "fr" : "en")}
                className="justify-start px-4"
              >
                {language === "en" ? "Français" : "English"}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
