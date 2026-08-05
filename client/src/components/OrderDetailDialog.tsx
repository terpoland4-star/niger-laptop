import { useState, useEffect } from "react";
import { AdminOrder, OrderStatus, updateOrderStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  thumbnail: string | null;
}

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
  token: string;
  onUpdated: () => void;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  token,
  onUpdated,
}: OrderDetailDialogProps) {
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status as OrderStatus);
      setNote("");
      setError(null);
    }
  }, [order, open]);

  if (!order) return null;

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(order.itemsJson);
  } catch {
    console.error(
      "[OrderDetailDialog] Échec du parsing itemsJson pour la commande",
      order.orderNumber
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await updateOrderStatus(token, order.id, status, note || undefined);
      onUpdated();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            Commande {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Client :</span>{" "}
              {order.customerName}
            </p>
            <p>
              <span className="text-muted-foreground">Téléphone :</span>{" "}
              {order.customerPhone}
            </p>
            <p>
              <span className="text-muted-foreground">Adresse :</span>{" "}
              {order.deliveryAddress || "Non renseignée"}
            </p>
            <p>
              <span className="text-muted-foreground">Date :</span>{" "}
              {new Date(order.createdAt).toLocaleString("fr-FR")}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Statut actuel :</span>
              <Badge>{STATUS_LABELS[order.status] ?? order.status}</Badge>
            </p>
          </div>

          <div className="border-t pt-3 space-y-2">
            {items.map(item => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.productName} x{item.quantity}
                </span>
                <span>{item.lineTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>{order.total.toLocaleString("fr-FR")} FCFA</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Changer le statut</Label>
              <Select
                value={status}
                onValueChange={value => setStatus(value as OrderStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optionnel)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Ex: colis parti ce matin"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fermer
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (status === order.status && !note)}
              >
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
