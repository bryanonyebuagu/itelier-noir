"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import styles from "./ShopCategory.module.css";
import {
  formatNaira,
  getProductPrice,
  safeJsonParse,
  type ShopColor,
  type ShopProduct,
} from "./types";

interface ProductCardProps {
  product: ShopProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const toggleWishlist = useWishlist((state) => state.toggleWishlist);
  const isInWishlist = useWishlist((state) => state.isInWishlist);

  const images = safeJsonParse<string[]>(product.images, []);
  const colors = safeJsonParse<ShopColor[]>(product.colors, []);
  const sizes = safeJsonParse<string[]>(product.sizes, []);
  const thumbnail = images[0] || "/window.svg";
  const price = getProductPrice(product);
  const hasDiscount = product.salePrice !== null;
  const wishlisted = isInWishlist(product.id);
  const [quickOpen, setQuickOpen] = useState(false);
  const [added,setAdded]=useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "Default");

  const handleQuickAdd = () => {
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      title: product.title,
      price,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      image: thumbnail,
      maxStock: product.stock,
    });
    setQuickOpen(false);
    setAdded(true);
    window.setTimeout(()=>setAdded(false),2000);
  };

  return (
    <article className={`${styles.productCard} ${product.stock <= 0 ? styles.soldOutCard : ""}`} style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}>
      <div className={styles.productMedia}>
        <Link className={styles.productLink} href={`/product/${product.slug}`} aria-label={`View ${product.title}`}>
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 860px) 50vw, 25vw"
            className={styles.productImage}
          />
        </Link>

        {product.badge && <span className={styles.badge}>{product.badge.replace("_", " ")}</span>}

        <button
          className={`${styles.wishlistButton} ${wishlisted ? styles.wishlisted : ""}`}
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              title: product.title,
              price,
              image: thumbnail,
              slug: product.slug,
              stock: product.stock,
              category: product.category,
              sizes,
              colors,
            })
          }
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        >
          <Heart size={16} fill={wishlisted ? "var(--color-primary)" : "transparent"} />
        </button>

        <button
          className={styles.quickAdd}
          onClick={() => setQuickOpen(true)}
          disabled={product.stock <= 0}
          aria-label={product.stock <= 0 ? `${product.title} is sold out` : `Quick add ${product.title}`}
        >
          <ShoppingBag size={15} />
          <span aria-live="polite">{product.stock <= 0 ? "Sold out" : added ? "Added to bag" : "Quick add"}</span>
        </button>

        {quickOpen && product.stock > 0 && (
          <div className={styles.quickAddPanel}>
            <span className={styles.quickAddLabel}>Size</span>
            <div className={styles.quickOptions}>
              {sizes.map((size) => (
                <button
                  className={`${styles.quickOption} ${selectedSize === size ? styles.quickOptionActive : ""}`}
                  key={size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {colors.length > 0 && (
              <>
                <span className={styles.quickAddLabel}>Color</span>
                <div className={styles.quickOptions}>
                  {colors.map((color) => (
                    <button
                      className={`${styles.quickOption} ${styles.quickSwatch} ${selectedColor === color.name ? styles.quickOptionActive : ""}`}
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </>
            )}
            <button className={styles.quickSubmit} onClick={handleQuickAdd}>
              Add to cart
            </button>
          </div>
        )}
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productNameRow}>
          <h2 className={styles.productName}>
            <Link href={`/product/${product.slug}`}>{product.title}</Link>
          </h2>
          <span className={styles.stockSignal}>
            {product.stock <= 0 ? "Sold out" : product.stock <= 3 ? "Low stock" : "In stock"}
          </span>
        </div>

        <div className={styles.priceRow}>
          {product.stock <= 0 ? (
            <span className={styles.unavailablePrice}>Currently unavailable</span>
          ) : (
            <>
              {hasDiscount && <span className={styles.comparePrice}>{formatNaira(product.basePrice)}</span>}
              <span className={`${styles.price} ${hasDiscount ? styles.salePrice : ""}`}>{formatNaira(price)}</span>
            </>
          )}
        </div>

        {colors.length > 0 && (
          <div className={styles.swatches} aria-label="Available colors">
            {colors.slice(0, 4).map((color) => (
              <span
                className={styles.swatch}
                key={color.name}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
