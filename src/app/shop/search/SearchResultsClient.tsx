"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { curatedCatalog } from "@/components/shop/catalog";
import styles from "@/components/shop/ShopCategory.module.css";
import { safeJsonParse, type ShopColor, type ShopProduct } from "@/components/shop/types";

interface SearchResultsClientProps {
  query: string;
}

function matches(product: ShopProduct, query: string) {
  const colors = safeJsonParse<ShopColor[]>(product.colors, []).map((color) => color.name).join(" ");
  const haystack = [
    product.title,
    product.category,
    product.description,
    product.productType || "",
    product.material || "",
    colors,
    product.tags?.join(" ") || "",
  ].join(" ").toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function SearchResultsClient({ query }: SearchResultsClientProps) {
  const [products, setProducts] = useState<ShopProduct[]>(curatedCatalog);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { signal: controller.signal });
        if (!response.ok) return;

        const data = (await response.json()) as { products?: ShopProduct[] };
        const apiProducts = data.products || [];
        const seen = new Set(apiProducts.map((product) => product.slug));
        setProducts(apiProducts);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return products;
    return products.filter((product) => matches(product, query.trim()));
  }, [products, query]);

  return (
    <section className={styles.shell}>
      <div className={styles.catalogHeader}>
        <div>
          <span className={styles.catalogKicker}>Search atelier</span>
          <h1 className={styles.catalogTitle}>{query ? `Results for "${query}"` : "Search results"}</h1>
          <p className={styles.catalogSummary}>
            {loading ? "Curating matching pieces..." : `${results.length} matching pieces`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div className={styles.skeletonCard} key={index}>
              <div className={`skeleton-item ${styles.skeletonMedia}`} />
              <div className={`skeleton-item ${styles.skeletonLine}`} />
              <div className={`skeleton-item ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className={styles.emptyState}>
          <div>
            <h2 className={styles.emptyTitle}>No matching pieces</h2>
            <p className={styles.emptyCopy}>No matching Itelier Noir pieces found.</p>
          </div>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {results.map((product, index) => (
            <ProductCard product={product} index={index} key={product.id} />
          ))}
        </div>
      )}
    </section>
  );
}
