import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
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
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: { id: number; name: string; imageUrl?: string; price: number }, quantity: number = 1) => {
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

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, quantity } : c)));
  };

  const isInCart = (id: number): boolean => cart.some((c) => c.id === id);

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    clearCart,
    totalItems,
    totalPrice,
    isLoaded
  };
};
