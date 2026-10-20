"use client";

import ProductMediaEditor from "@/components/shop/ProductMediaEditor";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, BarChart3, Package, ShoppingBag, Percent, MessageSquare, Plus, Trash2, Edit3, Save, Eye, Check, X, AlertTriangle, Star } from "lucide-react";

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  
  // Dashboard Panels: "overview", "products", "orders", "coupons", "reviews"
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "coupons" | "reviews">("overview");

  // Overview Data
  const [overview, setOverview] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Products Data
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [mediaBusy,setMediaBusy]=useState(false);
  
  // Product Form Fields
  const [pTitle, setPTitle] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pBasePrice, setPBasePrice] = useState("");
  const [pSalePrice, setPSalePrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pCategory, setPCategory] = useState("MEN");
  const [pProductType, setPProductType] = useState("Clothing");
  const [pAgeGroup, setPAgeGroup] = useState("Adults");
  const [pBadge, setPBadge] = useState("");
  const [pImages, setPImages] = useState(""); // JSON String
  const [pSizes, setPSizes] = useState("[\"S\",\"M\",\"L\",\"XL\"]");
  const [pColors, setPColors] = useState("[]");
  const [pMaterial, setPMaterial] = useState("");
  const [pCare, setPCare] = useState("");

  // Orders Data
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Coupons Data
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [cCode, setCCode] = useState("");
  const [cType, setCType] = useState("PERCENTAGE");
  const [cValue, setCValue] = useState("");
  const [cExpiry, setCExpiry] = useState("");
  const [cMaxUses, setCMaxUses] = useState("100");

  // Reviews Data
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role === "ADMIN" && data.isOwner) {
            setAuthorized(true);
            fetchOverview();
          } else {
            window.location.href = "/account/login";
          }
        } else {
          window.location.href = "/account/login";
        }
      } catch {
        window.location.href = "/account/login";
      } finally {
        setLoadingSession(false);
      }
    };
    checkAdminSession();
  }, []);

  const fetchOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Toggle active dashboard view
  useEffect(() => {
    if (!authorized) return;
    if (tab === "overview") fetchOverview();
    else if (tab === "products") fetchProducts();
    else if (tab === "orders") fetchOrders();
    else if (tab === "coupons") fetchCoupons();
    else if (tab === "reviews") fetchReviews();
  }, [tab, authorized]);

  // Product CRUD Handlers
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editingProduct?.id,
      title: pTitle,
      description: pDescription,
      basePrice: parseFloat(pBasePrice),
      salePrice: pSalePrice ? parseFloat(pSalePrice) : null,
      stock: parseInt(pStock) || 0,
      category: pCategory,
      productType: pProductType,
      ageGroup: pAgeGroup,
      badge: pBadge || null,
      images: pImages || "[]",
      sizes: pSizes || "[\"S\",\"M\",\"L\"]",
      colors: pColors || "[]",
      material: pMaterial,
      care: pCare,
    };

    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowProductForm(false);
        setEditingProduct(null);
        fetchProducts();
        alert("Bespoke silhouette successfully updated.");
      } else {
        const errorData = await res.json();
        alert(`Product save failure: ${errorData.error}`);
      }
    } catch {
      alert("Error contacting the database nodes.");
    }
  };

  const handleEditProductClick = (prod: any) => {
    setEditingProduct(prod);
    setPTitle(prod.title);
    setPDescription(prod.description);
    setPBasePrice(prod.basePrice.toString());
    setPSalePrice(prod.salePrice ? prod.salePrice.toString() : "");
    setPStock(prod.stock.toString());
    setPCategory(prod.category);
    setPProductType(prod.productType || "Clothing");
    setPAgeGroup(prod.ageGroup || "Adults");
    setPBadge(prod.badge || "");
    setPImages(prod.images);
    setPSizes(prod.sizes);
    setPColors(prod.colors);
    setPMaterial(prod.material || "");
    setPCare(prod.care || "");
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this garment silhouette?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts();
        alert("Silhoutte product deleted.");
      } else {
        alert("Garment deletion failed.");
      }
    } catch {
      alert("Database error deleting product.");
    }
  };

  // Order Status Updater Handler
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status, trackingNumber }),
      });

      if (res.ok) {
        fetchOrders();
        alert(`Order reference successfully updated to ${status.replace(/_/g, " ")}.`);
      } else {
        alert("Order update failed.");
      }
    } catch {
      alert("Network issue updating order status.");
    }
  };

  // Coupon Creation Handler
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: cCode,
          type: cType,
          value: parseFloat(cValue),
          expiryDate: new Date(cExpiry),
          maxUses: parseInt(cMaxUses),
        }),
      });

      if (res.ok) {
        setShowCouponForm(false);
        setCCode("");
        setCValue("");
        setCExpiry("");
        fetchCoupons();
        alert(`Coupon ${cCode.toUpperCase()} successfully drafted.`);
      } else {
        const errorData = await res.json();
        alert(`Coupon creation failed: ${errorData.error}`);
      }
    } catch {
      alert("Error saving discount code.");
    }
  };

  const handleToggleCoupon = async (coupon: any) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
      });

      if (res.ok) {
        fetchCoupons();
      }
    } catch {
      alert("Error toggling coupon state.");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCoupons();
      }
    } catch {
      alert("Error deleting discount code.");
    }
  };

  // Review Approval Moderator Handlers
  const handleApproveReview = async (id: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved: true }),
      });

      if (res.ok) {
        fetchReviews();
        alert("Editorial review successfully approved.");
      }
    } catch {
      alert("Error moderating review.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to reject and delete this customer feedback?")) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchReviews();
        alert("Customer feedback deleted.");
      }
    } catch {
      alert("Error rejecting review.");
    }
  };

  if (loadingSession) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-background)" }}>
        <div style={{ display: "inline-block", width: "45px", height: "45px", border: "2px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "luxury-skeleton-shimmer 1s infinite linear" }} />
      </main>
    );
  }

  if (!authorized) return null;

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main style={{ backgroundColor: "var(--color-background)", color: "var(--color-primary)", minHeight: "100vh", padding: "var(--space-xxl) 0" }}>
        <div className="container owner-dashboard-layout" style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "var(--space-xxl)" }}>
          
          {/* LEFT: Curators Navigation */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-xl)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-border)" }}>
              <ShieldCheck size={18} style={{ color: "var(--color-accent)" }} />
              <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Owner dashboard</span>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {[
                { id: "overview", label: "Overview", icon: <BarChart3 size={16} /> },
                { id: "products", label: "Products", icon: <ShoppingBag size={16} /> },
                { id: "orders", label: "Orders", icon: <Package size={16} /> },
                { id: "coupons", label: "Discount Codes", icon: <Percent size={16} /> },
                { id: "reviews", label: "Feedback Moderation", icon: <MessageSquare size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as any)}
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
                    border: tab === item.id ? "1px solid var(--color-primary)" : "1px solid transparent",
                    backgroundColor: tab === item.id ? "rgba(0,0,0,0.01)" : "transparent",
                    transition: "var(--transition-fast)"
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT: Curators Workspace */}
          <div style={{ borderLeft: "1px solid var(--color-border)", paddingLeft: "var(--space-xxl)" }}>
            
            {/* PANEL 1: Simple Overview & Analytics */}
            {tab === "overview" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>Overview</h2>
                
                {loadingOverview && <div style={{ fontSize: "var(--font-size-sm)" }}>Compiling studio registers...</div>}
                
                {overview && (
                  <div>
                    {/* Visual Figures Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-lg)", marginBottom: "var(--space-xxl)" }}>
                      <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "0.1em" }}>Accumulated Revenue</span>
                        <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", fontWeight: 500, marginTop: "var(--space-xs)" }}>
                          ₦{overview.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "0.1em" }}>Draft Orders Count</span>
                        <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", fontWeight: 500, marginTop: "var(--space-xs)" }}>
                          {overview.ordersCount}
                        </div>
                      </div>
                      <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-muted)", letterSpacing: "0.1em" }}>Enrolled Circle Users</span>
                        <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", fontWeight: 500, marginTop: "var(--space-xs)" }}>
                          {overview.customersCount}
                        </div>
                      </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {overview.lowStockProducts && overview.lowStockProducts.length > 0 && (
                      <div style={{ border: "1px solid var(--color-error)", backgroundColor: "rgba(169,68,66,0.03)", padding: "var(--space-lg)", marginBottom: "var(--space-xxl)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--color-error)", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "var(--space-sm)" }}>
                          <AlertTriangle size={16} />
                          <span>LOW STOCK WARNING ALERT</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                          {overview.lowStockProducts.map((p: any) => (
                            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-sm)" }}>
                              <span style={{ fontWeight: 600 }}>{p.title}</span>
                              <span style={{ color: "var(--color-error)", fontWeight: 700 }}>ONLY {p.stock} LEFT IN SILO</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Transactions List */}
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-md)" }}>Recent Transactions</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-sm)" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--color-primary)", textTransform: "uppercase", fontSize: "10px", color: "var(--color-text-muted)", textAlign: "left" }}>
                          <th style={{ padding: "8px 0" }}>Reference</th>
                          <th>Email</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.recentOrders.map((ord: any) => (
                          <tr key={ord.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                            <td style={{ padding: "12px 0", fontWeight: 600 }}>{ord.orderNumber}</td>
                            <td>{ord.email}</td>
                            <td>₦{ord.total.toLocaleString()}</td>
                            <td style={{ textTransform: "uppercase", fontWeight: 700, fontSize: "11px" }}>{ord.status.replace(/_/g, " ")}</td>
                            <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>
                )}
              </div>
            )}

            {/* PANEL 2: Products Stock & Info Creator */}
            {tab === "products" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase" }}>Products</h2>
                  {!showProductForm && (
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setPTitle("");
                        setPDescription("");
                        setPBasePrice("");
                        setPSalePrice("");
                        setPStock("10");
                        setPCategory("MEN");
                        setPProductType("Clothing");
                        setPAgeGroup("Adults");
                        setPBadge("NEW");
                        setPImages("[]");
                        setPMaterial("");
                        setPCare("");
                        setShowProductForm(true);
                      }}
                      className="btn-accent"
                      style={{ padding: "8px 16px", fontSize: "11px" }}
                    >
                      <Plus size={14} style={{ marginRight: "var(--space-xs)" }} /> Draft Silhouette
                    </button>
                  )}
                </div>

                {showProductForm && (
                  <form onSubmit={handleSaveProduct} style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)", marginBottom: "var(--space-xxl)" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>
                      {editingProduct ? "Revise Silhouette Design" : "Draft New Garment Silhouette"}
                    </h3>

                    <div className="luxury-input-group">
                      <label className="luxury-label">Product Name / Title *</label>
                      <input type="text" value={pTitle} onChange={(e) => setPTitle(e.target.value)} className="luxury-input" required />
                    </div>

                    <div className="luxury-input-group">
                      <label className="luxury-label">Curator Description *</label>
                      <textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)} className="luxury-input" rows={3} required style={{ resize: "none" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Base Price (₦) *</label>
                        <input type="number" value={pBasePrice} onChange={(e) => setPBasePrice(e.target.value)} className="luxury-input" required />
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Sale Price (₦ - Optional)</label>
                        <input type="number" value={pSalePrice} onChange={(e) => setPSalePrice(e.target.value)} className="luxury-input" />
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">In-Stock Inventory *</label>
                        <input type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} className="luxury-input" required />
                      </div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--space-md)"}}>
