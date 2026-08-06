import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { WishlistProvider, useWishlist } from "./WishlistContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <WishlistProvider>{children}</WishlistProvider>
);

const sampleItem = {
  id: "prod-1",
  name: "Laptop Test",
};

describe("WishlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("commence avec une wishlist vide", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    expect(result.current.wishlist).toEqual([]);
  });

  it("ajoute un nouvel article à la wishlist", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0].id).toBe("prod-1");
  });

  it("n'ajoute pas de doublon si l'article est déjà présent", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
    });

    expect(result.current.wishlist).toHaveLength(1);
  });

  it("supprime un article de la wishlist", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
      result.current.removeFromWishlist("prod-1");
    });

    expect(result.current.wishlist).toHaveLength(0);
  });

  it("supprimer un article absent ne fait rien et ne plante pas", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.removeFromWishlist("inexistant");
    });

    expect(result.current.wishlist).toHaveLength(0);
  });

  it("indique correctement si un article est dans la wishlist", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.isInWishlist("prod-1")).toBe(false);

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
    });

    expect(result.current.isInWishlist("prod-1")).toBe(true);
  });

  it("vide complètement la wishlist", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
      result.current.addToWishlist({
        id: "prod-2",
        name: "Autre produit",
        addedAt: Date.now(),
      });
      result.current.clearWishlist();
    });

    expect(result.current.wishlist).toHaveLength(0);
  });

  it("gère plusieurs articles différents simultanément", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
      result.current.addToWishlist({
        id: "prod-2",
        name: "Autre produit",
        addedAt: Date.now(),
      });
      result.current.addToWishlist({
        id: "prod-3",
        name: "Troisième produit",
        addedAt: Date.now(),
      });
    });

    expect(result.current.wishlist).toHaveLength(3);
    expect(result.current.isInWishlist("prod-2")).toBe(true);
  });

  it("persiste la wishlist dans localStorage", () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.addToWishlist({ ...sampleItem, addedAt: Date.now() });
    });

    const stored = localStorage.getItem("niger-laptops-wishlist");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toHaveLength(1);
  });

  it("récupère la wishlist depuis localStorage au chargement initial", () => {
    localStorage.setItem(
      "niger-laptops-wishlist",
      JSON.stringify([{ ...sampleItem, addedAt: Date.now() }])
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0].id).toBe("prod-1");
  });

  it("réinitialise proprement si localStorage contient du JSON corrompu", () => {
    localStorage.setItem("niger-laptops-wishlist", "{ceci n'est pas du JSON");

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlist).toEqual([]);
  });
});
