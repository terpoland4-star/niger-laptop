import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  fetchAdminOrders,
  fetchAgents,
  createAgent,
  assignDelivery,
  fetchAdminDeliveries,
  AdminOrder,
  AdminDeliveryAgent,
  AdminDelivery,
} from "@/lib/api";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NIAMEY_CENTER = { lat: 13.5137, lng: 2.1098 };

export default function AdminDeliveries() {
  const {
    token,
    admin,
    isLoading: authLoading,
    isAuthenticated,
    logout,
  } = useAdminAuth();
  const [, navigate] = useLocation();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [agents, setAgents] = useState<AdminDeliveryAgent[]>([]);
  const [adminDeliveries, setAdminDeliveries] = useState<AdminDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgentByOrder, setSelectedAgentByOrder] = useState<
    Record<string, string>
  >({});

  const [agentForm, setAgentForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [ord, ag, del] = await Promise.all([
        fetchAdminOrders(token),
        fetchAgents(token),
        fetchAdminDeliveries(token),
      ]);
      setOrders(ord.data);
      setAgents(ag.data);
      setAdminDeliveries(del.data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) loadAll();
  }, [isAuthenticated, loadAll]);

  // Poll agents' positions every 8s for near-real-time tracking
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const interval = setInterval(async () => {
      const res = await fetchAgents(token);
      setAgents(res.data);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  // Update map markers whenever agents change
  useEffect(() => {
    if (!mapInstance.current || !window.google) return;

    for (const agent of agents) {
      if (!agent.location) continue;
      const position = { lat: agent.location.lat, lng: agent.location.lng };

      if (markersRef.current[agent.id]) {
        markersRef.current[agent.id].position = position;
      } else {
        markersRef.current[agent.id] =
          new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance.current,
            position,
            title: agent.name,
          });
      }
    }
  }, [agents]);

  const deliveredOrderIds = new Set(
    adminDeliveries.filter(d => d.status !== "delivered").map(d => d.orderId)
  );

  const assignableOrders = orders.filter(
    o =>
      !deliveredOrderIds.has(o.id) &&
      o.status !== "cancelled" &&
      o.status !== "delivered"
  );

  const handleAssign = async (orderId: string) => {
    const agentId = selectedAgentByOrder[orderId];
    if (!token || !agentId) return;
    await assignDelivery(token, orderId, agentId);
    loadAll();
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await createAgent(token, agentForm);
    setAgentForm({ name: "", phone: "", email: "", password: "" });
    loadAll();
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h1 className="font-display text-xl font-bold">Livraisons</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/orders")}
          >
            ← Commandes
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground truncate">
            {admin?.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
          >
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <>
            <section>
              <h2 className="font-display text-lg font-semibold mb-3">
                Livreurs en direct
              </h2>
              <MapView
                initialCenter={NIAMEY_CENTER}
                initialZoom={13}
                onMapReady={map => {
                  mapInstance.current = map;
                }}
                className="rounded-lg border border-border"
              />
              <div className="flex flex-wrap gap-3 mt-3">
                {agents.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium">{a.name}</span>
                    {a.location ? (
                      <Badge variant="default">En ligne</Badge>
                    ) : (
                      <Badge variant="outline">Hors ligne</Badge>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">
                Ajouter un livreur
              </h2>
              <form
                onSubmit={handleCreateAgent}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end"
              >
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={agentForm.name}
                    onChange={e =>
                      setAgentForm({ ...agentForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={agentForm.phone}
                    onChange={e =>
                      setAgentForm({ ...agentForm, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={agentForm.email}
                    onChange={e =>
                      setAgentForm({ ...agentForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input
                    type="password"
                    value={agentForm.password}
                    onChange={e =>
                      setAgentForm({ ...agentForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit">+ Ajouter</Button>
              </form>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">
                Commandes à assigner ({assignableOrders.length})
              </h2>
              <div className="space-y-3">
                {assignableOrders.map(o => (
                  <div
                    key={o.id}
                    className="border border-border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-mono font-semibold">{o.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.customerName} — {o.customerPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={selectedAgentByOrder[o.id] ?? ""}
                        onValueChange={v =>
                          setSelectedAgentByOrder({
                            ...selectedAgentByOrder,
                            [o.id]: v,
                          })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Livreur" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map(a => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        disabled={!selectedAgentByOrder[o.id]}
                        onClick={() => handleAssign(o.id)}
                      >
                        Assigner
                      </Button>
                    </div>
                  </div>
                ))}
                {assignableOrders.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Aucune commande en attente d'assignation.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
