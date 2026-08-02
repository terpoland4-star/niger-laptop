import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Minus, Plus, Trash2, Save, Download } from "lucide-react";
import { CartItem } from "@/contexts/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClear: () => void;
  onOrderClick: () => void;
  onSaveToPhone: (phone: string) => void;
  onLoadFromPhone: (phone: string) => void;
  totalPrice: number;
  language?: "en" | "fr";
}

export const CartModal = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  onClear,
  onOrderClick,
  onSaveToPhone,
  onLoadFromPhone,
  totalPrice,
  language = "fr"
}: CartModalProps) => {
  const [phone, setPhone] = useState("");
  const formattedTotal = new Intl.NumberFormat(language === "en" ? "en-US" : "fr-FR").format(totalPrice);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === "en" ? "My Cart" : "Mon Panier"}
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {language === "en" ? "Your cart is empty" : "Votre panier est vide"}
            </p>
            <Button onClick={onClose} variant="outline">
              {language === "en" ? "Continue Shopping" : "Continuer vos achats"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{item.name}</p>
                      {item.price > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {new Intl.NumberFormat(language === "en" ? "en-US" : "fr-FR").format(item.price)} FCFA
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mx-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-primary/10 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-primary/10 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    aria-label="Remove from cart"
                  >
                    <X size={18} className="text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            {totalPrice > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-border font-semibold text-lg">
                <span>{language === "en" ? "Total" : "Total"}</span>
                <span className="text-primary">{formattedTotal} FCFA</span>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={onOrderClick}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {language === "en" ? "Proceed to Order" : "Passer la commande"}
              </Button>
              <Button
                onClick={onClear}
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/10 font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                {language === "en" ? "Clear Cart" : "Vider le panier"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {language === "en"
                ? `${items.length} item${items.length !== 1 ? "s" : ""} in your cart`
                : `${items.length} article${items.length !== 1 ? "s" : ""} dans votre panier`}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground">
            {language === "en"
              ? "Save your cart to retrieve it on another device"
              : "Sauvegardez votre panier pour le récupérer sur un autre appareil"}
          </p>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+227 XX XX XX XX"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!phone || items.length === 0}
              onClick={() => onSaveToPhone(phone)}
              className="flex-1 flex items-center justify-center gap-2 text-xs"
            >
              <Save size={16} />
              {language === "en" ? "Save" : "Sauvegarder"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!phone}
              onClick={() => onLoadFromPhone(phone)}
              className="flex-1 flex items-center justify-center gap-2 text-xs"
            >
              <Download size={16} />
              {language === "en" ? "Retrieve" : "Récupérer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
