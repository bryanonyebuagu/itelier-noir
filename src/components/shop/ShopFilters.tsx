"use client";

import { X } from "lucide-react";
import styles from "./ShopCategory.module.css";
import type { AvailabilityValue, ShopColor, ShopFiltersState } from "./types";

interface ShopFiltersProps {
  filters: ShopFiltersState;
  sizes: string[];
  colors: ShopColor[];
  productTypes: string[];
  onChange: (filters: ShopFiltersState) => void;
  onClear: () => void;
  onClose?: () => void;
}

const availabilityOptions: Array<{ value: AvailabilityValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In stock" },
  { value: "sold-out", label: "Sold out" },
];

export default function ShopFilters({ filters, sizes, colors, productTypes, onChange, onClear, onClose }: ShopFiltersProps) {
  const updateFilter = (patch: Partial<ShopFiltersState>) => {
    onChange({ ...filters, ...((patch.productType !== undefined || patch.ageGroup !== undefined) ? {size: "", color: ""} : {}), ...patch });
  };

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <h2 className={styles.filterTitle}>Refine</h2>
        <button className={styles.filterCloseButton} onClick={onClose} aria-label="Close filters">
          <X size={17} />
        </button>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Size</span>
        <div className={styles.sizeGrid}>
          {sizes.map((size) => (
            <button
              className={`${styles.sizeButton} ${filters.size === size ? styles.activeOption : ""}`}
              key={size}
              onClick={() => updateFilter({ size: filters.size === size ? "" : size })}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Product type</span>
        <div className={styles.availabilityGrid}>
          {productTypes.map((type) => (
            <button
              className={`${styles.availabilityButton} ${filters.productType === type ? styles.activeOption : ""}`}
              key={type}
              onClick={() => updateFilter({ productType: filters.productType === type ? "" : type })}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Age group</span>
        <div className={styles.availabilityGrid}>
          {["Adults", "Children"].map((ageGroup) => (
            <button
              className={`${styles.availabilityButton} ${filters.ageGroup === ageGroup ? styles.activeOption : ""}`}
              key={ageGroup}
              onClick={() => updateFilter({ ageGroup: filters.ageGroup === ageGroup ? "" : ageGroup })}
            >
              {ageGroup}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Color</span>
        <div className={styles.colorGrid}>
          {colors.map((color) => (
            <button
              className={`${styles.colorButton} ${filters.color === color.name ? styles.activeColor : ""}`}
              key={color.name}
              onClick={() => updateFilter({ color: filters.color === color.name ? "" : color.name })}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Filter by ${color.name}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Price range</span>
        <div className={styles.priceGrid}>
          <input
            className={styles.priceInput}
            inputMode="numeric"
            type="number"
            min="0"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(event) => updateFilter({ priceMin: event.target.value })}
            aria-label="Minimum price"
          />
          <input
            className={styles.priceInput}
            inputMode="numeric"
            type="number"
            min="0"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(event) => updateFilter({ priceMax: event.target.value })}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Availability</span>
        <div className={styles.availabilityGrid}>
          {availabilityOptions.map((option) => (
            <button
              className={`${styles.availabilityButton} ${
                filters.availability === option.value ? styles.activeOption : ""
              }`}
              key={option.value}
              onClick={() => updateFilter({ availability: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.clearButton} onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
