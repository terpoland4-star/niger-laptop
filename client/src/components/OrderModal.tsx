import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createOrder } from "@/lib/api";
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

export const OrderModal = ({ isOpen, onClose, items, language = "fr" }: OrderModalProps) => {
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

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setWantAccount(false);
    setAccountEmail("");
    setAccountPassword("");
    setError(null);
    setOrderNumber(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
          items: items.map((item) => ({
            productId: String(item.id),
            quantity: item.quantity ?? 1,
          })),
          ...(shouldCreateAccount
            ? { createAccountEmail: accountEmail, createAccountPassword: accountPassword }
            : {}),
        },
        isAuthenticated ? token ?? undefined : undefined
      );

      // Si un compte vient d'être créé pour cette commande, on connecte
      // automatiquement le client sans bloquer l'affichage de la confirmation.
      if (result.newAccountToken) {
        loginWithToken(result.newAccountToken).catch(() => {
          // Non bloquant : la commande a réussi même si l'auto-login échoue.
        });
      }

      setOrderNumber(result.data.orderNumber);
      toast.info(
        language === "en"
          ? "A delivery person will call you to confirm your address."
          : "Un livreur vous contactera pour confirmer votre adresse.",
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
                onChange={(e) => setCustomerName(e.target.value)}
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
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+227 XX XX XX XX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {language === "en" ? "Delivery Address (optional)" : "Adresse de livraison (facultatif)"}
              </label>
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={language === "en" ? "Address" : "Adresse"}
              />
            </div>

            {!isAuthenticated && (
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="wantAccount"
                    checked={wantAccount}
                    onCheckedChange={(checked) => setWantAccount(checked === true)}
                  />
                  <label htmlFor="wantAccount" className="text-sm font-medium cursor-pointer">
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
                        onChange={(e) => setAccountEmail(e.target.value)}
                        placeholder={language === "en" ? "you@example.com" : "vous@exemple.com"}
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
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder={language === "en" ? "At least 6 characters" : "6 caractères minimum"}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

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
