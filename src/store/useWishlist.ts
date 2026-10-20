import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stock?: number;
  category?: string;
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }>;
}

export interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (item) => {
        const items = [...get().items];
        const exists = items.some((i) => i.productId === item.productId);

        if (exists) {
          set({ items: items.filter((i) => i.productId !== item.productId) });
        } else {
          items.push(item);
          set({ items });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "atelier-noir-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
