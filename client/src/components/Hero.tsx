import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  language?: "en" | "fr";
  onCatalogClick?: () => void;
}

export const Hero = ({ language = "fr", onCatalogClick }: HeroProps) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5e6d3] via-[#fad8b8] to-[#f5e6d3]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Text */}
        <div className="flex-1 max-w-2xl">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full animate-badge-float">
            <span className="text-sahel-blue font-semibold text-sm">
              {language === "en" ? "Welcome to Niger Laptops" : "Bienvenue chez Niger Laptops"}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-sahel-green mb-6 leading-tight">
            {language === "en"
              ? "Your Tech Expert in Niger"
              : "Votre Expert Informatique au Niger"}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {language === "en"
              ? "Discover a curated collection of premium laptops, tablets, and tech accessories. Quality guaranteed, expertise assured."
              : "Découvrez notre sélection de portables premium, tablettes et accessoires informatiques. Qualité garantie, expertise assurée."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onCatalogClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 px-8 rounded-lg text-lg flex items-center justify-center gap-2 transition-all duration-200 hover:gap-3"
            >
              {language === "en" ? "Explore Catalog" : "Parcourir le Catalogue"}
              <ArrowRight size={20} />
            </Button>

            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-6 px-8 rounded-lg text-lg"
            >
              {language === "en" ? "Learn More" : "En savoir plus"}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {language === "en" ? "Quality Guaranteed" : "Qualité Garantie"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "All products verified" : "Tous les produits vérifiés"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {language === "en" ? "Expert Support" : "Support Expert"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Always available" : "Toujours disponible"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {language === "en" ? "Local Presence" : "Présence Locale"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Based in Niamey" : "Basé à Niamey"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 relative h-96 md:h-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-md">
            {/* Transparent logo, oscillating, behind the floating card */}
            <img
              src="/assets/images/logo/logolap-transparent.png"
              alt=""
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] max-w-none h-auto opacity-90 animate-logo-oscillate pointer-events-none select-none"
            />

            {/* Floating Cards Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <p className="font-display font-bold text-foreground text-xl">
                    {language === "en" ? "Premium Tech" : "Tech Premium"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === "en" ? "34+ Products" : "34+ Produits"}
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium">
            {language === "en" ? "Scroll to explore" : "Défilez pour explorer"}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};
