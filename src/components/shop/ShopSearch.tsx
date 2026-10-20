"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./ShopCategory.module.css";
import { formatNaira, getProductPrice, safeJsonParse, type ShopProduct } from "./types";

interface ShopSearchProps {
  value: string;
  suggestions: ShopProduct[];
  onChange: (value: string) => void;
  onDebouncedChange: (value: string) => void;
}

export default function ShopSearch({ value, suggestions, onChange, onDebouncedChange }: ShopSearchProps) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDebouncedChange(value.trim());
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [onDebouncedChange, value]);

  return (
    <div className={styles.searchWrap}>
      <div className={styles.searchField}>
        <Search className={styles.searchIcon} size={17} aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search this collection"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 140)}
          aria-label="Search products in this collection"
        />
        {value && (
          <button className={`${styles.iconButton} ${styles.searchClear}`} onClick={() => onChange("")} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      {focused && value.trim() && (
        <div className={styles.suggestions}>
          {suggestions.length === 0 ? (
            <div className={styles.suggestionItem}>
              <span className={styles.suggestionName}>No matching pieces</span>
            </div>
          ) : (
            suggestions.map((product) => {
              const image = safeJsonParse<string[]>(product.images, [])[0] || "/window.svg";

              return (
                <Link className={styles.suggestionItem} href={`/product/${product.slug}`} key={product.id}>
                  <span className={styles.suggestionImage}>
                    <Image src={image} alt={product.title} fill sizes="54px" style={{ objectFit: "cover" }} />
                  </span>
                  <span>
                    <span className={styles.suggestionName}>{product.title}</span>
                    <span className={styles.suggestionPrice}>{formatNaira(getProductPrice(product))}</span>
                  </span>
                  <ArrowRight className={styles.suggestionArrow} size={16} aria-hidden="true" />
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
