"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Truck, Calendar, Sparkles, CheckCircle2, AlertCircle, Clock, Gift } from "lucide-react";

function TrackingPage() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";
  const initialEmail = searchParams.get("email") || "";

  // Form Fields
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);

  // States
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber && initialEmail) {
      handleTrack(null, initialOrderNumber, initialEmail);
    }
  }, [initialOrderNumber, initialEmail]);

  const handleTrack = async (e: React.FormEvent | null, searchNum?: string, searchEmail?: string) => {
    if (e) e.preventDefault();
    
    const num = searchNum || orderNumber;
    const mail = searchEmail || email;

    if (!num || !mail) {
      setError("Please complete all tracking credentials.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/${num}?email=${encodeURIComponent(mail)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No matching order registry found.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Connection error querying the tracking ledger.");
    } finally {
      setLoading(false);
    }
  };

  // Define steps for the visual timeline
  const getTimelineSteps = (status: string, gateway: string) => {
    const steps = [
      {
        key: "PENDING",
        label: gateway === "CRYPTO" ? "Pending Crypto Payment" : "Payment Pending",
        desc: "Order is registered and awaiting payment authorization.",
      },
      {
        key: "PROCESSING",
        label: "Silhouettes Packing",
        desc: "Payment received. Our Lagos artisans are tailoring and packaging your silhouettes.",
      },
      {
        key: "SHIPPED",
        label: "Dispatched to Carrier",
        desc: "Package handed off to courier. Transit tracking activated.",
      },
      {
        key: "OUT_FOR_DELIVERY",
        label: "Out for Delivery",
        desc: "Carrier has loaded the garments for same-day local dropoff.",
      },
      {
        key: "DELIVERED",
        label: "Delivered",
        desc: "Silhouettes dropped off at shipping address.",
      },
      {
        key: "COMPLETED",
        label: "Completed",
        desc: "Customer has verified delivery. Sartorial cycle completed.",
      },
    ];

    // Determine active index
    let activeIndex = 0;
    if (status === "PROCESSING") activeIndex = 1;
    else if (status === "SHIPPED") activeIndex = 2;
    else if (status === "OUT_FOR_DELIVERY") activeIndex = 3;
    else if (status === "DELIVERED") activeIndex = 4;
    else if (status === "COMPLETED") activeIndex = 5;

    return { steps, activeIndex };
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main style={{ backgroundColor: "var(--color-background)", color: "var(--color-primary)", minHeight: "85vh", padding: "var(--space-xxl) 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "var(--space-xxl)" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h1)", textTransform: "uppercase", letterSpacing: "0.02em" }}>Editorial Tracking</h1>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>Enter your receipt coordinates to track your bespoke shipping timeline.</p>
          </div>

          {/* Tracking Search Form */}
          <form onSubmit={(e) => handleTrack(e)} style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 0.8fr", gap: "var(--space-md)", alignItems: "end", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-xl)", marginBottom: "var(--space-xxl)" }}>
            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase().trim())}
                placeholder="e.g. AN-260521-3942"
                className="luxury-input"
                required
              />
            </div>
            
            <div className="luxury-input-group" style={{ marginBottom: 0 }}>
              <label className="luxury-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                placeholder="e.g. adebayo@luxury.com"
                className="luxury-input"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "10px 0" }}>
              {loading ? "SEARCHING..." : "LOCATE PACKAGE"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", backgroundColor: "rgba(169,68,66,0.06)", border: "1px solid var(--color-error)", padding: "var(--space-md)", color: "var(--color-error)", margin: "var(--space-lg) 0", fontSize: "var(--font-size-sm)" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Shimmer */}
          {loading && (
            <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
              <div style={{ display: "inline-block", width: "35px", height: "35px", border: "2px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "luxury-skeleton-shimmer 1s infinite linear" }} />
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-sm)", textTransform: "uppercase" }}>Connecting nodes...</div>
            </div>
          )}

          {/* Timeline Output */}
          {!loading && order && (
            <div>
              {/* Receipt Summary Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)", border: "1px solid var(--color-border)", padding: "var(--space-xl)", marginBottom: "var(--space-xxl)" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-sm)" }}>Receipt Details</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", fontSize: "var(--font-size-sm)" }}>
                    <div><span style={{ color: "var(--color-text-muted)" }}>Order Reference:</span> <strong style={{ textTransform: "uppercase" }}>{order.orderNumber}</strong></div>
                    <div><span style={{ color: "var(--color-text-muted)" }}>Payment Method:</span> <strong style={{ textTransform: "uppercase" }}>{order.paymentGateway} ({order.paymentStatus})</strong></div>
                    <div><span style={{ color: "var(--color-text-muted)" }}>Carrier Speed:</span> <strong>{order.shippingMethod.replace(/_/g, " ")}</strong></div>
                    {order.trackingNumber && (
                      <div style={{ marginTop: "var(--space-xs)" }}><span style={{ color: "var(--color-accent)", fontWeight: 600 }}>Tracking Code:</span> <strong style={{ fontFamily: "monospace", fontSize: "12px", border: "1px dashed var(--color-accent)", padding: "2px 6px", backgroundColor: "rgba(197,168,128,0.04)" }}>{order.trackingNumber}</strong></div>
                    )}
                  </div>
                </div>

                <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: "var(--space-xl)" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-sm)" }}>Shipping Destination</h3>
                  {(() => {
                    let addr: any = {};
                    try {
                      addr = JSON.parse(order.shippingAddress);
                    } catch {}
                    return (
                      <div style={{ fontSize: "var(--font-size-xs)", lineHeight: 1.5, color: "var(--color-text)" }}>
                        <strong>{addr.fullName}</strong><br />
                        {addr.streetAddress} {addr.apartment}<br />
                        {addr.city}, {addr.state}<br />
                        {addr.postalCode}, {addr.country}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Visual Interactive Timeline */}
              <div style={{ paddingLeft: "20px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-xl)", letterSpacing: "0.05em" }}>Logistics Timeline</h3>
                
                {(() => {
                  const { steps, activeIndex } = getTimelineSteps(order.status, order.paymentGateway);
                  return (
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
                      {/* Vertical connector line */}
                      <div
                        style={{
                          position: "absolute",
                          left: "8px",
                          top: "5px",
                          bottom: "5px",
                          width: "2px",
                          backgroundColor: "var(--color-border)",
                          zIndex: 1
                        }}
                      />
                      
                      {/* Animated Active timeline fill */}
                      <div
                        style={{
                          position: "absolute",
                          left: "8px",
                          top: "5px",
                          height: `${(activeIndex / (steps.length - 1)) * 100}%`,
                          width: "2px",
                          backgroundColor: "var(--color-primary)",
                          zIndex: 2,
                          transition: "all 0.8s ease-in-out"
                        }}
                      />

                      {steps.map((st, idx) => {
                        const isCompleted = idx <= activeIndex;
                        const isCurrent = idx === activeIndex;
                        return (
                          <div key={st.key} style={{ display: "flex", gap: "var(--space-lg)", zIndex: 3, position: "relative" }}>
                            {/* Bullet indicator */}
                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                backgroundColor: isCompleted ? "var(--color-primary)" : "var(--color-background)",
                                border: isCompleted ? "none" : "2px solid var(--color-border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "var(--transition-smooth)",
                                boxShadow: isCurrent ? "0 0 0 4px rgba(0,0,0,0.05)" : "none"
                              }}
                            >
                              {isCompleted && <div style={{ width: "6px", height: "6px", backgroundColor: "var(--color-background)", borderRadius: "50%" }} />}
                            </div>

                            {/* Text content */}
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "var(--font-size-base)",
                                fontWeight: isCompleted ? 600 : 400,
                                color: isCompleted ? "var(--color-primary)" : "var(--color-text-muted)",
                                textTransform: "uppercase"
                              }}>
                                {st.label}
                              </h4>
                              <p style={{
                                fontSize: "var(--font-size-xs)",
                                color: isCompleted ? "var(--color-text)" : "var(--color-text-muted)",
                                marginTop: "2px",
                                lineHeight: 1.4
                              }}>
                                {st.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Fallback empty view */}
          {!hasSearched && !order && (
            <div style={{ textAlign: "center", padding: "var(--space-xl) 0", color: "var(--color-text-muted)", border: "1px dashed var(--color-border)" }}>
              <Truck size={36} style={{ color: "var(--color-accent)", marginBottom: "var(--space-xs)", display: "inline-block" }} />
              <p style={{ fontSize: "var(--font-size-sm)" }}>Draft records are retrieved instantly from high-speed Supabase servers.</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function OrderTracking(){return <Suspense fallback={<p>Loading order tracking…</p>}><TrackingPage/></Suspense>;}

