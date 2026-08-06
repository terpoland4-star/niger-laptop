import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const sampleItem = {
  id: "prod-1",
  name: "Laptop Test",
  price: 150000,
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("commence avec un panier vide", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("ajoute un nouvel article au panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe("prod-1");
    expect(result.current.cart[0].quantity).toBe(1);
  });

  it("incrémente la quantité si l'article existe déjà", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
      result.current.addToCart(sampleItem);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it("ajoute avec une quantité personnalisée", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
  });

  it("supprime un article du panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
      result.current.removeFromCart("prod-1");
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("met à jour la quantité d'un article", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
      result.current.updateQuantity("prod-1", 3);
    });

    expect(result.current.cart[0].quantity).toBe(3);
  });

  it("supprime l'article si la quantité mise à jour est 0 ou négative", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
      result.current.updateQuantity("prod-1", 0);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("indique correctement si un article est dans le panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isInCart("prod-1")).toBe(false);

    act(() => {
      result.current.addToCart(sampleItem);
    });

    expect(result.current.isInCart("prod-1")).toBe(true);
  });

  it("vide complètement le panier", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
      result.current.addToCart({ ...sampleItem, id: "prod-2" });
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it("calcule correctement totalItems et totalPrice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem, 2);
      result.current.addToCart(
        { ...sampleItem, id: "prod-2", price: 50000 },
        3
      );
    });

    expect(result.current.totalItems).toBe(5);
    expect(result.current.totalPrice).toBe(150000 * 2 + 50000 * 3);
  });

  it("persiste le panier dans localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleItem);
    });

    const stored = localStorage.getItem("niger-laptops-cart");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toHaveLength(1);
  });
});
