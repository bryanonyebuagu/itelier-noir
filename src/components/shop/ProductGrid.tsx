"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";
import ShopFilters from "./ShopFilters";
import ShopSearch from "./ShopSearch";
import SortDropdown from "./SortDropdown";
import styles from "./ShopCategory.module.css";
import {
    getProductPrice,
    safeJsonParse,
    type ShopCategory,
    type ShopColor,
    type ShopFiltersState,
    type ShopProduct,
    type SortValue,
} from "./types";

interface ProductGridProps {
    category: ShopCategory;
}

const emptyFilters: ShopFiltersState = {
    size: "",
    color: "",
    priceMin: "",
    priceMax: "",
    availability: "all",
    productType: "",
    gender: "",
};

const categoryLabel: Record<ShopCategory, string> = {
    men: "Men",
    women: "Women",
    sale: "Sale",
};

function buildProductUrl(
    category: ShopCategory,
    filters: ShopFiltersState,
    sort: SortValue,
) {
    const params = new URLSearchParams({ sort });

    if (category !== "sale") {
        params.set("category", category.toUpperCase());
    } else {
        params.set("badge", "SALE");
    }

    if (filters.size) params.set("size", filters.size);
    if (filters.color) params.set("color", filters.color);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.productType) params.set("productType",filters.productType);

    return `/api/products?${params.toString()}`;
}

function sortSizes(sizes: string[]) {
    const order = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
    return [...sizes].sort((a, b) => {
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);

        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });
}

export default function ProductGrid({ category }: ProductGridProps) {
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [allProducts, setAllProducts] = useState<ShopProduct[]>([]);
    const [filters, setFilters] = useState<ShopFiltersState>(emptyFilters);
    const [sort, setSort] = useState<SortValue>("newest");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const loadProducts = useCallback(
        async (
            nextFilters: ShopFiltersState,
            nextSort: SortValue,
            signal?: AbortSignal,
        ) => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    buildProductUrl(category, nextFilters, nextSort),
                    { signal },
                );
                if (!response.ok) throw new Error("Unable to load products");

                const data = (await response.json()) as { products?: ShopProduct[] };

                const safeProducts = data.products || [];

                setProducts(safeProducts);
            } catch (loadError) {
                if (
                    loadError instanceof DOMException &&
                    loadError.name === "AbortError"
                )
                    return;

                setError("The collection could not be loaded. Please try again.");
            } finally {
                if (!signal?.aborted) setLoading(false);
            }
        },
        [category],
    );

    useEffect(() => {
        const controller = new AbortController();

        async function loadCategory() {
            try {
                const params =
                    category === "sale"
                        ? "badge=SALE&sort=newest"
                        : `category=${category.toUpperCase()}&sort=newest`;

                const response = await fetch(`/api/products?${params}`, {
                    signal: controller.signal,
                });

                if (!response.ok)
                    throw new Error("Unable to load collection options");

                const data = (await response.json()) as { products?: ShopProduct[] };

                setAllProducts(data.products || []);
            } catch (loadError) {
                if (
                    loadError instanceof DOMException &&
                    loadError.name === "AbortError"
                )
                    return;

                setAllProducts([]);
            }
        }

        loadCategory();

        return () => controller.abort();
    }, [category]);

    useEffect(() => {
        const controller = new AbortController();

        const timeoutId = window.setTimeout(() => {
            loadProducts(filters, sort, controller.signal);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [filters, loadProducts, sort]);

    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [drawerOpen]);

    const filterOptions = useMemo(() => {
        const sizes = new Set<string>();
        const colorMap = new Map<string, ShopColor>();

        allProducts.forEach((product) => {
            safeJsonParse<string[]>(product.sizes, []).forEach((size) =>
                sizes.add(size),
            );

            safeJsonParse<ShopColor[]>(product.colors, []).forEach((color) => {
                if (!colorMap.has(color.name)) colorMap.set(color.name, color);
            });
        });

        return {
            sizes: sortSizes(Array.from(sizes)),
            colors: Array.from(colorMap.values()),
        };
    }, [allProducts]);

    const visibleProducts = useMemo(() => {
        const query = debouncedSearch.toLowerCase();

        const filtered = products.filter((product) => {
            if (filters.availability === "in-stock") return product.stock > 0;
            // availability can be "sold-out" in the filters type
            if (filters.availability === "sold-out") return product.stock <= 0;
            return true;
        });

        const searchFiltered = !query
            ? filtered
            : filtered.filter((product) => {
                  const colors = safeJsonParse<ShopColor[]>(product.colors, [])
                      .map((c) => c.name)
                      .join(" ");

                  return (
                      product.title.toLowerCase().includes(query) ||
                      product.description.toLowerCase().includes(query) ||
                      product.category.toLowerCase().includes(query) ||
                      colors.toLowerCase().includes(query) ||
                      product.productType?.toLowerCase().includes(query) ||
                      product.tags?.join(" ").toLowerCase().includes(query) ||
                      product.material?.toLowerCase().includes(query)
                  );
              });

        return [...searchFiltered].sort((a, b) => {
            if (sort === "price-asc") return getProductPrice(a) - getProductPrice(b);
            if (sort === "price-desc")
                return getProductPrice(b) - getProductPrice(a);
            if (sort === "bestseller") return Number(b.badge === "BEST_SELLER")-Number(a.badge === "BEST_SELLER");

            return (
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
            );
        });
    }, [debouncedSearch, filters, products, sort]);

    const suggestions = useMemo(() => {
        const query = searchInput.trim().toLowerCase();
        if (!query) return [];

        return allProducts
            .filter((product) => product.title.toLowerCase().includes(query))
            .slice(0, 5);
    }, [allProducts, searchInput]);

    const clearAll = () => {
        setFilters(emptyFilters);
        setSearchInput("");
        setDebouncedSearch("");
        setSort("newest");
    };

    return (
        <section className={styles.shell}>
            <div className={styles.catalogHeader}>
                <div>
                    <h2 className={styles.catalogTitle}>
                        {categoryLabel[category]} Collection
                    </h2>
                    <p className={styles.catalogSummary}>
                        {loading
                            ? "Loading..."
                            : `${visibleProducts.length} pieces available`}
                    </p>
                </div>

                <div className={styles.toolbar}>
                    <button onClick={() => setDrawerOpen(true)}>
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>

                    <SortDropdown value={sort} onChange={setSort} />
                </div>
            </div>

            <div className={styles.contentGrid}>
                <aside className={styles.sidebar}>
                    <ShopFilters
                        filters={filters}
                        sizes={filterOptions.sizes}
                        colors={filterOptions.colors}
                        onChange={setFilters}
                        onClear={clearAll}
                    />
                </aside>

                <div className={styles.resultsColumn}>
                    <ShopSearch
                        value={searchInput}
                        suggestions={suggestions}
                        onChange={setSearchInput}
                        onDebouncedChange={setDebouncedSearch}
                    />

                    {error ? (
                        <p>{error}</p>
                    ) : loading ? (
                        <p>Loading products...</p>
                    ) : (
                        <div className={styles.productGrid}>
                            {visibleProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
