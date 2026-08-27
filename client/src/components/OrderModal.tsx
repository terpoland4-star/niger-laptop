import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createOrder, payWithNita, getNitaStatus } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";

interface OrderModalItem {
  id: string;
  name: string;
  imageUrl?: string;
  quantity?: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderModalItem[];
  language?: "en" | "fr";
}

export const OrderModal = ({
  isOpen,
  onClose,
  items,
  language = "fr",
}: OrderModalProps) => {
  const { isAuthenticated, token, loginWithToken } = useAuth();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [wantAccount, setWantAccount] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [nitaCode, setNitaCode] = useState<string | null>(null);
  const [nitaExpiresAt, setNitaExpiresAt] = useState<string | null>(null);
  const [nitaLoading, setNitaLoading] = useState(false);
  const [nitaError, setNitaError] = useState<string | null>(null);
  const [nitaPaid, setNitaPaid] = useState(false);

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setWantAccount(false);
    setAccountEmail("");
    setAccountPassword("");
    setError(null);
    setOrderNumber(null);
    setOrderId(null);
    setNitaCode(null);
    setNitaExpiresAt(null);
    setNitaError(null);
    setNitaPaid(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePayWithNita = async () => {
    if (!orderId) return;
    setNitaLoading(true);
    setNitaError(null);
    try {
      const result = await payWithNita(orderId);
      setNitaCode(result.data.codeAchat);
      setNitaExpiresAt(result.data.expiresAt);
    } catch (err) {
      setNitaError(
        err instanceof Error
          ? err.message
          : language === "en"
            ? "Unable to generate payment code. Please try again."
            : "Impossible de générer le code de paiement. Réessayez."
      );
    } finally {
      setNitaLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId || !nitaCode || nitaPaid) return;

    const interval = setInterval(async () => {
      try {
        const result = await getNitaStatus(orderId);
        if (result.data.isPaid) {
          setNitaPaid(true);
          toast.success(
            language === "en"
              ? "Payment received! Thank you."
              : "Paiement reçu ! Merci."
          );
        }
      } catch {
        // Échec silencieux : on retentera au prochain intervalle,
        // pas besoin d'interrompre l'expérience utilisateur pour ça.
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [orderId, nitaCode, nitaPaid, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidPhoneNumber(customerPhone, "NE")) {
      setError(
        language === "en"
          ? "Please enter a valid phone number."
          : "Merci d'entrer un numéro de téléphone valide."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const shouldCreateAccount = wantAccount && !isAuthenticated;

      const result = await createOrder(
        {
          customerName,
          customerPhone,
          deliveryAddress: deliveryAddress || undefined,
          items: items.map(item => ({
            productId: String(item.id),
            quantity: item.quantity ?? 1,
          })),
          ...(shouldCreateAccount
            ? {
                createAccountEmail: accountEmail,
                createAccountPassword: accountPassword,
              }
            : {}),
        },
        isAuthenticated ? (token ?? undefined) : undefined
      );

      // Si un compte vient d'être créé pour cette commande, on connecte
      // automatiquement le client sans bloquer l'affichage de la confirmation.
      if (result.newAccountToken) {
        loginWithToken(result.newAccountToken).catch(() => {
          // Non bloquant : la commande a réussi même si l'auto-login échoue.
        });
      }

      setOrderNumber(result.data.orderNumber);
      setOrderId(result.data.id);
      toast.info(
        language === "en"
          ? "A delivery person will call you to confirm your address. You can track your order anytime."
          : "Un livreur vous contactera pour confirmer votre adresse. Vous pouvez suivre votre commande à tout moment.",
        { duration: 8000 }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "en"
            ? "Something went wrong. Please try again."
            : "Une erreur est survenue. Merci de réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === "en" ? "Place Order" : "Passer commande"}
          </DialogTitle>
        </DialogHeader>

        {orderNumber ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="mx-auto text-green-600" size={48} />
            <p className="font-semibold text-lg">
              {language === "en" ? "Order confirmed!" : "Commande confirmée !"}
            </p>
            <p className="text-muted-foreground">
              {language === "en" ? "Order number: " : "Numéro de commande : "}
              <span className="font-mono font-semibold">{orderNumber}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "We will contact you shortly to confirm details."
                : "Nous vous contacterons sous peu pour confirmer les détails."}
            </p>
            <a
              href={`/suivi/${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary underline underline-offset-2"
            >
              {language === "en" ? "Track your order" : "Suivre votre commande"}
            </a>

            <div className="border-t border-border pt-4 space-y-3">
              {nitaPaid ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <CheckCircle2 size={20} />
                  {language === "en" ? "Payment received!" : "Paiement reçu !"}
                </div>
              ) : nitaCode ? (
                <div className="space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Pay at any NITA agency or via MYNITA with this code:"
                      : "Payez dans une agence NITA ou via MYNITA avec ce code :"}
                  </p>
                  <p className="text-xl font-mono font-bold tracking-wide bg-muted rounded-md py-2">
                    {nitaCode}
                  </p>
                  {nitaExpiresAt && (
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? "Valid until " : "Valable jusqu'au "}
                      {new Date(nitaExpiresAt).toLocaleString(
                        language === "en" ? "en-US" : "fr-FR"
                      )}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground italic">
                    {language === "en"
                      ? "This page will update automatically once payment is confirmed."
                      : "Cette page se mettra à jour automatiquement une fois le paiement confirmé."}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handlePayWithNita}
                  disabled={nitaLoading}
                  className="w-full"
                  variant="outline"
                >
                  {nitaLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : language === "en" ? (
                    "Pay with NITA"
                  ) : (
                    "Payer avec NITA"
                  )}
                </Button>
              )}
              {nitaError && (
                <div className="text-sm text-center space-y-2">
                  {nitaError.includes("Montant non défini ou invalide") ? (
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-md text-orange-800 dark:text-orange-200">
                      <p className="font-medium mb-1">
                        Prix non disponible pour cette commande
                      </p>
                      <p className="text-xs mb-3 opacity-90">
                        Ce produit nécessite un devis personnalisé. Veuillez
                        nous contacter pour finaliser votre achat.
                      </p>
                      <a
                        href="https://wa.me/22791127870?text=Bonjour%2C%20je%20souhaite%20obtenir%20un%20devis%20ou%20finaliser%20ma%20commande%20dont%20le%20prix%20n%27est%20pas%20affich%C3%A9."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors w-full"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Contacter sur WhatsApp
                      </a>
                    </div>
                  ) : (
                    <p className="text-destructive">{nitaError}</p>
                  )}
                </div>
              )}
            </div>

            <Button onClick={handleClose} className="w-full">
              {language === "en" ? "Close" : "Fermer"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {language === "en"
                ? `${items.length} item${items.length !== 1 ? "s" : ""} in this order`
                : `${items.length} article${items.length !== 1 ? "s" : ""} dans cette commande`}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "en" ? "Full Name" : "Nom complet"} *
              </label>
              <Input
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder={language === "en" ? "Your name" : "Votre nom"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "en" ? "Phone Number" : "Numéro de téléphone"} *
              </label>
              <Input
                required
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+227 XX XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "en"
                  ? "Delivery Address (optional)"
                  : "Adresse de livraison (facultatif)"}
              </label>
              <Input
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder={language === "en" ? "Address" : "Adresse"}
              />
            </div>

            {!isAuthenticated && (
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="wantAccount"
                    checked={wantAccount}
                    onCheckedChange={checked =>
                      setWantAccount(checked === true)
                    }
                  />
                  <label
                    htmlFor="wantAccount"
                    className="text-sm font-medium cursor-pointer"
                  >
                    {language === "en"
                      ? "Create an account to track my orders"
                      : "Créer un compte pour suivre mes commandes"}
                  </label>
                </div>

                {wantAccount && (
                  <div className="space-y-3 pl-1">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Email" : "Email"} *
                      </label>
                      <Input
                        required={wantAccount}
                        type="email"
                        value={accountEmail}
                        onChange={e => setAccountEmail(e.target.value)}
                        placeholder={
                          language === "en"
                            ? "you@example.com"
                            : "vous@exemple.com"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === "en" ? "Password" : "Mot de passe"} *
                      </label>
                      <Input
                        required={wantAccount}
                        type="password"
                        minLength={6}
                        value={accountPassword}
                        onChange={e => setAccountPassword(e.target.value)}
                        placeholder={
                          language === "en"
                            ? "At least 6 characters"
                            : "6 caractères minimum"
                        }
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : language === "en" ? (
                "Confirm Order"
              ) : (
                "Confirmer la commande"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
