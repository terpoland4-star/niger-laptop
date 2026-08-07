import { CheckCircle2, Zap, Shield, Users } from "lucide-react";
import { LogoWatermark } from "@/components/LogoWatermark";
import { ScrollReveal } from "@/components/ScrollReveal";

interface AboutProps {
  language?: "en" | "fr";
}

export const About = ({ language = "fr" }: AboutProps) => {
  const features = [
    {
      icon: CheckCircle2,
      titleEn: "Quality Verified",
      titleFr: "Qualité Vérifiée",
      descEn: "Every product is carefully inspected and tested",
      descFr: "Chaque produit est minutieusement inspecté et testé",
    },
    {
      icon: Zap,
      titleEn: "Fast Service",
      titleFr: "Service Rapide",
      descEn: "Quick responses and efficient support",
      descFr: "Réponses rapides et support efficace",
    },
    {
      icon: Shield,
      titleEn: "Trusted Expert",
      titleFr: "Expert de Confiance",
      descEn: "Years of expertise in the tech market",
      descFr: "Des années d'expertise sur le marché informatique",
    },
    {
      icon: Users,
      titleEn: "Local Presence",
      titleFr: "Présence Locale",
      descEn: "Based in Niamey, serving Niger",
      descFr: "Basé à Niamey, servant le Niger",
    },
  ];

  return (
    <section
      id="about"
      className="py-16 bg-card border-t border-border relative overflow-hidden"
    >
      <LogoWatermark
        className="inset-0 w-full h-full object-contain z-0"
        opacity={0.08}
      />
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === "en" ? "Why Choose Us" : "Pourquoi Nous Choisir"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "We are committed to providing the best tech solutions in Niger"
              : "Nous nous engageons à fournir les meilleures solutions informatiques au Niger"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 0.08}>
                <div className="p-6 bg-background rounded-lg border border-border card-interactive card-gradient-border h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "en" ? feature.titleEn : feature.titleFr}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? feature.descEn : feature.descFr}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Company Info */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8 border border-primary/20">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              {language === "en"
                ? "About Niger Laptops"
                : "À Propos de Niger Laptops"}
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {language === "en"
                ? "Niger Laptops is a leading tech retailer in Niamey, Niger. We specialize in providing high-quality laptops, tablets, and tech accessories to individuals and businesses. Our mission is to make premium technology accessible to everyone in Niger."
                : "Niger Laptops est un détaillant informatique de premier plan à Niamey, Niger. Nous nous spécialisons dans la fourniture de portables, tablettes et accessoires informatiques de haute qualité aux particuliers et aux entreprises. Notre mission est de rendre la technologie premium accessible à tous au Niger."}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {language === "en"
                ? "With years of experience and a commitment to excellence, we ensure every customer receives the best service and products."
                : "Avec des années d'expérience et un engagement envers l'excellence, nous garantissons que chaque client reçoit le meilleur service et les meilleurs produits."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
