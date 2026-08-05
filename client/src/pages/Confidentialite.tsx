import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { company } from "@/data/company";

export default function Confidentialite() {
  const [language, setLanguage] = useState<"en" | "fr">("fr");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <Link
          href="/"
          className="text-sm text-primary hover:underline mb-6 inline-block"
        >
          {language === "en" ? "← Back to home" : "← Retour à l'accueil"}
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {language === "en"
            ? "Privacy Policy"
            : "Politique de Confidentialité"}
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          {language === "en"
            ? "Last updated: July 2026"
            : "Dernière mise à jour : juillet 2026"}
        </p>

        <div className="space-y-8 leading-relaxed text-foreground">
          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en"
                ? "1. Data Controller"
                : "1. Responsable du traitement"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Niger Laptops (commercial name of the individual enterprise operated by Zakariyaou Talatou Zoubeirou, RCCM NE-NIM-01-2024-A10-00573, NIF 117816/P), based in Niamey, Niger, is the data controller for the personal data collected through this website."
                : "Niger Laptops (nom commercial de l'entreprise individuelle exploitée par Zakariyaou Talatou Zoubeirou, RCCM NE-NIM-01-2024-A10-00573, NIF 117816/P), basée à Niamey, Niger, est le responsable du traitement des données personnelles collectées via ce site."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en"
                ? "2. Data We Collect"
                : "2. Données collectées"}
            </h2>
            <p className="text-muted-foreground mb-2">
              {language === "en"
                ? "When you place an order, contact us, or save a cart, we may collect:"
                : "Lorsque vous passez une commande, nous contactez, ou sauvegardez un panier, nous pouvons collecter :"}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>{language === "en" ? "Full name" : "Nom complet"}</li>
              <li>
                {language === "en" ? "Phone number" : "Numéro de téléphone"}
              </li>
              <li>{language === "en" ? "Email address" : "Adresse email"}</li>
              <li>
                {language === "en"
                  ? "Delivery address (if provided)"
                  : "Adresse de livraison (si fournie)"}
              </li>
              <li>
                {language === "en"
                  ? "Order and cart contents"
                  : "Contenu des commandes et du panier"}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en"
                ? "3. Purpose of Processing"
                : "3. Finalité du traitement"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Your data is used exclusively to process and deliver your orders, respond to your inquiries, and, where you have explicitly consented, to inform you of new products or offers."
                : "Vos données sont utilisées exclusivement pour traiter et livrer vos commandes, répondre à vos demandes, et, lorsque vous y avez explicitement consenti, vous informer de nouveaux produits ou offres."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en"
                ? "4. Data Recipients"
                : "4. Destinataires des données"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Your data is not sold to third parties. It may be shared with payment service providers (such as MyNita or AmanaTa, once integrated) strictly to process your payment, and with delivery partners strictly to deliver your order. These providers are bound by their own data protection obligations."
                : "Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec des prestataires de paiement (comme MyNita ou AmanaTa, une fois intégrés) strictement pour traiter votre paiement, et avec des partenaires de livraison strictement pour livrer votre commande. Ces prestataires sont soumis à leurs propres obligations de protection des données."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en"
                ? "5. Retention Period"
                : "5. Durée de conservation"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Order data is kept for the duration necessary to process the order and comply with accounting obligations. Cart data saved by phone number is automatically deleted after 30 days of inactivity."
                : "Les données de commande sont conservées le temps nécessaire au traitement de la commande et au respect des obligations comptables. Les données de panier sauvegardées par numéro de téléphone sont automatiquement supprimées après 30 jours d'inactivité."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "6. Security" : "6. Sécurité"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "We take reasonable technical measures to protect your data against unauthorized access, loss, or alteration. This site does not use tracking or advertising cookies; only technical local storage is used (theme preference, shopping cart)."
                : "Nous prenons des mesures techniques raisonnables pour protéger vos données contre tout accès non autorisé, perte ou altération. Ce site n'utilise pas de cookies de suivi ou publicitaires ; seul un stockage technique local est utilisé (préférence de thème, panier d'achat)."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "7. Your Rights" : "7. Vos droits"}
            </h2>
            <p className="text-muted-foreground mb-2">
              {language === "en"
                ? "In accordance with Law n°2022-59 of December 16, 2022 on the protection of personal data (as amended by Law n°2023-31 of July 4, 2023), you have the right to access, rectify, delete, and object to the processing of your personal data."
                : "Conformément à la loi n°2022-59 du 16 décembre 2022 relative à la protection des données à caractère personnel (modifiée par la loi n°2023-31 du 4 juillet 2023), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles."}
            </p>
            <p className="text-muted-foreground">
              {language === "en"
                ? "To exercise these rights, contact us at:"
                : "Pour exercer ces droits, contactez-nous à :"}{" "}
              <a
                href={`mailto:${company.email[0]}`}
                className="text-primary hover:underline"
              >
                {company.email[0]}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">
              {language === "en" ? "8. Complaints" : "8. Réclamations"}
            </h2>
            <p className="text-muted-foreground">
              {language === "en"
                ? "If you believe your rights are not being respected, you may file a complaint with the Haute Autorité de Protection des Données à Caractère Personnel (HAPDP), the independent authority responsible for data protection in Niger."
                : "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la Haute Autorité de Protection des Données à Caractère Personnel (HAPDP), l'autorité indépendante chargée de la protection des données au Niger."}
            </p>
          </section>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
