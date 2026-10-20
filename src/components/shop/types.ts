export interface ShopProduct {
  id: string;
  title: string;
  description: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  stock: number;
  category: string;
  badge: string | null;
  images: string;
  sizes: string;
  colors: string;
  material?: string | null;
  care?: string | null;
  productType?: string;
  gender?: "MEN" | "WOMEN";
  tags?: string[];
  isOnSale?: boolean;
  discountPercent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopColor {
  name: string;
  hex: string;
}

export type ShopCategory = "men" | "women" | "sale";

export type SortValue = "newest" | "bestseller" | "price-asc" | "price-desc";

export type AvailabilityValue = "all" | "in-stock" | "sold-out";

export interface ShopFiltersState {
  size: string;
  color: string;
  priceMin: string;
  priceMax: string;
  availability: AvailabilityValue;
  productType: string;
  gender: string;
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getProductPrice(product: ShopProduct) {
  return product.salePrice ?? product.basePrice;
}

export function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}
