import { company } from "@/data/company";
import { generateContactWhatsAppLink } from "@/lib/whatsapp";
import { MapPin, Facebook } from "lucide-react";
import { Link } from "wouter";
import { LogoWatermark } from "@/components/LogoWatermark";

interface FooterProps {
  language?: "en" | "fr";
}

export const Footer = ({ language = "fr" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16 relative overflow-hidden">
      <LogoWatermark
        className="inset-0 w-full h-full object-contain z-0"
        opacity={0.05}
      />
      <div className="container mx-auto px-4 py-12 relative z-10">
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
              <p className="text-xs text-muted-foreground pt-2">
                {language === "en"
                  ? "Having an issue? Talk directly to the developer on WhatsApp"
                  : "Vous rencontrez un problème ? Parlez directement au développeur sur WhatsApp"}
              </p>
              <a
                href={generateContactWhatsAppLink(
                  company.developer.phone,
                  language === "en"
                    ? "Hello, I have a question about the Niger Laptops website."
                    : "Bonjour, j'ai une question concernant le site Niger Laptops."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/90 active:scale-95"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23 9.879 9.879 0 006.802 15.655c1.54 0 3.062-.4 4.413-1.162l.031.02 3.899.236-3.861-3.861.02.031c.76-1.351 1.162-2.873 1.162-4.413a9.879 9.879 0 00-7.516-9.515z" />
                </svg>
                {language === "en" ? "WhatsApp" : "WhatsApp"}
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
