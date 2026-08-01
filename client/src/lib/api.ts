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
}

export interface OrderResponse {
  data: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export async function registerCustomer(payload: RegisterPayload): Promise<CustomerAuthResponse> {
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

export async function loginCustomer(payload: CustomerAuthPayload): Promise<CustomerAuthResponse> {
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

export async function getMyOrders(token: string): Promise<{ data: CustomerOrder[] }> {
  const res = await fetch(`${API_BASE}/api/auth/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Impossible de charger l'historique des commandes");
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

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
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
