const API_BASE = "https://api.niger-laptops.com";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  items: OrderItem[];
  createAccountEmail?: string;
  createAccountPassword?: string;
}

export interface OrderResponse {
  data: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
  newAccountToken?: string;
}

export async function createOrder(
  payload: CreateOrderPayload,
  token?: string
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la commande");
  }

  return res.json();
}

// --- Comptes clients ---

export interface CustomerAuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends CustomerAuthPayload {
  name: string;
  phone?: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string | null;
}

export interface CustomerAuthResponse {
  data: {
    token: string;
    customer: Customer;
  };
}

export async function registerCustomer(
  payload: RegisterPayload
): Promise<CustomerAuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de l'inscription");
  }

  return res.json();
}

export async function loginCustomer(
  payload: CustomerAuthPayload
): Promise<CustomerAuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la connexion");
  }

  return res.json();
}

export async function getMe(token: string): Promise<{ data: Customer }> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Impossible de charger le compte");
  return res.json();
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  status: string;
  total: number;
  itemsJson: string;
  createdAt: string;
  customerId: string | null;
}

export async function getMyOrders(
  token: string
): Promise<{ data: CustomerOrder[] }> {
  const res = await fetch(`${API_BASE}/api/auth/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok)
    throw new Error("Impossible de charger l'historique des commandes");
  return res.json();
}

// --- Admin ---

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  data: {
    token: string;
    admin: { id: string; email: string; role: string };
  };
}

export async function adminLogin(
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la connexion");
  }

  return res.json();
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface AdminProduct {
  id: string;
  nameFr: string;
  nameEn: string;
  category: string;
  condition: string;
  price: number | null;
  oldPrice: number | null;
  thumbnail: string | null;
  featured: boolean;
  rating: number | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  stockQuantity: number;
  specs: ProductSpec[];
}

export interface ProductPayload {
  nameFr: string;
  nameEn: string;
  category: string;
  condition: string;
  price?: number;
  oldPrice?: number;
  featured?: boolean;
  rating?: number;
  descriptionFr?: string;
  descriptionEn?: string;
  stockQuantity?: number;
  specs?: ProductSpec[];
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function createProduct(
  token: string,
  payload: ProductPayload
): Promise<{ data: AdminProduct }> {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la création");
  }

  return res.json();
}

export async function updateProduct(
  token: string,
  id: string,
  payload: Partial<ProductPayload>
): Promise<{ data: AdminProduct }> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la modification");
  }

  return res.json();
}

export async function uploadProductImage(
  token: string,
  id: string,
  file: File
): Promise<{ data: { thumbnail: string } }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/api/admin/products/${id}/image`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de l'upload");
  }

  return res.json();
}

export interface ProductHistoryEntry {
  id: string;
  productId: string;
  action: string;
  changesJson: string | null;
  adminId: string;
  createdAt: string;
}

export async function getProductHistory(
  token: string,
  id: string
): Promise<{ data: ProductHistoryEntry[] }> {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}/history`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Impossible de charger l'historique");
  return res.json();
}

// --- Admin: commandes ---

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  status: string;
  total: number;
  itemsJson: string;
  createdAt: string;
  customerId: string | null;
  isPaid: boolean;
  paidAt: string | null;
  receiptUrl?: string;
  nita?: { codeAchat: string | null; status: string } | null;
}

export async function fetchAdminOrders(
  token: string
): Promise<{ data: AdminOrder[] }> {
  const res = await fetch(`${API_BASE}/api/admin/orders`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Impossible de charger les commandes");
  return res.json();
}

export type OrderStatus =
  "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export async function updateOrderStatus(
  token: string,
  id: string,
  status: OrderStatus,
  note?: string
): Promise<{ data: AdminOrder }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status, note }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la mise à jour du statut");
  }

  return res.json();
}

export async function markOrderAsPaid(
  token: string,
  id: string
): Promise<{ data: AdminOrder }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${id}/mark-paid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec du marquage comme payé");
  }

  return res.json();
}

export async function cancelOrderNita(
  token: string,
  id: string
): Promise<{ data: { status: string; codeAchat: string | null } }> {
  const res = await fetch(`${API_BASE}/api/admin/orders/${id}/cancel-nita`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de l'annulation NITA");
  }

  return res.json();
}

export async function getNitaBalance(token: string): Promise<{ data: number }> {
  const res = await fetch(`${API_BASE}/api/admin/nita/balance`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de récupération du solde NITA");
  }

  return res.json();
}

// --- Admin: clients ---

export interface AdminCustomer {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
}

export async function fetchAdminCustomers(
  token: string
): Promise<{ data: AdminCustomer[] }> {
  const res = await fetch(`${API_BASE}/api/admin/customers`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Impossible de charger les clients");
  return res.json();
}

// --- Suivi de commande (public) ---

export interface OrderTrackingItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  thumbnail: string | null;
}

export interface OrderTrackingDelivery {
  status: string;
  location: { lat: number; lng: number; updatedAt: string } | null;
}

export interface OrderTrackingNita {
  codeAchat: string | null;
  status: string;
  expiresAt: string;
}

export interface OrderTrackingData {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderTrackingItem[];
  delivery: OrderTrackingDelivery | null;
  isPaid: boolean;
  nita: OrderTrackingNita | null;
}

export async function trackOrder(
  orderNumber: string
): Promise<{ data: OrderTrackingData }> {
  const res = await fetch(
    `${API_BASE}/api/orders/track/${encodeURIComponent(orderNumber)}`
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Commande non trouvée");
  }

  return res.json();
}

// --- Admin: comptabilité ---

export interface Expense {
  id: string;
  type: "charge" | "revenue";
  category: string;
  label: string;
  amount: number;
  date: string;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface ExpensePayload {
  type?: "charge" | "revenue";
  category: string;
  label: string;
  amount: number;
  date: string;
  note?: string;
}

export async function fetchExpenses(
  token: string
): Promise<{ data: Expense[] }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/expenses`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Impossible de charger les charges");
  return res.json();
}

