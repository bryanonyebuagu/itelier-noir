"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/store/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // 1. Fetch cross-sell recommendations (bestselling items)
  useEffect(() => {
    const fetchCrossSells = async () => {
      try {
        const res = await fetch("/api/products?badge=BEST_SELLER");
        if (res.ok) {
          const data = await res.json();
          // Filter out items already in the cart
          const filtered = data.products.filter(
            (p: any) => !items.some((item) => item.productId === p.id)
          );
          setRecommendations(filtered.slice(0, 2));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isOpen) {
      fetchCrossSells();
    }
  }, [isOpen, items]);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await res.json();

      if (res.ok) {
        applyCoupon(data.coupon);
        setCouponCode("");
      } else {
        setCouponError(data.error || "Invalid coupon");
      }
    } catch (err) {
      setCouponError("Verification failed. Try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "flex-end",
        transition: "var(--transition-smooth)",
      }}
      onClick={onClose}
    >
      {/* Drawer Panel */}
      <div
        style={{
          width: "100%",
          maxWidth: "var(--sidebar-width)",
          height: "100%",
          backgroundColor: "var(--color-background)",
          boxShadow: "-10px 0 35px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          padding: "var(--space-xl)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click closing
      >
        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <h2 style={{ textTransform: "uppercase", fontSize: "var(--font-size-lg)", letterSpacing: "0.08em" }}>
            Shopping Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
          <button onClick={onClose} style={{ color: "var(--color-primary)" }}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "var(--space-md)" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h3)", color: "var(--color-text-muted)" }}>
              Your bag is empty
            </p>
            <button onClick={onClose} className="btn-primary" style={{ width: "100%" }}>
              Continue Exploring
            </button>
          </div>
        ) : (
          /* Items List */
          <>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "var(--space-md)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-md)" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "80px", height: "100px", objectFit: "cover", backgroundColor: "var(--color-skeleton)" }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ textTransform: "uppercase", fontSize: "var(--font-size-sm)", fontWeight: "var(--weight-medium)" }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
                        Size: {item.size} · Color: {item.color}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* Quantity Controls */}
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-border)", padding: "2px 8px", gap: "10px" }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ fontSize: "var(--font-size-xs)" }}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: "var(--font-size-sm)" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ fontSize: "var(--font-size-xs)" }}>
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                        <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--weight-semibold)" }}>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button onClick={() => removeItem(item.id)} style={{ color: "var(--color-text-muted)" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Editorial Cross-Sell Recommendations */}
              {recommendations.length > 0 && (
                <div style={{ marginTop: "var(--space-lg)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)" }}>
                  <h4 style={{ fontSize: "var(--font-size-xs)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "var(--space-sm)", color: "var(--color-text-muted)" }}>
                    Complete The Look
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                    {recommendations.map((prod: any) => (
                      <Link
                        href={`/product/${prod.slug}`}
                        key={prod.id}
                        onClick={onClose}
                        style={{
                          display: "flex",
                          gap: "var(--space-sm)",
                          alignItems: "center",
                          padding: "8px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid var(--color-border)",
                          transition: "var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                      >
                        <img
                          src={JSON.parse(prod.images)[0]}
                          alt={prod.title}
                          style={{ width: "40px", height: "50px", objectFit: "cover" }}
                        />
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", fontWeight: "var(--weight-medium)" }}>
                            {prod.title}
                          </h5>
                          <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--weight-bold)" }}>
                            ₦{(prod.salePrice || prod.basePrice).toLocaleString()}
                          </span>
                        </div>
                        <ArrowRight size={14} style={{ color: "var(--color-accent)" }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Pricing Calculations */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)", marginTop: "var(--space-md)" }}>
              {/* Coupon Field */}
              {appliedCoupon ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ECEBE8", padding: "8px 12px", marginBottom: "var(--space-sm)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--font-size-xs)", color: "var(--color-primary)" }}>
                    <Tag size={12} /> CODE: <strong>{appliedCoupon.code}</strong> (
                    {appliedCoupon.type === "PERCENTAGE" ? `${appliedCoupon.value}% OFF` : `₦${appliedCoupon.value.toLocaleString()} OFF`}
                    )
                  </span>
                  <button onClick={removeCoupon} style={{ color: "var(--color-error)", fontSize: "var(--font-size-xs)", fontWeight: "var(--weight-semibold)" }}>
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} style={{ display: "flex", gap: "var(--space-xs)", marginBottom: "var(--space-sm)" }}>
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      border: "1px solid var(--color-border)",
                      padding: "8px 12px",
                      fontSize: "var(--font-size-xs)",
                      outline: "none",
                      backgroundColor: "transparent",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="btn-primary"
                    style={{ padding: "8px var(--space-md)" }}
                  >
                    {couponLoading ? "..." : "APPLY"}
                  </button>
                </form>
              )}

              {couponError && (
                <p style={{ color: "var(--color-error)", fontSize: "var(--font-size-xs)", marginBottom: "var(--space-sm)" }}>
                  {couponError}
                </p>
              )}

              {/* Pricing Totals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "var(--font-size-sm)", color: "var(--color-text)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span>₦{getCartSubtotal().toLocaleString()}</span>
                </div>
                {getCartDiscount() > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-error)" }}>
                    <span>Discount</span>
                    <span>- ₦{getCartDiscount().toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-base)", fontWeight: "var(--weight-bold)", borderTop: "1px solid var(--color-border)", paddingTop: "8px", marginTop: "4px" }}>
                  <span>Subtotal Total</span>
                  <span>₦{(getCartSubtotal() - getCartDiscount()).toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link href="/checkout" onClick={onClose} className="btn-primary" style={{ width: "100%", marginTop: "var(--space-md)", gap: "10px" }}>
                Proceed to Checkout
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
