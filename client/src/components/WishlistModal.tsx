import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Share2, Trash2 } from "lucide-react";
import { WishlistItem } from "@/hooks/useWishlist";
import { openWishlistChat } from "@/lib/whatsapp";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onOrderClick: () => void;
  language?: "en" | "fr";
}

export const WishlistModal = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onClear,
  onOrderClick,
  language = "fr"
}: WishlistModalProps) => {
  const handleShareWishlist = () => {
    const wishlistItems = items.map((item) => ({
      name: item.name,
      imageUrl: item.imageUrl
    }));
    openWishlistChat(wishlistItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === "en" ? "My Wishlist" : "Ma Liste d'Intérêt"}
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {language === "en"
                ? "Your wishlist is empty"
                : "Votre liste d'intérêt est vide"}
            </p>
            <Button onClick={onClose} variant="outline">
              {language === "en" ? "Continue Shopping" : "Continuer vos achats"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wishlist Items */}
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
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? "Added" : "Ajouté"}{" "}
                        {new Date(item.addedAt).toLocaleDateString(
                          language === "en" ? "en-US" : "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <X size={18} className="text-destructive" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button
                onClick={onOrderClick}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {language === "en" ? "Order Now" : "Commander maintenant"}
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={handleShareWishlist}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  {language === "en"
                    ? "Share via WhatsApp"
                    : "Partager sur WhatsApp"}
                </Button>

                <Button
                  onClick={onClear}
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  {language === "en" ? "Clear All" : "Tout effacer"}
                </Button>
              </div>
            </div>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center">
              {language === "en"
                ? `${items.length} item${items.length !== 1 ? "s" : ""} in your wishlist`
                : `${items.length} article${items.length !== 1 ? "s" : ""} dans votre liste`}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
