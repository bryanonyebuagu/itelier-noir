"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/store/useWishlist";
import { useCart } from "@/store/useCart";
import { User, LogOut, Package, MapPin, Heart, ArrowRight, Star, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "wishlist">("profile");
  
  // Auth Session States
  const [user, setUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressName, setAddressName] = useState("Home");
  const [addressFullName, setAddressFullName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressApartment, setAddressApartment] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressError, setAddressError] = useState("");

  // Wishlist Zustand
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlist();
  const { addItem: addCartItem } = useCart();

  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");
  const [reviewErrorMsg, setReviewErrorMsg] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          fetchOrders();
          fetchAddresses();
        } else {
          window.location.href = "/account/login";
        }
      } catch {
        window.location.href = "/account/login";
      } finally {
        setLoadingSession(false);
      }
    };
    checkSession();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response=await fetch("/api/account/addresses");
      const data=await response.json();
      if(!response.ok)throw new Error(data.error);
      setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/account/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Confirm Order Delivery (transitions status from DELIVERED -> COMPLETED)
  const handleConfirmDelivery = async (orderId: string, orderItems: any[]) => {
    try {
      const res = await fetch("/api/orders/confirm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (res.ok) {
        // Refresh local orders list
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "COMPLETED" } : o))
        );
        
        // Trigger review prompt modal for the first product in the order
        if (orderItems && orderItems.length > 0) {
          setSelectedProductForReview(orderItems[0]);
          setReviewRating(5);
          setReviewText("");
          setReviewSuccessMsg("");
          setReviewErrorMsg("");
          setShowReviewModal(true);
        }
      } else {
        alert("Could not update order status. Contact concierge.");
      }
    } catch {
      alert("Network issue updating order status.");
    }
  };

  // Submit Review Feedback
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForReview || !reviewText.trim()) return;

    setSubmittingReview(true);
    setReviewSuccessMsg("");
    setReviewErrorMsg("");

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductForReview.productId,
          rating: reviewRating,
          text: reviewText,
          userName: user ? user.name : "Verified Customer",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviewSuccessMsg("Your editorial feedback was drafted. Our curators will publish it shortly.");
        setTimeout(() => {
          setShowReviewModal(false);
          setSelectedProductForReview(null);
        }, 3000);
      } else {
        setReviewErrorMsg(data.error || "Review submission failed.");
      }
    } catch {
      setReviewErrorMsg("Connection error submitting feedback.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Saved Addresses Add Mock
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressFullName || !addressStreet || !addressCity || !addressState || !addressPostalCode) {
      setAddressError("Please complete all address fields.");
      return;
    }

    const newAddr = {
      id: `addr-${Date.now()}`,
      name: addressName,
      fullName: addressFullName,
      phone: addressPhone,
      streetAddress: addressStreet,
      apartment: addressApartment,
      city: addressCity,
      state: addressState,
      postalCode: addressPostalCode,
      country: "Nigeria",
      isDefault: addresses.length === 0,
    };

    try {
      const response=await fetch("/api/account/addresses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(newAddr)});
      const data=await response.json();
      if(!response.ok){setAddressError(data.error);return;}
      setAddresses((prev)=>[...prev,data.address]);
    }catch{setAddressError("Could not save the address. Please try again.");return;}
    setShowAddressForm(false);
    setAddressFullName("");
    setAddressPhone("");
    setAddressStreet("");
    setAddressApartment("");
    setAddressCity("");
    setAddressState("");
    setAddressPostalCode("");
    setAddressError("");
  };

  if (loadingSession) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-background)" }}>
        <div style={{ display: "inline-block", width: "45px", height: "45px", border: "2px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "luxury-skeleton-shimmer 1s infinite linear" }} />
      </main>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main style={{ backgroundColor: "var(--color-background)", color: "var(--color-primary)", minHeight: "100vh", padding: "var(--space-xxl) 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "var(--space-xxl)" }}>
          
          {/* LEFT Sidebar: Tab Controls */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-xl)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ width: "40px", height: "40px", backgroundColor: "var(--color-primary)", color: "var(--color-background)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px" }}>
                {user ? user.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)", textTransform: "uppercase" }}>{user?.name}</div>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{user?.email}</div>
              </div>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {[
                { id: "profile", label: "My Profile", icon: <User size={16} /> },
                { id: "orders", label: "Order History", icon: <Package size={16} /> },
                { id: "addresses", label: "Address Book", icon: <MapPin size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                    padding: "12px 16px",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "var(--font-size-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    border: activeTab === tab.id ? "1px solid var(--color-primary)" : "1px solid transparent",
                    backgroundColor: activeTab === tab.id ? "rgba(0,0,0,0.01)" : "transparent",
                    transition: "var(--transition-fast)"
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                  padding: "12px 16px",
                  width: "100%",
                  textAlign: "left",
                  fontSize: "var(--font-size-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  color: "var(--color-error)",
                  marginTop: "var(--space-lg)"
                }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </nav>
          </div>

          {/* RIGHT Panel: Tab Contents */}
          <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: "var(--space-xxl)" }}>
            
            {/* TAB 1: Profile View */}
            {activeTab === "profile" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>My Profile</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)", padding: "var(--space-xl)", border: "1px solid var(--color-border)" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Full Name</label>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)", marginTop: "4px" }}>{user?.name}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email Address</label>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)", marginTop: "4px" }}>{user?.email}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Phone Number</label>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)", marginTop: "4px" }}>{user?.phone || "Not Specified"}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Account Tier</label>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-base)", marginTop: "4px", color: "var(--color-accent)" }}>{user?.role === "ADMIN" ? "PREMIUM CURATOR (ADMIN)" : "SELECT CIRCLE"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Order History */}
            {activeTab === "orders" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>Order History</h2>
                
                {loadingOrders && <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>Compiling transaction archives...</div>}
                
                {!loadingOrders && orders.length === 0 && (
                  <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
                    <Package size={36} style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-sm)" }} />
                    <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-md)" }}>No previous order history drafted.</p>
                    <Link href="/shop" className="btn-primary">Browse Silhouette Catalog</Link>
                  </div>
                )}

                {!loadingOrders && orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      border: "1px solid var(--color-border)",
                      marginBottom: "var(--space-lg)",
                      padding: "var(--space-lg)",
                      backgroundColor: "rgba(0,0,0,0.01)"
                    }}
                  >
                    {/* Header info */}
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>{ord.orderNumber}</span>
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginLeft: "var(--space-md)" }}>
                          {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
                        <span style={{
                          backgroundColor: ord.status === "DELIVERED" || ord.status === "COMPLETED" ? "rgba(46,90,68,0.08)" : "rgba(197,168,128,0.08)",
                          color: ord.status === "DELIVERED" || ord.status === "COMPLETED" ? "var(--color-success)" : "var(--color-accent)",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase"
                        }}>
                          {ord.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                      {ord.items.map((item: any) => (
                        <div key={item.id} style={{ display: "flex", gap: "var(--space-sm)" }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: "40px", height: "50px", objectFit: "cover", backgroundColor: "var(--color-skeleton)" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, textTransform: "uppercase", fontSize: "13px" }}>{item.title}</div>
                            <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                              Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                            </div>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: "var(--font-size-xs)" }}>₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Confirmation & Tracking */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "var(--space-sm)" }}>
                      <span style={{ fontWeight: 700, fontSize: "var(--font-size-sm)" }}>Total: ₦{ord.total.toLocaleString()}</span>
                      
                      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        {/* USER CONFIRMATION SYSTEM: Show Confirm Delivery button if shipped/delivered */}
                        {(ord.status === "DELIVERED" || ord.status === "SHIPPED") && (
                          <button
                            onClick={() => handleConfirmDelivery(ord.id, ord.items)}
                            className="btn-accent"
                            style={{ padding: "6px 12px", fontSize: "10px", fontWeight: 600 }}
                          >
                            Confirm Delivery
                          </button>
                        )}
                        <Link
                          href={`/tracking?orderNumber=${ord.orderNumber}&email=${encodeURIComponent(ord.email)}`}
                          className="btn-primary"
                          style={{ padding: "6px 12px", fontSize: "10px", fontWeight: 600 }}
                        >
                          Track Logistics
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Address Book */}
            {activeTab === "addresses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase" }}>Address Book</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "10px" }}>
                      Add New Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)", marginBottom: "var(--space-xl)" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-md)" }}>Create Address Profile</h3>
                    
                    {addressError && <div style={{ fontSize: "11px", color: "var(--color-error)", marginBottom: "var(--space-sm)" }}>{addressError}</div>}
                    
                    <div className="luxury-input-group">
                      <label className="luxury-label">Address Name (e.g. Home, Office)</label>
                      <input type="text" value={addressName} onChange={(e) => setAddressName(e.target.value)} className="luxury-input" required />
                    </div>
                    <div className="luxury-input-group">
                      <label className="luxury-label">Recipient's Full Name</label>
                      <input type="text" value={addressFullName} onChange={(e) => setAddressFullName(e.target.value)} className="luxury-input" required />
                    </div>
                    <div className="luxury-input-group">
                      <label className="luxury-label">Contact Phone</label>
                      <input type="tel" value={addressPhone} onChange={(e) => setAddressPhone(e.target.value)} className="luxury-input" required />
                    </div>
                    <div className="luxury-input-group">
                      <label className="luxury-label">Street & Suite Address</label>
                      <input type="text" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} className="luxury-input" required />
                    </div>
                    <div className="luxury-input-group">
                      <label className="luxury-label">Apartment, Unit (Optional)</label>
                      <input type="text" value={addressApartment} onChange={(e) => setAddressApartment(e.target.value)} className="luxury-input" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                      <div className="luxury-input-group">
                        <label className="luxury-label">City</label>
                        <input type="text" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} className="luxury-input" required />
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">State</label>
                        <input type="text" value={addressState} onChange={(e) => setAddressState(e.target.value)} className="luxury-input" required />
                      </div>
                    </div>
                    <div className="luxury-input-group" style={{ marginBottom: "var(--space-xl)" }}>
                      <label className="luxury-label">Postal / Zip Code</label>
                      <input type="text" value={addressPostalCode} onChange={(e) => setAddressPostalCode(e.target.value)} className="luxury-input" required />
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)" }}>
                      <button type="submit" className="btn-primary" style={{ flex: 2 }}>Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        border: "1px solid var(--color-border)",
                        padding: "var(--space-lg)",
                        backgroundColor: "rgba(0,0,0,0.01)",
                        position: "relative"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-xs)" }}>
                        <span style={{ fontWeight: 700, fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{addr.name}</span>
                        {addr.isDefault && (
                          <span style={{ fontSize: "8px", fontWeight: "var(--weight-bold)", backgroundColor: "var(--color-primary)", color: "var(--color-background)", padding: "1px 5px" }}>DEFAULT</span>
                        )}
                      </div>
                      <div style={{ fontSize: "var(--font-size-sm)", lineHeight: 1.5, marginTop: "var(--space-xs)", color: "var(--color-text)" }}>
                        <strong>{addr.fullName}</strong><br />
                        {addr.streetAddress} {addr.apartment && `, ${addr.apartment}`}<br />
                        {addr.city}, {addr.state}<br />
                        {addr.postalCode}<br />
                        {addr.country}
                        <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>Phone: {addr.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Saved Wishlist */}
            {activeTab === "wishlist" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>Saved Wishlist</h2>
                
                {wishlistItems.length === 0 && (
                  <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
                    <Heart size={36} style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-sm)" }} />
                    <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-md)" }}>Your wishlist folder is empty.</p>
                    <Link href="/shop" className="btn-primary">Browse Boutique</Link>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
                  {wishlistItems.map((wish) => {
                    const price = wish.price;
                    return (
                      <div
                        key={wish.productId}
                        style={{
                          border: "1px solid var(--color-border)",
                          padding: "var(--space-md)",
                          display: "flex",
                          gap: "var(--space-md)",
                          backgroundColor: "rgba(0,0,0,0.01)"
                        }}
                      >
                        <img
                          src={wish.image}
                          alt={wish.title}
                          style={{ width: "70px", height: "90px", objectFit: "cover", backgroundColor: "var(--color-skeleton)" }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                          <div>
                            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-base)", textTransform: "uppercase", fontWeight: 500 }}>{wish.title}</h4>
                            <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--color-accent)", display: "block", marginTop: "2px" }}>₦{price.toLocaleString()}</span>
                          </div>
                          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                            <button
                              onClick={() => {
                                // Add to cart with default first size
                                addCartItem({
                                  productId: wish.productId,
                                  title: wish.title,
                                  price: price,
                                  image: wish.image,
                                  quantity: 1,
                                  size: wish.sizes?.[0] || "M",
                                  color: wish.colors?.[0]?.name || "Obsidian Black",
                                  maxStock: wish.stock ?? 10,
                                });
                                alert(`${wish.title} added to bag (Size M).`);
                              }}
                              className="btn-primary"
                              style={{ padding: "4px 8px", fontSize: "10px" }}
                            >
                              Add to Bag
                            </button>
                            <button
                              onClick={() => removeWishlistItem(wish.productId)}
                              className="btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "10px", color: "var(--color-error)", borderColor: "var(--color-border)" }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* MODAL: Editorial Feedback review prompt */}
      {showReviewModal && selectedProductForReview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(8,8,8,0.85)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100000 }}>
          <div style={{ backgroundColor: "var(--color-background)", color: "var(--color-primary)", width: "100%", maxWidth: "480px", padding: "var(--space-xxl)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", position: "relative" }}>
            
            <div style={{ textAlign: "center", marginBottom: "var(--space-lg)" }}>
              <MessageSquare size={36} style={{ color: "var(--color-accent)", margin: "0 auto var(--space-xs) auto" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase" }}>Editorial Review</h3>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>Share your sartorial perspective on this silhouette.</p>
            </div>

            {reviewErrorMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", backgroundColor: "rgba(169,68,66,0.06)", border: "1px solid var(--color-error)", padding: "var(--space-sm)", color: "var(--color-error)", marginBottom: "var(--space-md)", fontSize: "11px" }}>
                <AlertCircle size={14} />
                <span>{reviewErrorMsg}</span>
              </div>
            )}

            {reviewSuccessMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", backgroundColor: "rgba(46,90,68,0.06)", border: "1px solid var(--color-success)", padding: "var(--space-sm)", color: "var(--color-success)", marginBottom: "var(--space-md)", fontSize: "11px" }}>
                <CheckCircle size={14} />
                <span>{reviewSuccessMsg}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "var(--space-sm)", border: "1px solid var(--color-border)", padding: "var(--space-sm)", backgroundColor: "rgba(0,0,0,0.01)", marginBottom: "var(--space-lg)" }}>
              <img
                src={selectedProductForReview.image}
                alt={selectedProductForReview.title}
                style={{ width: "40px", height: "50px", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontFamily: "var(--font-heading)", textTransform: "uppercase", fontSize: "var(--font-size-sm)", fontWeight: 600 }}>{selectedProductForReview.title}</div>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Size: {selectedProductForReview.size} | Color: {selectedProductForReview.color}</div>
              </div>
            </div>

            <form onSubmit={handleSubmitReview}>
              
              {/* Rating Swatches */}
              <div className="luxury-input-group" style={{ textAlign: "center" }}>
                <label className="luxury-label">Sartorial Rating</label>
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm)", marginTop: "4px" }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setReviewRating(val)}
                      style={{ color: reviewRating >= val ? "var(--color-accent)" : "var(--color-border)", transition: "var(--transition-fast)" }}
                    >
                      <Star size={24} fill={reviewRating >= val ? "var(--color-accent)" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="luxury-input-group" style={{ marginBottom: "var(--space-xl)" }}>
                <label className="luxury-label">Bespoke Review Copy</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="e.g. The drape and silhouette are exceptionally structured. Fabric breathability matches editorial Zara collections."
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--color-border)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-primary)",
                    outline: "none",
                    resize: "none",
                    padding: "var(--space-xs) 0",
                    lineHeight: 1.5
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "var(--space-md)" }}>
                <button type="submit" disabled={submittingReview} className="btn-primary" style={{ flex: 2 }}>
                  {submittingReview ? "PUBLISHING..." : "SUBMIT PERSPECTIVE"}
                </button>
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Dismiss
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
