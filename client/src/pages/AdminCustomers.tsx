import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminCustomer, fetchAdminCustomers } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminCustomers() {
  const {
    token,
    admin,
    isLoading: authLoading,
    isAuthenticated,
  } = useAdminAuth();
  const [, navigate] = useLocation();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadCustomers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await fetchAdminCustomers(token);
      setCustomers(data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) loadCustomers();
  }, [isAuthenticated, loadCustomers]);

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h1 className="font-display text-xl font-bold">Clients</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            ← Produits
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/orders")}
          >
            ← Commandes
          </Button>
        </div>
        <span className="text-sm text-muted-foreground truncate">
          {admin?.email}
        </span>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="font-display text-lg font-semibold mb-6">
          Clients ({customers.length})
        </h2>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Inscrit le</TableHead>
                <TableHead>Commandes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone || "—"}</TableCell>
                  <TableCell>
                    {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.orderCount > 0 ? "default" : "outline"}>
                      {c.orderCount}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  );
}
