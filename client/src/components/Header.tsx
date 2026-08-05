import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
  Moon,
  Sun,
  Search,
  User,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";

interface HeaderProps {
  wishlistCount?: number;
  onWishlistClick?: () => void;
  cartCount?: number;
  onCartClick?: () => void;
  onSearchChange?: (query: string) => void;
  language?: "en" | "fr";
  onLanguageChange?: (lang: "en" | "fr") => void;
}

export const Header = ({
  wishlistCount = 0,
  onWishlistClick,
  cartCount = 0,
  onCartClick,
  onSearchChange,
  language = "fr",
  onLanguageChange,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <img
              src="/logolap.png"
              alt="Niger Laptops"
              className="h-10 w-auto"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-bold text-foreground text-sm">
                Niger Laptops
              </span>
              <span className="text-xs text-muted-foreground">
                Expert Informatique
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={
                language === "en"
                  ? "Search products..."
                  : "Rechercher un produit..."
              }
              className="pl-9"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {language === "en" ? "Home" : "Accueil"}
            </Link>
            <a
              href="#catalog"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {language === "en" ? "Catalog" : "Catalogue"}
            </a>
            <a
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {language === "en" ? "About" : "À propos"}
            </a>
            <a
              href="#contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {language === "en" ? "Contact" : "Contact"}
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onLanguageChange?.(language === "en" ? "fr" : "en")
              }
              className="hidden sm:flex"
            >
              {language === "en" ? "FR" : "EN"}
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative rounded-full"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
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

            {/* Account Button */}
            <Link href="/compte">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                aria-label={language === "en" ? "My account" : "Mon compte"}
              >
                <User size={18} />
                {isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-green-600 rounded-full w-2.5 h-2.5" />
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={
              language === "en"
                ? "Search products..."
                : "Rechercher un produit..."
            }
            className="pl-9"
          />
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                {language === "en" ? "Home" : "Accueil"}
              </Link>
              <a
                href="#catalog"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                {language === "en" ? "Catalog" : "Catalogue"}
              </a>
              <a
                href="#about"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                {language === "en" ? "About" : "À propos"}
              </a>
              <a
                href="#contact"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                {language === "en" ? "Contact" : "Contact"}
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onLanguageChange?.(language === "en" ? "fr" : "en")
                }
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
