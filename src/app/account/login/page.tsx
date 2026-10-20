"use client";

import React, { useState } from "react";
import LinkNext from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed. Verify credentials.");
        setLoading(false);
      } else {
        // Redirect to dashboard or previous page
        window.location.href = data.user.role === "ADMIN" ? "/admin" : "/account/dashboard";
      }
    } catch {
      setError("Network connection issue. Please check your signal.");
      setLoading(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main style={{ backgroundColor: "var(--color-background)", color: "var(--color-primary)", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xxl) 0" }}>
        <div style={{ width: "100%", maxWidth: "420px", padding: "0 var(--space-md)" }}>
          
          <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Access Studio</h1>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>Enter the world of minimalist silhouette architecture.</p>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", backgroundColor: "rgba(169,68,66,0.06)", border: "1px solid var(--color-error)", padding: "var(--space-md)", color: "var(--color-error)", marginBottom: "var(--space-md)", fontSize: "var(--font-size-sm)" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div className="luxury-input-group">
              <label className="luxury-label">Email Address</label>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <Mail size={16} style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adebayo@luxury.com"
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <div className="luxury-input-group">
              <label className="luxury-label">Password</label>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <Lock size={16} style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "var(--space-md) 0" }}>
              {loading ? "VERIFYING SIGNATURES..." : "ENTER BREADROOM"}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div style={{ marginTop: "var(--space-xl)", border: "1px dashed var(--color-accent)", padding: "var(--space-md)", backgroundColor: "rgba(197,168,128,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--color-accent)", fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "var(--space-xs)" }}>
              <ShieldCheck size={14} />
              <span>Boutique Gate Passes (Demo)</span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
              <strong>Customer:</strong> buyer@luxury.com / CustomerNoir2026!<br />
              <strong>Admin:</strong> admin@ateliernoir.com / AdminNoir2026!
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "var(--space-xl)", fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
            New to our circle?{" "}
            <LinkNext href="/account/register" style={{ borderBottom: "1px solid var(--color-primary)", color: "var(--color-primary)", fontWeight: 600 }}>
              Create an Account
            </LinkNext>
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}
