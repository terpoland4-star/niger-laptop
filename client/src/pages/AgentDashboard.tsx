import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useAgentAuth } from "@/hooks/useAgentAuth";
import { openTrackingWhatsApp } from "@/lib/whatsapp";
import {
  fetchAgentDeliveries,
  updateDeliveryStatus,
  pingAgentLocation,
  AgentDelivery,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  assigned: "Assignée",
  picked_up: "Récupérée",
  en_route: "En route",
  delivered: "Livrée",
};

const NEXT_STATUS: Record<
  string,
  "picked_up" | "en_route" | "delivered" | null
> = {
  assigned: "picked_up",
  picked_up: "en_route",
  en_route: "delivered",
  delivered: null,
};

const NEXT_LABEL: Record<string, string> = {
  assigned: "Marquer comme récupérée",
  picked_up: "Démarrer la course",
  en_route: "Marquer comme livrée",
};

export default function AgentDashboard() {
  const {
    token,
    agent,
    isLoading: authLoading,
    isAuthenticated,
    logout,
  } = useAgentAuth();
  const [, navigate] = useLocation();
  const [deliveries, setDeliveries] = useState<AgentDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/agent/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadDeliveries = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetchAgentDeliveries(token);
      setDeliveries(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) loadDeliveries();
  }, [isAuthenticated, loadDeliveries]);

  const hasActiveCourse = deliveries.some(
    d => d.status === "picked_up" || d.status === "en_route"
  );

  const startTracking = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError(
        "La géolocalisation n'est pas disponible sur cet appareil."
      );
      return;
    }
    setLocationError(null);
    setTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        lastPositionRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      err => {
        setLocationError(err.message || "Impossible d'obtenir la position");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    pingIntervalRef.current = window.setInterval(() => {
      if (token && lastPositionRef.current) {
        pingAgentLocation(
          token,
          lastPositionRef.current.lat,
          lastPositionRef.current.lng
        ).catch(() => {});
      }
    }, 7000);
  }, [token]);

  const stopTracking = useCallback(() => {
    setTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (pingIntervalRef.current !== null) {
      window.clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (hasActiveCourse && !tracking) {
      startTracking();
    }
    if (!hasActiveCourse && tracking) {
      stopTracking();
    }
  }, [hasActiveCourse, tracking, startTracking, stopTracking]);

  useEffect(() => stopTracking, [stopTracking]);

  const handleAdvance = async (delivery: AgentDelivery) => {
    const next = NEXT_STATUS[delivery.status];
    if (!next || !token) return;
    await updateDeliveryStatus(token, delivery.id, next);

    if (next === "picked_up" && delivery.order) {
      const trackingUrl = `https://niger-laptops.com/suivi/${delivery.order.orderNumber}`;
      openTrackingWhatsApp(
        delivery.order.orderNumber,
        trackingUrl,
        delivery.order.customerPhone
      );
    }

    loadDeliveries();
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Mes livraisons</h1>
          <p className="text-sm text-muted-foreground">{agent?.name}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            stopTracking();
            logout();
            navigate("/agent/login");
          }}
        >
          Déconnexion
        </Button>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {tracking && (
          <div className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 py-2">
            📍 Position partagée en direct
          </div>
        )}
        {locationError && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
            {locationError}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-muted-foreground">
            Aucune course assignée pour le moment.
          </p>
        ) : (
          deliveries.map(d => (
            <div
              key={d.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold">
                  {d.order?.orderNumber ?? d.orderId}
                </span>
                <Badge>{STATUS_LABELS[d.status] ?? d.status}</Badge>
              </div>
              {d.order && (
                <div className="text-sm space-y-1">
                  <p className="font-medium">{d.order.customerName}</p>
                  <p className="text-muted-foreground">
                    {d.order.customerPhone}
                  </p>
                  {d.order.deliveryAddress && (
                    <p className="text-muted-foreground">
                      {d.order.deliveryAddress}
                    </p>
                  )}
                  <p className="font-semibold">
                    {d.order.total.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              )}
              {NEXT_STATUS[d.status] && (
                <Button className="w-full" onClick={() => handleAdvance(d)}>
                  {NEXT_LABEL[d.status]}
                </Button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
