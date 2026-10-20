export const SHIPPING_METHODS = {
  STANDARD: { name:"Standard delivery",price:5000,time:"3–5 business days" },
  EXPRESS: { name:"Express delivery",price:10000,time:"1–2 business days" },
  SAME_DAY: { name:"Same-day delivery",price:15000,time:"Lagos only" },
} as const;
export type ShippingMethod = keyof typeof SHIPPING_METHODS;
export function shippingPrice(subtotal:number,method:ShippingMethod) {
  return subtotal>=150000 && method==="EXPRESS" ? 0 : SHIPPING_METHODS[method].price;
}
