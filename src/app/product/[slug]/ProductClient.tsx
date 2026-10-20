"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Minus, PackageCheck, Plus, RotateCcw, Shield, ShoppingBag, Truck, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import { formatNaira, getProductPrice, safeJsonParse, type ShopColor, type ShopProduct } from "@/components/shop/types";
import styles from "./ProductDetail.module.css";

interface ProductClientProps {
  product: ShopProduct & { reviews?: unknown[] };
  relatedProducts: ShopProduct[];
  averageRating: number;
  totalReviews: number;
}

const allSizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductClient({ product, relatedProducts, averageRating, totalReviews }: ProductClientProps) {
  const addItem = useCart((state) => state.addItem);
  const toggleWishlist = useWishlist((state) => state.toggleWishlist);
  const isInWishlist = useWishlist((state) => state.isInWishlist);
  const images = safeJsonParse<string[]>(product.images, []);
  const sizes = safeJsonParse<string[]>(product.sizes, []);
  const colors = safeJsonParse<ShopColor[]>(product.colors, []);
  const price = getProductPrice(product);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [showSticky, setShowSticky] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);

  const inStock = product.stock > 0;
  const hasDiscount = product.salePrice !== null;
  const wishlisted = isInWishlist(product.id);

  useEffect(() => {
    const onScroll = () => {
      if (!buyRef.current) return;
      setShowSticky(buyRef.current.getBoundingClientRect().bottom < 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToCart = () => {
    if (!inStock) return;
    if (!selectedSize) {
      setError("Select a size before adding this piece to your bag.");
      return;
    }

    addItem({
      productId: product.id,
      title: product.title,
      price,
      quantity,
      size: selectedSize,
      color: selectedColor || colors[0]?.name || "Obsidian Black",
      image: images[0] || "/window.svg",
      maxStock: product.stock,
    });
    setError("");
  };

  const handleColor = (color: ShopColor, index: number) => {
    setSelectedColor(color.name);
  };

  const handleTouchEnd = (clientX: number) => {
    const delta = touchStart.current - clientX;
    if (Math.abs(delta) < 40) return;
    setActiveImage((current) => {
      if (delta > 0) return Math.min(images.length - 1, current + 1);
      return Math.max(0, current - 1);
    });
  };

  return (
    <div className={styles.productPage}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href={`/shop/${product.category.toLowerCase()}`}>{product.category}</Link> / {product.title}
        </div>

        <section className={styles.layout}>
          <div className={styles.gallery}>
            <div className={styles.thumbs} aria-label="Product thumbnails">
              {images.map((image, index) => (
                <button
                  className={`${styles.thumb} ${activeImage === index ? styles.thumbActive : ""}`}
                  key={image}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image src={image} alt={product.title} fill sizes="76px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>

            <div
              className={styles.heroImage}
              onTouchStart={(event) => {
                touchStart.current = event.touches[0]?.clientX || 0;
              }}
              onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX || 0)}
            >
              <Image
                src={images[activeImage] || "/window.svg"}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 58vw"
                className={styles.heroAsset}
              />
            </div>
          </div>

          <aside className={styles.panel} ref={buyRef}>
            {product.badge && <span className={styles.badge}>{product.badge.replace("_", " ")}</span>}
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.priceRow}>
              {!inStock ? (
                <span className={styles.unavailable}>Currently unavailable</span>
              ) : (
                <>
                  {hasDiscount && <span className={styles.comparePrice}>{formatNaira(product.basePrice)}</span>}
                  <span className={`${styles.price} ${hasDiscount ? styles.salePrice : ""}`}>{formatNaira(price)}</span>
                </>
              )}
            </div>

            <div className={`${styles.availability} ${product.stock <= 3 ? styles.warning : styles.success}`}>
              {product.stock <= 0 ? <XCircle size={16} /> : product.stock <= 3 ? <PackageCheck size={16} /> : <Check size={16} />}
              {product.stock <= 0 ? "Out of stock" : product.stock <= 3 ? `Only ${product.stock} left` : `In stock - ${product.stock} available`}
            </div>

            <div className={styles.section}>
              <span className={styles.label}>Size</span>
              <div className={styles.options}>
                {allSizes.map((size) => {
                  const available = sizes.includes(size) && inStock;
                  return (
                    <button
                      className={`${styles.sizeButton} ${selectedSize === size ? styles.activeSize : ""}`}
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!available}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {colors.length > 0 && (
              <div className={styles.section}>
                <span className={styles.label}>Color: {selectedColor}</span>
                <div className={styles.options}>
                  {colors.map((color, index) => (
                    <button
                      className={`${styles.swatch} ${selectedColor === color.name ? styles.activeSwatch : ""}`}
                      key={color.name}
                      onClick={() => handleColor(color, index)}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <div className={styles.quantity} aria-label="Quantity">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <strong>{quantity}</strong>
                <button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>

              <button className="btn-primary" onClick={addToCart} disabled={!inStock}>
                <ShoppingBag size={15} />
                Add to Cart
              </button>

              <button
                className={styles.iconButton}
                onClick={() =>
                  toggleWishlist({
                    productId: product.id,
                    title: product.title,
                    price,
                    image: images[0] || "/window.svg",
                    slug: product.slug,
                    stock: product.stock,
                    category: product.category,
                    sizes,
                    colors,
                  })
                }
                aria-label={wishlisted ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={18} fill={wishlisted ? "var(--color-primary)" : "transparent"} />
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.trust}>
              <span className={styles.trustItem}><Shield size={15} /> Secure payment</span>
              <span className={styles.trustItem}><Truck size={15} /> Express dispatch</span>
              <span className={styles.trustItem}><RotateCcw size={15} /> Easy returns</span>
            </div>

            <div className={styles.section}>
              <span className={styles.label}>Atelier notes</span>
              <p className={styles.description}>
                {product.material || "Premium atelier fabric"}. {product.care || "Dry clean recommended."}
              </p>
              <p className={styles.description}>
                {totalReviews > 0 ? `${averageRating.toFixed(1)} average from ${totalReviews} client reflections.` : "No client reflections yet."}
              </p>
            </div>
          </aside>
        </section>

        {relatedProducts.length > 0 && (
          <section className={styles.related}>
            <h2 style={{ fontSize: "var(--font-size-h2)", textTransform: "uppercase", letterSpacing: 0 }}>Complete the look</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.slice(0, 4).map((item) => {
                const relatedImages = safeJsonParse<string[]>(item.images, []);
                return (
                  <article key={item.id}>
                    <Link className={styles.relatedImage} href={`/product/${item.slug}`}>
                      <Image src={relatedImages[0] || "/window.svg"} alt={item.title} fill sizes="25vw" style={{ objectFit: "cover" }} />
                    </Link>
                    <h3 style={{ marginTop: "var(--space-sm)", fontSize: "var(--font-size-sm)", textTransform: "uppercase", letterSpacing: 0 }}>
                      <Link href={`/product/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 700 }}>{formatNaira(getProductPrice(item))}</span>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {showSticky && (
        <div className={styles.stickyBar}>
          <div>
            <strong style={{ display: "block", fontSize: "var(--font-size-xs)", textTransform: "uppercase" }}>{product.title}</strong>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>{inStock ? formatNaira(price) : "Unavailable"}</span>
          </div>
          <button className="btn-primary" onClick={addToCart} disabled={!inStock} style={{ padding: "10px 16px" }}>
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
