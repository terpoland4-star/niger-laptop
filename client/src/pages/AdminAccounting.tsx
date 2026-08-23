import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  fetchAccountingDashboard,
  fetchExpenses,
  createExpense,
  deleteExpense,
  fetchSuppliers,
  createSupplier,
  fetchPurchases,
  createPurchase,
  AccountingDashboard,
  Expense,
  Supplier,
  Purchase,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function fcfa(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

export default function AdminAccounting() {
  const {
    token,
    admin,
    isLoading: authLoading,
    isAuthenticated,
    logout,
  } = useAdminAuth();
  const [, navigate] = useLocation();

  const [dashboard, setDashboard] = useState<AccountingDashboard | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [expenseForm, setExpenseForm] = useState({
    category: "",
    label: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    phone: "",
    note: "",
  });

  const [purchaseForm, setPurchaseForm] = useState({
    productId: "",
    supplierId: "",
    quantity: "",
    unitCost: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [dash, exp, sup, pur] = await Promise.all([
        fetchAccountingDashboard(token),
        fetchExpenses(token),
        fetchSuppliers(token),
        fetchPurchases(token),
      ]);
      setDashboard(dash.data);
      setExpenses(exp.data);
      setSuppliers(sup.data);
      setPurchases(pur.data);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) loadAll();
  }, [isAuthenticated, loadAll]);

  if (authLoading || !isAuthenticated) return null;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await createExpense(token, {
      category: expenseForm.category,
      label: expenseForm.label,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
      note: expenseForm.note || undefined,
    });
    setExpenseForm({
      category: "",
      label: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
    loadAll();
  };

  const handleDeleteExpense = async (id: string) => {
    if (!token) return;
    await deleteExpense(token, id);
    loadAll();
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await createSupplier(token, {
      name: supplierForm.name,
      phone: supplierForm.phone || undefined,
      note: supplierForm.note || undefined,
    });
    setSupplierForm({ name: "", phone: "", note: "" });
    loadAll();
  };

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await createPurchase(token, {
      productId: purchaseForm.productId,
      supplierId: purchaseForm.supplierId || undefined,
      quantity: Number(purchaseForm.quantity),
      unitCost: Number(purchaseForm.unitCost),
      date: purchaseForm.date,
      note: purchaseForm.note || undefined,
    });
    setPurchaseForm({
      productId: "",
      supplierId: "",
      quantity: "",
      unitCost: "",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
    loadAll();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h1 className="font-display text-xl font-bold">
            Administration Niger Laptops
          </h1>
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              Produits →
            </Button>
          </Link>
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
        <h2 className="font-display text-lg font-semibold mb-6">
          Comptabilité
        </h2>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="expenses">Charges</TabsTrigger>
              <TabsTrigger value="purchases">Achats</TabsTrigger>
              <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
            </TabsList>

            {/* ---- Dashboard ---- */}
            <TabsContent value="dashboard">
              {dashboard && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Chiffre d'affaires
                    </p>
                    <p className="text-2xl font-bold">
                      {fcfa(dashboard.revenueTotal)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {dashboard.ordersCount} commandes payées
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Achats (stock)
                    </p>
                    <p className="text-2xl font-bold">
                      {fcfa(dashboard.purchasesTotal)}
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Charges</p>
                    <p className="text-2xl font-bold">
                      {fcfa(dashboard.expensesTotal)}
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Solde net</p>
                    <p
                      className={`text-2xl font-bold ${
                        dashboard.netBalance >= 0
                          ? "text-emerald-600"
                          : "text-destructive"
                      }`}
                    >
                      {fcfa(dashboard.netBalance)}
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4 sm:col-span-2">
                    <p className="text-sm font-medium mb-2">CA par canal</p>
                    {Object.entries(dashboard.revenueByChannel).map(
                      ([ch, amt]) => (
                        <div
                          key={ch}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="capitalize">{ch}</span>
                          <span>{fcfa(amt)}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="border border-border rounded-lg p-4 sm:col-span-2">
                    <p className="text-sm font-medium mb-2">
                      Charges par catégorie
                    </p>
                    {Object.entries(dashboard.expensesByCategory).map(
                      ([cat, amt]) => (
                        <div
                          key={cat}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="capitalize">{cat}</span>
                          <span>{fcfa(amt)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ---- Expenses ---- */}
            <TabsContent value="expenses">
              <form
                onSubmit={handleAddExpense}
                className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 mb-6 items-end"
              >
                <div>
                  <Label>Catégorie</Label>
                  <Input
                    value={expenseForm.category}
                    onChange={e =>
                      setExpenseForm({
                        ...expenseForm,
                        category: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Libellé</Label>
                  <Input
                    value={expenseForm.label}
                    onChange={e =>
                      setExpenseForm({ ...expenseForm, label: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Montant (FCFA)</Label>
                  <Input
                    type="number"
                    value={expenseForm.amount}
                    onChange={e =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={expenseForm.date}
                    onChange={e =>
                      setExpenseForm({ ...expenseForm, date: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit">+ Ajouter</Button>
              </form>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map(e => (
                    <TableRow key={e.id}>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{e.category}</Badge>
                      </TableCell>
                      <TableCell>{e.label}</TableCell>
                      <TableCell>{fcfa(e.amount)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(e.id)}
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* ---- Purchases ---- */}
            <TabsContent value="purchases">
              <form
                onSubmit={handleAddPurchase}
                className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-4 mb-6 items-end"
              >
                <div>
                  <Label>ID Produit</Label>
                  <Input
                    value={purchaseForm.productId}
                    onChange={e =>
                      setPurchaseForm({
                        ...purchaseForm,
                        productId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Fournisseur</Label>
                  <Input
                    value={purchaseForm.supplierId}
                    onChange={e =>
                      setPurchaseForm({
                        ...purchaseForm,
                        supplierId: e.target.value,
                      })
                    }
                    placeholder="optionnel"
                  />
                </div>
                <div>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    value={purchaseForm.quantity}
                    onChange={e =>
                      setPurchaseForm({
                        ...purchaseForm,
                        quantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Coût unitaire</Label>
                  <Input
                    type="number"
                    value={purchaseForm.unitCost}
                    onChange={e =>
                      setPurchaseForm({
                        ...purchaseForm,
                        unitCost: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={purchaseForm.date}
                    onChange={e =>
                      setPurchaseForm({ ...purchaseForm, date: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit">+ Ajouter</Button>
              </form>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Qté</TableHead>
                    <TableHead>Coût unitaire</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.date}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {p.productId}
                      </TableCell>
                      <TableCell>{p.quantity}</TableCell>
                      <TableCell>{fcfa(p.unitCost)}</TableCell>
                      <TableCell>{fcfa(p.totalCost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* ---- Suppliers ---- */}
            <TabsContent value="suppliers">
              <form
                onSubmit={handleAddSupplier}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 mb-6 items-end"
              >
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={supplierForm.name}
                    onChange={e =>
                      setSupplierForm({ ...supplierForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={supplierForm.phone}
                    onChange={e =>
                      setSupplierForm({
                        ...supplierForm,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Note</Label>
                  <Input
                    value={supplierForm.note}
                    onChange={e =>
                      setSupplierForm({ ...supplierForm, note: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">+ Ajouter</Button>
              </form>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.phone ?? "—"}</TableCell>
                      <TableCell>{s.note ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
