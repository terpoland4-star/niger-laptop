import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, Clock, Copy } from "lucide-react";
import { payWithNita, getNitaStatus } from "@/lib/api";
import { toast } from "sonner"; // Adapte en "react-hot-toast" si ton projet utilise cette librairie

export default function SuiviCommande() {
  const [match, params] = useRoute("/suivi-commande/:id");
  const orderId = params?.id;

  const [loading, setLoading] = useState(true);
  const [nitaCode, setNitaCode] = useState<string | null>(null);
  const [nitaExpiresAt, setNitaExpiresAt] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderStatus();
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/nita-status`);
      if (!response.ok) throw new Error("Commande introuvable");
      const json = await response.json();
      const data = json.data;

      if (data.codeAchat) {
        setNitaCode(data.codeAchat);
        setNitaExpiresAt(data.expiresAt);
        setIsPolling(true);
      }
      setIsPaid(data.isPaid || data.status === "1");
    } catch (error) {
      console.error("Erreur chargement commande:", error);
      toast.error("Impossible de charger les détails de cette commande.");
    } finally {
      setLoading(false);
    }
  };

  // Polling automatique toutes les 8 secondes (comme dans OrderModal)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPolling && !isPaid && nitaCode) {
      interval = setInterval(async () => {
        try {
          const statusData = await getNitaStatus(orderId!);
          if (statusData.data.isPaid || statusData.data.status === "1") {
            setIsPaid(true);
            setIsPolling(false);
            toast.success("Paiement NITA reçu avec succès ! 🎉");
          }
        } catch (error) {
          console.error("Erreur de polling:", error);
        }
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isPolling, isPaid, nitaCode, orderId]);

  const handlePayWithNita = async () => {
    if (!orderId) return;
    try {
      toast.info("Génération du code de paiement en cours...");
      const result = await payWithNita(orderId);
      setNitaCode(result.data.codeAchat);
      setNitaExpiresAt(result.data.expiresAt);
      setIsPolling(true);
      toast.success("Code de paiement généré !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la génération du code.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copié dans le presse-papiers !");
  };

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Page non trouvée.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              {isPaid ? (
                <CheckCircle className="h-7 w-7 text-green-600" />
              ) : (
                <Clock className="h-7 w-7 text-orange-500" />
              )}
              Suivi de la commande #{orderId}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPaid ? (
              <div className="text-center space-y-4 py-4">
                <h3 className="text-2xl font-bold text-green-600">
                  Paiement confirmé !
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Votre commande a été payée avec succès via NITA. Vous recevrez
                  sous peu une confirmation par email ou WhatsApp avec les
                  détails de livraison.
                </p>
                <Link href="/">
                  <Button className="mt-4">Retour à l'accueil</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">
                    Statut : En attente de paiement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Votre commande est réservée. Veuillez effectuer le paiement
                    pour la valider définitivement.
                  </p>
                </div>

                {nitaCode ? (
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4 border border-border">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-3">
                        Votre code de paiement NITA :
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl font-bold tracking-widest text-primary font-mono bg-background px-4 py-2 rounded-md border">
                          {nitaCode}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(nitaCode)}
                          title="Copier le code"
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                      {nitaExpiresAt && (
                        <p className="text-xs text-muted-foreground mt-3">
                          Expire le :{" "}
                          {new Date(nitaExpiresAt).toLocaleString("fr-FR")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        Vérification automatique du paiement en cours...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-4">
                    <p className="text-muted-foreground">
                      Cliquez sur le bouton ci-dessous pour générer votre code
                      de paiement unique.
                    </p>
                    <Button
                      onClick={handlePayWithNita}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      Payer avec NITA
                    </Button>
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-center space-y-1 pt-4 border-t">
                  <p>
                    • Rendez-vous en agence NITA ou utilisez l'application
                    MYNITA.
                  </p>
                  <p>
                    • Présentez ce code ou saisissez-le pour effectuer le
                    paiement.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