export async function createExpense(
  token: string,
  payload: ExpensePayload
): Promise<{ data: Expense }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la création de la charge");
  }
  return res.json();
}

export async function deleteExpense(
  token: string,
  id: string
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/expenses/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la suppression");
  }
  return res.json();
}

export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  note: string | null;
  createdAt: string;
}

export interface SupplierPayload {
  name: string;
  phone?: string;
  note?: string;
}

export async function fetchSuppliers(
  token: string
): Promise<{ data: Supplier[] }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/suppliers`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Impossible de charger les fournisseurs");
  return res.json();
}

export async function createSupplier(
  token: string,
  payload: SupplierPayload
): Promise<{ data: Supplier }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la création du fournisseur");
  }
  return res.json();
}

export interface Purchase {
  id: string;
  productId: string;
  supplierId: string | null;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface PurchasePayload {
  productId: string;
  supplierId?: string;
  quantity: number;
  unitCost: number;
  date: string;
  note?: string;
}

export async function fetchPurchases(
  token: string
): Promise<{ data: Purchase[] }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/purchases`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Impossible de charger les achats");
  return res.json();
}

export async function createPurchase(
  token: string,
  payload: PurchasePayload
): Promise<{ data: Purchase }> {
  const res = await fetch(`${API_BASE}/api/admin/accounting/purchases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de l'enregistrement de l'achat");
  }
  return res.json();
}

export interface AccountingDashboard {
  period: { from: string | null; to: string | null };
  revenueTotal: number;
  revenueByChannel: Record<string, number>;
  purchasesTotal: number;
  expensesTotal: number;
  expensesByCategory: Record<string, number>;
  netBalance: number;
  ordersCount: number;
}

export async function fetchAccountingDashboard(
  token: string,
  from?: string,
  to?: string
): Promise<{ data: AccountingDashboard }> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  const res = await fetch(
    `${API_BASE}/api/admin/accounting/dashboard${qs ? `?${qs}` : ""}`,
    { headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error("Impossible de charger le tableau de bord");
  return res.json();
}

// --- Livreurs (agent) ---

export interface AgentLoginPayload {
  email: string;
  password: string;
}

export interface AgentLoginResponse {
  data: {
    token: string;
    agent: { id: string; email: string; name: string };
  };
}

export async function agentLogin(
  payload: AgentLoginPayload
): Promise<AgentLoginResponse> {
  const res = await fetch(`${API_BASE}/api/agent/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la connexion");
  }
  return res.json();
}

export interface AgentDelivery {
  id: string;
  orderId: string;
  agentId: string;
  status: "assigned" | "picked_up" | "en_route" | "delivered";
  startedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  order: AdminOrder | null;
}

export async function fetchAgentDeliveries(
  token: string
): Promise<{ data: AgentDelivery[] }> {
  const res = await fetch(`${API_BASE}/api/agent/deliveries`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Impossible de charger les courses");
  return res.json();
}

export async function updateDeliveryStatus(
  token: string,
  id: string,
  status: "picked_up" | "en_route" | "delivered"
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/agent/deliveries/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la mise à jour");
  }
  return res.json();
}

export async function pingAgentLocation(
  token: string,
  lat: number,
  lng: number
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/agent/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ lat, lng }),
  });
  if (!res.ok) throw new Error("Échec de l'envoi de la position");
  return res.json();
}

// --- Admin: livreurs & livraisons ---

export interface AgentLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface AdminDeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  location: AgentLocation | null;
}

export async function fetchAgents(
  token: string
): Promise<{ data: AdminDeliveryAgent[] }> {
  const res = await fetch(`${API_BASE}/api/admin/agents`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Impossible de charger les livreurs");
  return res.json();
}

export interface CreateAgentPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export async function createAgent(
  token: string,
  payload: CreateAgentPayload
): Promise<{ data: AdminDeliveryAgent }> {
  const res = await fetch(`${API_BASE}/api/admin/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la création du livreur");
  }
  return res.json();
}

export interface AdminDelivery {
  id: string;
  orderId: string;
  agentId: string;
  status: string;
  startedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export async function fetchAdminDeliveries(
  token: string
): Promise<{ data: AdminDelivery[] }> {
  const res = await fetch(`${API_BASE}/api/admin/deliveries`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Impossible de charger les livraisons");
  return res.json();
}

export async function assignDelivery(
  token: string,
  orderId: string,
  agentId: string
): Promise<{ data: AdminDelivery }> {
  const res = await fetch(`${API_BASE}/api/admin/deliveries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ orderId, agentId }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de l'assignation");
  }
  return res.json();
}

// --- Paiement NITA ---

export interface NitaPaymentResponse {
  data: {
    codeAchat: string | null;
    montant: number;
    expiresAt: string;
    reused: boolean;
  };
}

export async function payWithNita(
  orderId: string
): Promise<NitaPaymentResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/pay-with-nita`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(error.error || "Échec de la génération du paiement NITA");
  }

  return res.json();
}

export interface NitaStatusResponse {
  data: {
    status: string;
    codeAchat: string | null;
    isPaid: boolean;
  };
}

export async function getNitaStatus(
  orderId: string
): Promise<NitaStatusResponse> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/nita-status`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(
      error.error || "Impossible de vérifier le statut du paiement"
    );
  }

  return res.json();
}
