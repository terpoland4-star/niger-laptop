import { company } from "@/data/company";
import { MapPin, Facebook } from "lucide-react";
import { Link } from "wouter";

interface FooterProps {
  language?: "en" | "fr";
}

export const Footer = ({ language = "fr" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">
              Niger Laptops
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === "en"
                ? "Your trusted tech expert in Niger"
                : "Votre expert informatique de confiance au Niger"}
            </p>
            <div className="flex gap-3">
              <a
                href={company.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(company.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Google Maps"
              >
                <MapPin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {language === "en" ? "Quick Links" : "Liens rapides"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#catalog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === "en" ? "Catalog" : "Catalogue"}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === "en" ? "About Us" : "À propos"}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {language === "en" ? "Contact" : "Contact"}
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {language === "en" ? "Developed by" : "Développé par"}
            </h4>
            <div className="text-sm space-y-2">
              <p className="font-medium text-foreground">
                {company.developer.name}
              </p>
              <p className="text-muted-foreground">
                {company.developer.company}
              </p>
              <p className="text-xs text-muted-foreground">
                {company.developer.address}
              </p>
              <a
                href={`tel:${company.developer.phone}`}
                className="text-primary hover:underline text-xs"
              >
                {company.developer.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>
              {language === "en"
                ? `© ${currentYear} Niger Laptops. All rights reserved.`
                : `© ${currentYear} Niger Laptops. Tous droits réservés.`}
            </p>
            <div className="flex gap-4">
              <Link
                href="/confidentialite"
                className="hover:text-primary transition-colors"
              >
                {language === "en" ? "Privacy" : "Confidentialité"}
              </Link>
              <Link
                href="/conditions"
                className="hover:text-primary transition-colors"
              >
                {language === "en" ? "Terms" : "Conditions"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
