import { useState, useEffect } from "react";

export interface WishlistItem {
  id: number;
  name: string;
  imageUrl?: string;
  addedAt: number;
}

const WISHLIST_KEY = "niger-laptops-wishlist";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        console.error("Failed to parse wishlist from localStorage");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id);
      if (exists) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  const isInWishlist = (id: number): boolean => {
    return wishlist.some((w) => w.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoaded
  };
};
