"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { brandConfig } from "@/config/brand";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !brandConfig.announcement.isActive) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--color-primary)",
        color: "var(--color-background)",
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--weight-medium)",
        letterSpacing: "0.15em",
        padding: "10px 40px",
        textAlign: "center",
        position: "relative",
        zIndex: 1000,
        textTransform: "uppercase",
        borderBottom: "1px solid var(--color-border-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        transition: "var(--transition-smooth)",
      }}
    >
      <a href={brandConfig.announcement.link || "/shop/all"} style={{ color: "inherit", textDecoration: "none" }}>
        {brandConfig.announcement.text}
      </a>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: "absolute",
          right: "20px",
          color: "inherit",
          display: "flex",
          alignItems: "center",
          opacity: 0.7,
          transition: "var(--transition-fast)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
