import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { shippingPrice } from "@/utils/shipping";

export interface CartItem {
  id: string; // Composite key: product.id + size + color
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  maxStock: number;
}

export interface CouponInfo {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon: CouponInfo | null;
  shippingMethod: "STANDARD" | "EXPRESS" | "SAME_DAY";
  shippingCost: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  applyCoupon: (coupon: CouponInfo) => void;
  removeCoupon: () => void;
  setShippingMethod: (method: "STANDARD" | "EXPRESS" | "SAME_DAY") => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;
}

const SHIPPING_RATES = {
  STANDARD: 5000,   // ₦5,000
  EXPRESS: 10000,
  SAME_DAY: 15000,
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      shippingMethod: "STANDARD",
      shippingCost: SHIPPING_RATES.STANDARD,

      addItem: (item) => {
        if (!Number.isFinite(item.quantity) || !Number.isFinite(item.maxStock) || item.maxStock <= 0 || item.quantity <= 0 || !Number.isFinite(item.price) || item.price < 0) return;
        const id = JSON.stringify([item.productId,item.size,item.color]);
        const items = [...get().items];
        const reserved = items.filter(i=>i.productId===item.productId && i.id!==id).reduce((sum,i)=>sum+i.quantity,0);
        const available = Math.max(0,Math.floor(item.maxStock)-reserved);
        if (!available) return;
        const existingItemIndex = items.findIndex((i) => i.id === id);

        if (existingItemIndex > -1) {
          const existingItem = items[existingItemIndex];
          const newQty = existingItem.quantity + item.quantity;
          items[existingItemIndex] = {
            ...existingItem,
            maxStock:item.maxStock,
            quantity: Math.min(Math.floor(newQty), available),
          };
        } else {
          items.push({ ...item, id, quantity:Math.min(Math.floor(item.quantity),available) });
        }

        set({ items });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, qty) => {
        if (!Number.isFinite(qty)) return;
        const items = get().items.map((item) => {
          if (item.id === id) {
            const reserved=get().items.filter(i=>i.productId===item.productId && i.id!==id).reduce((sum,i)=>sum+i.quantity,0);
            const newQty = Math.max(1, Math.min(Math.floor(qty), item.maxStock-reserved));
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ items });
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setShippingMethod: (method) => {
        set({
          shippingMethod: method,
          shippingCost: SHIPPING_RATES[method],
        });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, shippingMethod: "STANDARD", shippingCost: SHIPPING_RATES.STANDARD });
      },

      getCartSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;

        if (coupon.type === "PERCENTAGE") {
          return Math.min(subtotal,Math.max(0,parseFloat((subtotal * (coupon.value / 100)).toFixed(2))));
        } else {
          return Math.min(subtotal, Math.max(0,coupon.value));
        }
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        const shipping = get().items.length ? shippingPrice(subtotal,get().shippingMethod) : 0;
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: "atelier-noir-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
