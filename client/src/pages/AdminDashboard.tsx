import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminProduct } from "@/lib/api";
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
import { ProductFormDialog } from "@/components/ProductFormDialog";

const API_BASE = "https://api.niger-laptops.com";

export default function AdminDashboard() {
  const {
    token,
    admin,
    isLoading: authLoading,
    isAuthenticated,
    logout,
  } = useAdminAuth();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const { data } = await res.json();
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadProducts();
  }, [isAuthenticated, loadProducts]);

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h1 className="font-display text-xl font-bold">
            Administration Niger Laptops
          </h1>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              Commandes →
            </Button>
          </Link>
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

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold">
            Produits ({products.length})
          </h2>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setDialogOpen(true);
            }}
          >
            + Nouveau produit
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nameFr}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.price?.toLocaleString("fr-FR")} FCFA</TableCell>
                  <TableCell>{p.stockQuantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.stockQuantity > 0 ? "default" : "destructive"}
                    >
                      {p.stockQuantity > 0 ? "En stock" : "Rupture"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(p);
                        setDialogOpen(true);
                      }}
                    >
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        token={token!}
        onSaved={loadProducts}
      />
    </div>
  );
}
