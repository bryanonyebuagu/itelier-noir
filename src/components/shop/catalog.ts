import data from "@/data/products.json";
import type { ShopCategory, ShopProduct } from "./types";
export const curatedCatalog = data as ShopProduct[];
export const curatedMenProducts = curatedCatalog.filter(p => p.category === "MEN");
export const curatedWomenProducts = curatedCatalog.filter(p => p.category === "WOMEN");
export const curatedSaleProducts = curatedCatalog.filter(p => p.salePrice !== null);
export const getCuratedProduct = (slug: string) => curatedCatalog.find(p => p.slug === slug);
export const getCuratedProductsForCategory = (category: ShopCategory) => category === "men" ? curatedMenProducts : category === "women" ? curatedWomenProducts : curatedSaleProducts;