<div className="luxury-input-group"><label className="luxury-label" htmlFor="product-type">Product type *</label><input id="product-type" value={pProductType} onChange={e=>setPProductType(e.target.value)} className="luxury-input" maxLength={60} required /></div>
<div className="luxury-input-group"><label className="luxury-label" htmlFor="product-age">Age group</label><select id="product-age" value={pAgeGroup} onChange={e=>setPAgeGroup(e.target.value)} className="luxury-input"><option>Adults</option><option>Children</option></select></div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Category *</label>
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value)}
                          className="luxury-input"
                          style={{ height: "35px", background: "transparent", color: "var(--color-primary)" }}
                        >
                          <option value="MEN">MEN</option>
                          <option value="WOMEN">WOMEN</option>
                          <option value="COLLECTIONS">COLLECTIONS</option>
                          <option value="SALE">SALE</option>
                        </select>
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Editorial Badge</label>
                        <select
                          value={pBadge}
                          onChange={(e) => setPBadge(e.target.value)}
                          className="luxury-input"
                          style={{ height: "35px", background: "transparent", color: "var(--color-primary)" }}
                        >
                          <option value="">No Badge</option>
                          <option value="NEW">NEW</option>
                          <option value="TRENDING">TRENDING</option>
                          <option value="BEST_SELLER">BEST SELLER</option>
                          <option value="LIMITED_EDITION">LIMITED EDITION</option>
                          <option value="SALE">SALE</option>
                        </select>
                      </div>
                    </div>

                    <ProductMediaEditor images={pImages} sizes={pSizes} colors={pColors} onImages={setPImages} onSizes={setPSizes} onColors={setPColors} onBusyChange={setMediaBusy}/>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Material Composition</label>
                        <input type="text" value={pMaterial} onChange={(e) => setPMaterial(e.target.value)} className="luxury-input" />
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Care Instructions</label>
                        <input type="text" value={pCare} onChange={(e) => setPCare(e.target.value)} className="luxury-input" />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-lg)" }}>
                      <button type="submit" disabled={mediaBusy} className="btn-primary" style={{ flex: 2 }}>{mediaBusy?"Preparing images…":"Save product"}</button>
                      <button type="button" onClick={() => setShowProductForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                )}

                {loadingProducts && <div style={{ fontSize: "var(--font-size-sm)" }}>Searching wardrobes...</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        border: "1px solid var(--color-border)",
                        padding: "var(--space-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.01)"
                      }}
                    >
                      <div style={{ display: "flex", gap: "var(--space-md)" }}>
                        <img
                          src={JSON.parse(prod.images)[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200"}
                          alt={prod.title}
                          style={{ width: "50px", height: "65px", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontFamily: "var(--font-heading)", textTransform: "uppercase", fontSize: "var(--font-size-base)", fontWeight: 600 }}>{prod.title}</div>
                          <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            Stock: <strong style={{ color: prod.stock < 5 ? "var(--color-error)" : "inherit" }}>{prod.stock} units</strong> | Price: ₦{prod.basePrice.toLocaleString()} | Category: {prod.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        <button onClick={() => handleEditProductClick(prod)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "10px" }}>
                          <Edit3 size={12} style={{ marginRight: "4px" }} /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(prod.id)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "10px", color: "var(--color-error)", borderColor: "var(--color-border)" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* PANEL 3: Logistics Order State & Shipping Code Manager */}
            {tab === "orders" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>Orders</h2>
                
                {loadingOrders && <div style={{ fontSize: "var(--font-size-sm)" }}>Locating shipping channels...</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        border: "1px solid var(--color-border)",
                        padding: "var(--space-lg)",
                        backgroundColor: "rgba(0,0,0,0.01)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
                        <div>
                          <span style={{ fontWeight: 600 }}>{ord.orderNumber}</span>
                          <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginLeft: "var(--space-md)" }}>{ord.email}</span>
                        </div>
                        
                        {/* Order status changer dropdown */}
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                          <span style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value, ord.trackingNumber || undefined)}
                            style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", background: "transparent", color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}
                          >
                            <option value="PENDING_PAYMENT">PAYMENT PENDING</option>
                            <option value="PENDING_CRYPTO_PAYMENT">PENDING CRYPTO</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="EXPIRED">EXPIRED</option>
                          </select>
                        </div>
                      </div>

                      {/* Items info */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-md)" }}>
                        {ord.items.map((item: any) => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)" }}>
                            <span>{item.title} (Size: {item.size} x {item.quantity})</span>
                            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Add Shipping tracking number */}
                      <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.03)", paddingTop: "var(--space-sm)" }}>
                        <span style={{ fontWeight: 700, fontSize: "var(--font-size-xs)" }}>Paid Amount: ₦{ord.total.toLocaleString()}</span>
                        
                        <div style={{ display: "flex", gap: "var(--space-xs)", flex: 1, justifyContent: "flex-end" }}>
                          <input
                            type="text"
                            placeholder="CARRIER CODE"
                            defaultValue={ord.trackingNumber || ""}
                            onBlur={(e) => handleUpdateOrderStatus(ord.id, ord.status, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              border: "1px solid var(--color-border)",
                              background: "transparent",
                              color: "var(--color-primary)",
                              maxWidth: "140px"
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* PANEL 4: Active Discount Coupon Controller */}
            {tab === "coupons" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase" }}>Discount Codes</h2>
                  {!showCouponForm && (
                    <button onClick={() => setShowCouponForm(true)} className="btn-accent" style={{ padding: "6px 12px", fontSize: "10px" }}>
                      Draft Code
                    </button>
                  )}
                </div>

                {showCouponForm && (
                  <form onSubmit={handleCreateCoupon} style={{ border: "1px solid var(--color-border)", padding: "var(--space-xl)", backgroundColor: "rgba(0,0,0,0.01)", marginBottom: "var(--space-xl)" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-lg)", textTransform: "uppercase", marginBottom: "var(--space-md)" }}>Draft Coupon Code</h3>
                    
                    <div className="luxury-input-group">
                      <label className="luxury-label">Coupon Code (Uppercase) *</label>
                      <input type="text" value={cCode} onChange={(e) => setCCode(e.target.value.toUpperCase().trim())} placeholder="WELCOME20" className="luxury-input" required />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Discount Type *</label>
                        <select value={cType} onChange={(e) => setCType(e.target.value)} className="luxury-input" style={{ height: "35px", background: "transparent", color: "var(--color-primary)" }}>
                          <option value="PERCENTAGE">PERCENTAGE (%)</option>
                          <option value="FIXED">FIXED VALUE (₦)</option>
                        </select>
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Value *</label>
                        <input type="number" value={cValue} onChange={(e) => setCValue(e.target.value)} className="luxury-input" required />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Expiration Date *</label>
                        <input type="date" value={cExpiry} onChange={(e) => setCExpiry(e.target.value)} className="luxury-input" required style={{ color: "var(--color-primary)" }} />
                      </div>
                      <div className="luxury-input-group">
                        <label className="luxury-label">Max Uses Limit *</label>
                        <input type="number" value={cMaxUses} onChange={(e) => setCMaxUses(e.target.value)} className="luxury-input" required />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)" }}>
                      <button type="submit" className="btn-primary" style={{ flex: 2 }}>Draft Code</button>
                      <button type="button" onClick={() => setShowCouponForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                    </div>
                  </form>
                )}

                {loadingCoupons && <div style={{ fontSize: "var(--font-size-sm)" }}>Searching catalogs...</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  {coupons.map((coup) => (
                    <div
                      key={coup.id}
                      style={{
                        border: "1px solid var(--color-border)",
                        padding: "var(--space-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.01)"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "var(--font-size-base)", fontWeight: 700, textTransform: "uppercase" }}>{coup.code}</span>
                          <span style={{
                            backgroundColor: coup.isActive ? "rgba(46,90,68,0.08)" : "rgba(169,68,66,0.08)",
                            color: coup.isActive ? "var(--color-success)" : "var(--color-error)",
                            fontSize: "8px",
                            fontWeight: 700,
                            padding: "1px 5px"
                          }}>
                            {coup.isActive ? "ACTIVE" : "DISABLED"}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                          Type: {coup.type} | Value: {coup.type === "PERCENTAGE" ? `${coup.value}%` : `₦${coup.value}`} | Uses: {coup.usageCount}/{coup.maxUses} | Expires: {new Date(coup.expiryDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                        <button
                          onClick={() => handleToggleCoupon(coup)}
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "10px" }}
                        >
                          {coup.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coup.id)}
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "10px", color: "var(--color-error)", borderColor: "var(--color-border)" }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* PANEL 5: Editorial Reviews Moderator Console */}
            {tab === "reviews" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", marginBottom: "var(--space-lg)" }}>Feedback Moderation</h2>
                
                {loadingReviews && <div style={{ fontSize: "var(--font-size-sm)" }}>Scanning editorial comments...</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        border: "1px solid var(--color-border)",
                        padding: "var(--space-lg)",
                        backgroundColor: "rgba(0,0,0,0.01)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)", borderBottom: "1px solid rgba(0,0,0,0.02)", paddingBottom: "var(--space-xs)" }}>
                        <div>
                          <span style={{ fontWeight: 600 }}>{rev.userName}</span>
                          <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginLeft: "var(--space-md)" }}>Product: {rev.product.title}</span>
                        </div>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[1, 2, 3, 4, 5].map((val) => (
                            <Star key={val} size={12} fill={rev.rating >= val ? "var(--color-accent)" : "none"} style={{ color: "var(--color-accent)" }} />
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text)", fontStyle: "italic", marginBottom: "var(--space-md)" }}>
                        "{rev.text}"
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{
                          backgroundColor: rev.approved ? "rgba(46,90,68,0.08)" : "rgba(197,168,128,0.08)",
                          color: rev.approved ? "var(--color-success)" : "var(--color-accent)",
                          fontSize: "8px",
                          fontWeight: 700,
                          padding: "1px 5px"
                        }}>
                          {rev.approved ? "APPROVED & LIVE" : "PENDING AUDIT"}
                        </span>

                        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                          {!rev.approved && (
                            <button
                              onClick={() => handleApproveReview(rev.id)}
                              className="btn-accent"
                              style={{ padding: "4px 8px", fontSize: "10px", display: "flex", alignItems: "center", gap: "2px" }}
                            >
                              <Check size={12} /> Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="btn-secondary"
                            style={{ padding: "4px 8px", fontSize: "10px", color: "var(--color-error)", borderColor: "var(--color-border)", display: "flex", alignItems: "center", gap: "2px" }}
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
