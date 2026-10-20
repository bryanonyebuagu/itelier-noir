"use client";

import { ChevronDown } from "lucide-react";
import styles from "./ShopCategory.module.css";
import type { SortValue } from "./types";

interface SortDropdownProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <label className={styles.sortWrap}>
      <span className="luxury-label" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        Sort products
      </span>
      <select
        className={styles.sortSelect}
        value={value}
        onChange={(event) => onChange(event.target.value as SortValue)}
        aria-label="Sort products"
      >
        <option value="newest">Newest</option>
        <option value="bestseller">Best selling</option>
        <option value="price-asc">Price low/high</option>
        <option value="price-desc">Price high/low</option>
      </select>
      <ChevronDown className={styles.selectIcon} size={15} aria-hidden="true" />
    </label>
  );
}
