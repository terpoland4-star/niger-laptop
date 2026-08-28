import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { trackOrder, payWithNita, OrderTrackingData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import nitaLogo from "@/assets/nita-logo.png";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { LeafletMap } from "@/components/LeafletMap";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  confirmed: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export default function OrderTracking() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nitaLoading, setNitaLoading] = useState(false);
  const [nitaError, setNitaError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    setIsLoading(true);
    setError(null);
    trackOrder(orderNumber)
      .then(res => setOrder(res.data))
      .catch(err =>
        setError(err instanceof Error ? err.message : "Commande non trouvée")
      )
      .finally(() => setIsLoading(false));
  }, [orderNumber]);

  useEffect(() => {
    const deliveryDone = order?.delivery?.status === "delivered";
    const paymentDone = order?.isPaid;
    if (!orderNumber || (deliveryDone && paymentDone)) return;
    const interval = setInterval(() => {
      trackOrder(orderNumber)
        .then(res => setOrder(res.data))
        .catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [orderNumber, order?.delivery?.status, order?.isPaid]);

  const handlePayWithNita = async () => {
    if (!orderNumber || !order) return;
    setNitaLoading(true);
    setNitaError(null);
    try {
      const result = await payWithNita(order.id);
      setOrder({
        ...order,
        nita: {
          codeAchat: result.data.codeAchat,
          status: "0",
          expiresAt: result.data.expiresAt,
        },
      });
    } catch (err) {
      setNitaError(
        err instanceof Error
          ? err.message
          : "Impossible de générer le code de paiement."
      );
    } finally {
      setNitaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <BackButton />
        <h1 className="font-display text-2xl font-bold text-center">
          Suivi de commande
        </h1>

        {isLoading && (
          <p className="text-center text-muted-foreground">Chargement...</p>
        )}

        {error && !isLoading && (
          <p className="text-center text-destructive">{error}</p>
        )}

        {order && !isLoading && (
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold">
                {order.orderNumber}
              </span>
              <Badge variant={STATUS_VARIANTS[order.status] ?? "outline"}>
                {STATUS_LABELS[order.status] ?? order.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Commande passée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </p>

            <div className="border-t pt-3 space-y-2">
              {order.items.map(item => (
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

            {!order.isPaid && (
              <div className="border-t pt-3 space-y-3">
                {order.nita?.codeAchat ? (
                  <div className="space-y-2 text-center">
                    <img src={nitaLogo} alt="NITA" className="h-5 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Payez dans une agence NITA ou via MYNITA avec ce code :
                    </p>
                    <p className="text-xl font-mono font-bold tracking-wide bg-muted rounded-md py-2">
                      {order.nita.codeAchat}
                    </p>
                    {order.nita.expiresAt && (
                      <p className="text-xs text-muted-foreground">
                        Valable jusqu'au{" "}
                        {new Date(order.nita.expiresAt).toLocaleString("fr-FR")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground italic">
                      Cette page se mettra à jour automatiquement une fois le
                      paiement confirmé.
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
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <img src={nitaLogo} alt="" className="h-4" />
                        Payer avec NITA
                      </span>
                    )}
                  </Button>
                )}
                {nitaError && (
                  <p className="text-sm text-destructive text-center">
                    {nitaError}
                  </p>
                )}
              </div>
            )}

            {order.isPaid && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-green-600 text-center">
                  ✓ Commande payée
                </p>
              </div>
            )}

            {order.delivery && order.delivery.location && (
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Livreur en route</span>
                  <span className="text-xs text-muted-foreground">
                    Mis à jour à{" "}
                    {new Date(
                      order.delivery.location.updatedAt
                    ).toLocaleTimeString("fr-FR")}
                  </span>
                </div>
                <LeafletMap
                  center={{
                    lat: order.delivery.location.lat,
                    lng: order.delivery.location.lng,
                  }}
                  zoom={14}
                  markers={[
                    {
                      id: "livreur",
                      lat: order.delivery.location.lat,
                      lng: order.delivery.location.lng,
                      label: "Livreur",
                    },
                  ]}
                  heightClassName="h-64"
                  className="border border-border"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
