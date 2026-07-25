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
