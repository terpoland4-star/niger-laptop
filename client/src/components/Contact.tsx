import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/company";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

interface ContactProps {
  language?: "en" | "fr";
}

export const Contact = ({ language = "fr" }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, just log and show success message
      // In production, this would integrate with EmailJS
      console.log("Form submitted:", formData);
      
      toast.success(
        language === "en"
          ? "Message sent successfully! We'll get back to you soon."
          : "Message envoyé avec succès ! Nous vous répondrons bientôt."
      );

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        language === "en"
          ? "Failed to send message. Please try again."
          : "Impossible d'envoyer le message. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === "en" ? "Get in Touch" : "Nous Contacter"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "en"
              ? "Have questions? We'd love to hear from you. Send us a message!"
              : "Vous avez des questions ? Nous aimerions vous entendre. Envoyez-nous un message !"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-lg border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  {language === "en" ? "Full Name" : "Nom Complet"}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Your name" : "Votre nom"}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  {language === "en" ? "Email" : "Email"}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === "en" ? "your@email.com" : "votre@email.com"}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                  {language === "en" ? "Phone (Optional)" : "Téléphone (Optionnel)"}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={language === "en" ? "+227 XX XX XX XX" : "+227 XX XX XX XX"}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  {language === "en" ? "Message" : "Message"}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Your message..." : "Votre message..."}
                  required
                  className="w-full min-h-32"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {isLoading
                  ? language === "en"
                    ? "Sending..."
                    : "Envoi en cours..."
                  : language === "en"
                  ? "Send Message"
                  : "Envoyer le Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "en" ? "Phone" : "Téléphone"}
                  </h3>
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
              </div>
            </div>

            {/* Email */}
            <div className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "en" ? "Email" : "Email"}
                  </h3>
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
              </div>
            </div>

            {/* Address */}
            <div className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "en" ? "Address" : "Adresse"}
                  </h3>
                  <p className="text-muted-foreground">{company.address}</p>
                  <a
                    href={company.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-2 inline-block"
                  >
                    {language === "en" ? "View on Google Maps" : "Voir sur Google Maps"}
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-3">
                {language === "en" ? "Quick Chat" : "Chat Rapide"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "en"
                  ? "Prefer WhatsApp? Chat with us directly for faster responses."
                  : "Vous préférez WhatsApp ? Discutez directement avec nous pour des réponses plus rapides."}
              </p>
              <a
                href={`https://wa.me/${company.whatsapp.defaultNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.23 9.879 9.879 0 006.802 15.655c1.54 0 3.062-.4 4.413-1.162l.031.02 3.899.236-3.861-3.861.02.031c.76-1.351 1.162-2.873 1.162-4.413a9.879 9.879 0 00-7.516-9.515z" />
                </svg>
                {language === "en" ? "Chat on WhatsApp" : "Discutez sur WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
