import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { trackOrder, OrderTrackingData } from "@/lib/api";
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
    if (
      !orderNumber ||
      !order?.delivery ||
      order.delivery.status === "delivered"
    )
      return;
    const interval = setInterval(() => {
      trackOrder(orderNumber)
        .then(res => setOrder(res.data))
        .catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [orderNumber, order?.delivery?.status]);

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
