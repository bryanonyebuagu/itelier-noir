"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Package, Truck, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const email = searchParams.get("email");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderNumber || !email) {
      setError("Missing validation parameters. Please verify your receipt link.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Could not retrieve order confirmation details.");
        } else {
          setOrder(data.order);
        }
      } catch {
        setError("Network error fetching your order confirmation.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, email]);

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main style={{ backgroundColor: "var(--color-background)", color: "var(--color-primary)", minHeight: "80vh", padding: "var(--space-xxl) 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          
          {loading && (
            <div style={{ textAlign: "center", padding: "var(--space-xxl) 0" }}>
              <div style={{ display: "inline-block", width: "40px", height: "40px", border: "2px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "luxury-skeleton-shimmer 1s infinite linear" }} />
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginTop: "var(--space-md)", letterSpacing: "0.1em" }}>Loading your silhouette...</h2>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "var(--space-xxl) 0" }}>
              <AlertCircle size={48} style={{ color: "var(--color-error)", marginBottom: "var(--space-md)" }} />
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-xs)" }}>Access Restriction</h1>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-lg)" }}>{error}</p>
              <Link href="/shop" className="btn-primary">Return to Boutique</Link>
            </div>
          )}

          {order && (
            <div>
              {/* Header Status Block */}
              <div style={{ textAlign: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
                {order.paymentGateway === "CRYPTO" && order.status === "PENDING_CRYPTO_PAYMENT" ? (
                  <Package size={48} style={{ color: "var(--color-accent)", marginBottom: "var(--space-md)", display: "inline-block" }} />
                ) : (
                  <CheckCircle2 size={48} style={{ color: "var(--color-success)", marginBottom: "var(--space-md)", display: "inline-block" }} />
                )}
                
                <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h1)", textTransform: "uppercase", marginBottom: "var(--space-xs)", letterSpacing: "0.02em" }}>
                  {order.paymentGateway === "CRYPTO" && order.status === "PENDING_CRYPTO_PAYMENT" 
                    ? "Order Held - Pending Crypto" 
                    : "Payment Confirmed"}
                </h1>
                
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
                  Thank you for shopping with Itelier Noir. Your receipt and invoice details are compiled below.
                </p>

                <div style={{ display: "inline-flex", gap: "var(--space-md)", marginTop: "var(--space-lg)", backgroundColor: "rgba(0,0,0,0.01)", border: "1px solid var(--color-border)", padding: "var(--space-sm) var(--space-lg)" }}>
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)", display: "block" }}>Order Reference</span>
                    <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>{order.orderNumber}</span>
                  </div>
                  <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: "var(--space-md)" }}>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)", display: "block" }}>Payment Channel</span>
                    <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)", textTransform: "uppercase" }}>{order.paymentGateway}</span>
                  </div>
                </div>
              </div>

              {/* Grid content */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
                
                {/* Left Side: Order Items */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-md)", letterSpacing: "0.05em" }}>Your Garments</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                    {order.items.map((item: any) => (
                      <div key={item.id} style={{ display: "flex", gap: "var(--space-sm)", borderBottom: "1px solid rgba(0,0,0,0.02)", paddingBottom: "var(--space-sm)" }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: "50px", height: "65px", objectFit: "cover", backgroundColor: "var(--color-skeleton)" }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-sm)", textTransform: "uppercase", fontWeight: 500 }}>{item.title}</h4>
                          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                          </p>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)", marginTop: "var(--space-md)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
                      <span>Subtotal</span>
                      <span>₦{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
                      <span>Shipping ({order.shippingMethod.toUpperCase()})</span>
                      <span>₦{order.shippingCost.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-sm)", color: "var(--color-success)" }}>
                        <span>Discount Applied</span>
                        <span>- ₦{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "var(--font-size-base)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xs)", marginTop: "var(--space-xs)" }}>
                      <span>TOTAL PAID</span>
                      <span>₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Shipping address & Delivery options */}
                <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: "var(--space-xl)" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-md)", letterSpacing: "0.05em" }}>Delivery Address</h3>
                  
                  {(() => {
                    let addr: any = {};
                    try {
                      addr = JSON.parse(order.shippingAddress);
                    } catch {}
                    return (
                      <div style={{ fontSize: "var(--font-size-sm)", lineHeight: 1.6, marginBottom: "var(--space-lg)" }}>
                        <div style={{ fontWeight: 600 }}>{addr.fullName}</div>
                        <div>{addr.streetAddress} {addr.apartment}</div>
                        <div>{addr.city}, {addr.state}</div>
                        <div>{addr.postalCode}</div>
                        <div>{addr.country}</div>
                        <div style={{ marginTop: "var(--space-xs)", color: "var(--color-text-muted)" }}>Phone: {order.phone}</div>
                      </div>
                    );
                  })()}

                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-xs)", letterSpacing: "0.05em" }}>Logistic Updates</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", backgroundColor: "rgba(0,0,0,0.01)", border: "1px solid var(--color-border)", padding: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                    <Truck size={18} style={{ color: "var(--color-accent)" }} />
                    <div style={{ fontSize: "var(--font-size-xs)" }}>
                      <span style={{ fontWeight: 600, display: "block", textTransform: "uppercase" }}>Status: {order.status.replace(/_/g, " ")}</span>
                      {order.paymentGateway === "CRYPTO" && order.status === "PENDING_CRYPTO_PAYMENT" 
                        ? "Waiting for funds confirmation on the blockchain ledger."
                        : "Preparing to hand off package to standard carrier in Lagos."}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                    <Link href={`/tracking?orderNumber=${order.orderNumber}&email=${encodeURIComponent(order.email)}`} className="btn-primary" style={{ width: "100%", padding: "var(--space-md) 0" }}>
                      Track Order Timeline <ArrowRight size={14} style={{ marginLeft: "var(--space-xs)" }} />
                    </Link>
                    <Link href="/shop" className="btn-secondary" style={{ width: "100%", padding: "var(--space-md) 0" }}>
                      Continue Shopping
                    </Link>
                  </div>
                </div>

              </div>

              {/* Security trust badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xs)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)", color: "var(--color-text-muted)", fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                <ShieldCheck size={14} />
                <span>Authorized payment via secure SSL nodes</span>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ConfirmationPage(){return <Suspense fallback={<p>Loading your receipt…</p>}><OrderConfirmationPage/></Suspense>;}

