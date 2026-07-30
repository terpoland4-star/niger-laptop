import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  addedAt: number;
}

const CART_KEY = "niger-laptops-cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        console.error("Failed to parse cart from localStorage");
        toast.error("Votre panier a été réinitialisé suite à un problème technique.");
        localStorage.removeItem(CART_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: { id: string; name: string; imageUrl?: string; price: number }, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { ...item, quantity, addedAt: Date.now() }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, quantity } : c)));
  };

  const isInCart = (id: string): boolean => cart.some((c) => c.id === id);

  const clearCart = () => setCart([]);

  const saveCartToPhone = async (phone: string) => {
    try {
      const res = await fetch(`https://api.niger-laptops.com/api/cart/${phone}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      if (!res.ok) throw new Error();
      toast.success("Panier sauvegardé. Utilisez ce numéro pour le récupérer sur un autre appareil.");
    } catch {
      toast.error("Impossible de sauvegarder le panier. Réessayez plus tard.");
    }
  };

  const loadCartFromPhone = async (phone: string) => {
    try {
      const res = await fetch(`https://api.niger-laptops.com/api/cart/${phone}`);
      if (!res.ok) {
        toast.error("Aucun panier trouvé pour ce numéro.");
        return;
      }
      const { data } = await res.json();
      setCart(data.items);
      toast.success("Panier récupéré avec succès.");
    } catch {
      toast.error("Impossible de récupérer le panier. Réessayez plus tard.");
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    clearCart,
    saveCartToPhone,
    loadCartFromPhone,
    totalItems,
    totalPrice,
    isLoaded
  };
};
