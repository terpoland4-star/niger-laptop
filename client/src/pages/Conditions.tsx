import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { company } from "@/data/company";

export default function Conditions() {
  const [language, setLanguage] = useState<"en" | "fr">("fr");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/" className="text-sm text-primary hover:underline mb-6 inline-block">
          {language === "en" ? "← Back to home" : "← Retour à l'accueil"}
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {language === "en" ? "Terms & Conditions" : "Conditions Générales de Vente et d'Utilisation"}
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          {language === "en" ? "Last updated: July 2026" : "Dernière mise à jour : juillet 2026"}
        </p>

        <div className="space-y-8 leading-relaxed text-foreground">
          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "1. Seller Identification" : "1. Identification du vendeur"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "This website is operated by Niger Laptops, commercial name of the individual enterprise operated by Zakariyaou Talatou Zoubeirou, registered under RCCM n° NE-NIM-01-2024-A10-00573, NIF 117816/P, based in Cité Sonuci, Niamey, Niger."
                : "Ce site est exploité par Niger Laptops, nom commercial de l'entreprise individuelle exploitée par Zakariyaou Talatou Zoubeirou, immatriculée sous le RCCM n° NE-NIM-01-2024-A10-00573, NIF 117816/P, basée à Cité Sonuci, Niamey, Niger."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "2. Products" : "2. Produits"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Products are described as accurately as possible. Each product clearly indicates its condition (new or used). Photos are illustrative and minor variations may occur."
                : "Les produits sont décrits avec la plus grande exactitude possible. Chaque produit indique clairement son état (neuf ou occasion). Les photos sont illustratives et de légères variations peuvent survenir."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "3. Prices" : "3. Prix"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Prices are displayed in FCFA (West African CFA franc) and are inclusive of all taxes (TTC). Niger Laptops reserves the right to modify its prices at any time; the price applicable is the one displayed at the time of order confirmation."
                : "Les prix sont affichés en FCFA et s'entendent toutes taxes comprises (TTC). Niger Laptops se réserve le droit de modifier ses prix à tout moment ; le prix applicable est celui affiché au moment de la confirmation de commande."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "4. Orders" : "4. Commandes"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Orders can be placed directly through the website or via WhatsApp. An order is considered confirmed once Niger Laptops has validated product availability and contacted the customer to finalize the details."
                : "Les commandes peuvent être passées directement via le site ou via WhatsApp. Une commande est considérée comme confirmée une fois que Niger Laptops a validé la disponibilité du produit et contacté le client pour finaliser les modalités."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "5. Payment" : "5. Paiement"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Payment terms are agreed upon at the time of order confirmation. Niger Laptops may offer, among other methods, mobile payment services such as MyNita or AmanaTa. These services are operated by independent third-party providers and are subject to their own terms of use, which the customer agrees to when using them."
                : "Les modalités de paiement sont convenues au moment de la confirmation de commande. Niger Laptops peut proposer, entre autres moyens, des services de paiement mobile comme MyNita ou AmanaTa. Ces services sont exploités par des prestataires tiers indépendants et sont soumis à leurs propres conditions d'utilisation, que le client accepte en les utilisant."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "6. Delivery" : "6. Livraison"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Delivery terms (zone, cost, timeframe) are agreed upon directly with the customer at the time of order, depending on location within Niamey and beyond."
                : "Les modalités de livraison (zone, coût, délai) sont convenues directement avec le client au moment de la commande, selon la localisation à Niamey et au-delà."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "7. Returns & Warranty" : "7. Retours et garantie"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Given the nature of our products, returns are not accepted except in cases of a defective product or non-conformity with the order. In such cases, the customer must contact Niger Laptops promptly upon receipt of the product to arrange a repair, replacement, or refund."
                : "Compte tenu de la nature de nos produits, les retours ne sont pas acceptés, sauf en cas de produit défectueux ou de non-conformité avec la commande. Dans ce cas, le client doit contacter Niger Laptops rapidement après réception du produit afin de convenir d'une réparation, d'un remplacement ou d'un remboursement."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "8. Liability" : "8. Responsabilité"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Niger Laptops cannot be held liable for delays or failures resulting from events beyond its control (force majeure), including but not limited to network outages, delivery service disruptions, or third-party payment provider issues."
                : "Niger Laptops ne saurait être tenu responsable des retards ou défaillances résultant d'événements hors de son contrôle (force majeure), y compris, sans s'y limiter, les pannes réseau, les perturbations des services de livraison, ou les problèmes liés aux prestataires de paiement tiers."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "9. Applicable Law & Jurisdiction" : "9. Loi applicable et juridiction"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "These terms are governed by the laws of the Republic of Niger. Any dispute that cannot be resolved amicably will be submitted to the competent courts of Niamey."
                : "Les présentes conditions sont régies par le droit de la République du Niger. Tout litige qui ne pourrait être résolu à l'amiable sera soumis aux tribunaux compétents de Niamey."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "10. Contact" : "10. Contact"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en" ? "For any question regarding these terms, contact us at:" : "Pour toute question relative à ces conditions, contactez-nous à :"}{" "}
              <a href={`mailto:${company.email[0]}`} className="text-primary hover:underline">
                {company.email[0]}
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
