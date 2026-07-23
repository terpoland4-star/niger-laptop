import { company } from "@/data/company";
import { CheckCircle2, Zap, Shield, Users } from "lucide-react";

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
      descFr: "Chaque produit est minutieusement inspecté et testé"
    },
    {
      icon: Zap,
      titleEn: "Fast Service",
      titleFr: "Service Rapide",
      descEn: "Quick responses and efficient support",
      descFr: "Réponses rapides et support efficace"
    },
    {
      icon: Shield,
      titleEn: "Trusted Expert",
      titleFr: "Expert de Confiance",
      descEn: "Years of expertise in the tech market",
      descFr: "Des années d'expertise sur le marché informatique"
    },
    {
      icon: Users,
      titleEn: "Local Presence",
      titleFr: "Présence Locale",
      descEn: "Based in Niamey, serving Niger",
      descFr: "Basé à Niamey, servant le Niger"
    }
  ];

  return (
    <section id="about" className="py-16 bg-card border-t border-border">
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
              <div
                key={idx}
                className="p-6 bg-background rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
              >
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
            );
          })}
        </div>

        {/* Company Info */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                {language === "en" ? "About Niger Laptops" : "À Propos de Niger Laptops"}
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

            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                {language === "en" ? "Contact Information" : "Informations de Contact"}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {language === "en" ? "Address" : "Adresse"}
                  </p>
                  <p className="text-foreground">{company.address}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {language === "en" ? "Phone" : "Téléphone"}
                  </p>
                  <div className="space-y-1">
                    {company.phone.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone}`}
                        className="text-primary hover:underline block"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {language === "en" ? "Email" : "Email"}
                  </p>
                  <div className="space-y-1">
                    {company.email.map((email, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${email}`}
                        className="text-primary hover:underline block"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {language === "en" ? "Hours" : "Horaires"}
                  </p>
                  <p className="text-foreground">
                    {language === "en"
                      ? "Monday - Friday: 9:00 AM - 6:00 PM"
                      : "Lundi - Vendredi: 9h00 - 18h00"}
                  </p>
                  <p className="text-foreground">
                    {language === "en"
                      ? "Saturday: 10:00 AM - 4:00 PM"
                      : "Samedi: 10h00 - 16h00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
