"use client";

import React, { useState } from "react";
import LinkNext from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please review details.");
        setLoading(false);
      } else {
        setSuccess("Account successfully drafted. Redirecting to access panel...");
        setTimeout(() => {
          window.location.href = "/account/login";
        }, 1500);
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
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--font-size-h2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Create Profile</h1>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>Join our select inner circle for curated editorial offerings.</p>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", backgroundColor: "rgba(169,68,66,0.06)", border: "1px solid var(--color-error)", padding: "var(--space-md)", color: "var(--color-error)", marginBottom: "var(--space-md)", fontSize: "var(--font-size-sm)" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", backgroundColor: "rgba(46,90,68,0.06)", border: "1px solid var(--color-success)", padding: "var(--space-md)", color: "var(--color-success)", marginBottom: "var(--space-md)", fontSize: "var(--font-size-sm)" }}>
              <Sparkles size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            <div className="luxury-input-group">
              <label className="luxury-label">Full Name</label>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <User size={16} style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophia Adebayo"
                  className="luxury-input"
                  required
                />
              </div>
            </div>

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
              <label className="luxury-label">Phone Number</label>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 809 988 7766"
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <div className="luxury-input-group">
              <label className="luxury-label">Draft Password</label>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
                <Lock size={16} style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "var(--space-md) 0" }}>
              {loading ? "DRAFTING ACCESS CODES..." : "ENROLL IN THE CIRCLE"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "var(--space-xl)", fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
            Already enrolled?{" "}
            <LinkNext href="/account/login" style={{ borderBottom: "1px solid var(--color-primary)", color: "var(--color-primary)", fontWeight: 600 }}>
              Access Account
            </LinkNext>
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}
