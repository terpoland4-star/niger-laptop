import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminOrder, OrderStatus, fetchAdminOrders, updateOrderStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetailDialog, STATUS_LABELS } from "@/components/OrderDetailDialog";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "secondary",
  shipped: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export default function AdminOrders() {
  const { token, admin, isLoading: authLoading, isAuthenticated } = useAdminAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await fetchAdminOrders(token);
      setOrders(data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) loadOrders();
  }, [isAuthenticated, loadOrders]);

  const handleQuickStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(token, orderId, newStatus);
      await loadOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl font-bold">Commandes</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>← Produits</Button>
        </div>
        <span className="text-sm text-muted-foreground">{admin?.email}</span>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="font-display text-lg font-semibold mb-6">Commandes ({orders.length})</h2>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.orderNumber}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{o.customerPhone}</TableCell>
                  <TableCell>{o.total.toLocaleString("fr-FR")} FCFA</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <Select
                      value={o.status}
                      onValueChange={(value) => handleQuickStatusChange(o.id, value as OrderStatus)}
                      disabled={updatingId === o.id}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <Badge variant={STATUS_VARIANTS[o.status] ?? "outline"}>
                            {STATUS_LABELS[o.status] ?? o.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(o); setDialogOpen(true); }}>
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>

      <OrderDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedOrder}
        token={token!}
        onUpdated={loadOrders}
      />
    </div>
  );
}
