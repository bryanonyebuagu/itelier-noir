"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/store/useCart";
import { useWishlist, type WishlistItem } from "@/store/useWishlist";
import { formatNaira } from "@/components/shop/types";

function getSizes(item: WishlistItem) {
  return item.sizes && item.sizes.length > 0 ? item.sizes : ["S", "M", "L", "XL", "XXL"];
}

function getColors(item: WishlistItem) {
  return item.colors && item.colors.length > 0 ? item.colors : [{ name: "Obsidian Black", hex: "#080808" }];
}

const subscribeToHydration = () => () => {};
export default function FavoritesPage() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const { items: savedItems, removeItem } = useWishlist();
  const items = hydrated ? savedItems : [];
  const addItem = useCart((state) => state.addItem);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sizeById, setSizeById] = useState<Record<string, string>>({});
  const [colorById, setColorById] = useState<Record<string, string>>({});

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.productId)),
    [items, selectedIds]
  );

  const addFavoriteToCart = (item: WishlistItem) => {
    if(item.stock===0) return;
    const sizes = getSizes(item);
    const colors = getColors(item);

    addItem({
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: 1,
      size: sizeById[item.productId] || sizes[0] || "M",
      color: colorById[item.productId] || colors[0]?.name || "Obsidian Black",
      image: item.image,
      maxStock: item.stock ?? 10,
    });
  };

  const toggleSelected = (productId: string) => {
    setSelectedIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--color-background)", padding: "var(--space-xxxl) 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "var(--space-xl)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-lg)", marginBottom: "var(--space-xl)", flexWrap: "wrap" }}>
            <div>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xs)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Private edit</span>
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", textTransform: "uppercase", letterSpacing: 0 }}>Favorites</h1>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>{items.length} saved Itelier Noir pieces</p>
            </div>

            {items.length > 0 && (
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <button className="btn-secondary" onClick={() => selectedItems.forEach(addFavoriteToCart)} disabled={selectedItems.length === 0}>
                  Add Selected
                </button>
                <button className="btn-primary" onClick={() => items.forEach(addFavoriteToCart)}>
                  Add All
                </button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <section style={{ minHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid var(--color-border)", background: "rgba(255,255,255,0.52)" }}>
              <div>
                <Heart size={36} style={{ marginBottom: "var(--space-md)", color: "var(--color-accent)" }} />
                <h2 style={{ fontSize: "var(--font-size-h2)", textTransform: "uppercase" }}>No favorites yet</h2>
                <p style={{ color: "var(--color-text-muted)", margin: "var(--space-sm) auto var(--space-lg)", maxWidth: 420 }}>
                  Tap the heart on a product to save it here. Only the pieces you choose appear in Favorites.
                </p>
                <Link className="btn-primary" href="/shop/men">Browse Men</Link>
              </div>
            </section>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
              {items.map((item) => {
                const sizes = getSizes(item);
                const colors = getColors(item);
                const selected = selectedIds.includes(item.productId);

                return (
                  <article key={item.productId} style={{ display: "grid", gridTemplateColumns: "104px 1fr", gap: "var(--space-md)", border: selected ? "1px solid var(--color-primary)" : "1px solid var(--color-border)", background: "rgba(255,255,255,0.66)", padding: "var(--space-md)", boxShadow: selected ? "0 18px 50px rgba(8,8,8,0.08)" : "none", transition: "var(--transition-smooth)" }}>
                    <Link href={`/product/${item.slug}`} style={{ position: "relative", minHeight: 142, background: "var(--color-skeleton)", overflow: "hidden" }}>
                      <Image src={item.image} alt={item.title} fill sizes="104px" style={{ objectFit: "cover" }} />
                    </Link>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-sm)" }}>
                        <div>
                          <h2 style={{ fontSize: "var(--font-size-base)", textTransform: "uppercase", letterSpacing: 0, lineHeight: 1.1 }}>
                            <Link href={`/product/${item.slug}`}>{item.title}</Link>
                          </h2>
                          <span style={{ display: "block", color: item.stock === 0 ? "var(--color-error)" : "var(--color-success)", fontSize: "var(--font-size-xs)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>
                            {item.stock === 0 ? "Out of stock" : item.stock && item.stock <= 3 ? `Only ${item.stock} left` : "In stock"}
                          </span>
                        </div>
                        <button onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.title}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <strong style={{ display: "block", marginTop: "var(--space-xs)" }}>{formatNaira(item.price)}</strong>

                      <div style={{ display: "flex", gap: 6, marginTop: "var(--space-sm)", flexWrap: "wrap" }}>
                        {sizes.map((size) => (
                          <button key={size} onClick={() => setSizeById((current) => ({ ...current, [item.productId]: size }))} style={{ minWidth: 34, padding: "0 8px", height: 32, border: sizeById[item.productId] === size ? "1px solid var(--color-primary)" : "1px solid var(--color-border)", background: sizeById[item.productId] === size ? "var(--color-primary)" : "transparent", color: sizeById[item.productId] === size ? "var(--color-background)" : "var(--color-primary)", fontSize: "11px", fontWeight: 700 }}>
                            {size}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: "var(--space-sm)", flexWrap: "wrap" }}>
                        {colors.map((color) => (
                          <button key={color.name} onClick={() => setColorById((current) => ({ ...current, [item.productId]: color.name }))} style={{ width: 24, height: 24, borderRadius: "999px", background: color.hex, border: colorById[item.productId] === color.name ? "2px solid var(--color-primary)" : "1px solid var(--color-border)" }} aria-label={color.name} />
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-xs)", marginTop: "var(--space-md)" }}>
                        <button className="btn-secondary" onClick={() => toggleSelected(item.productId)} style={{ padding: "8px 10px", fontSize: "10px", flex: 1 }}>
                          {selected ? "Selected" : "Select"}
                        </button>
                        <button className="btn-primary" onClick={() => addFavoriteToCart(item)} disabled={item.stock === 0} style={{ padding: "8px 10px", fontSize: "10px", flex: 1, gap: 6 }}>
                          <ShoppingBag size={13} />
                          Add One
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
