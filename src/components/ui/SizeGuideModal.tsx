"use client";

import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
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
        zIndex: 20000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-md)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "var(--color-background)",
          border: "1px solid var(--color-border)",
          padding: "var(--space-xl)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", right: "20px", top: "20px", color: "var(--color-primary)" }}
        >
          <X size={18} />
        </button>

        <h3
          style={{
            textTransform: "uppercase",
            fontFamily: "var(--font-heading)",
            fontSize: "var(--font-size-h3)",
            letterSpacing: "0.08em",
            marginBottom: "var(--space-md)",
          }}
        >
          Sartorial Size Guide
        </h3>
        <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginBottom: "var(--space-md)" }}>
          Measurements in inches. Cut is standard-fit. Custom adjustments available upon request through our bespoke design studio.
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-sm)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-primary)", textTransform: "uppercase", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--weight-semibold)" }}>
              <th style={{ padding: "8px 0" }}>Size</th>
              <th style={{ padding: "8px 0" }}>Chest</th>
              <th style={{ padding: "8px 0" }}>Waist</th>
              <th style={{ padding: "8px 0" }}>Hips</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 0", fontWeight: "var(--weight-medium)" }}>XS</td>
              <td style={{ padding: "10px 0" }}>32 - 34</td>
              <td style={{ padding: "10px 0" }}>26 - 28</td>
              <td style={{ padding: "10px 0" }}>34 - 36</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 0", fontWeight: "var(--weight-medium)" }}>S</td>
              <td style={{ padding: "10px 0" }}>35 - 37</td>
              <td style={{ padding: "10px 0" }}>29 - 31</td>
              <td style={{ padding: "10px 0" }}>37 - 39</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 0", fontWeight: "var(--weight-medium)" }}>M</td>
              <td style={{ padding: "10px 0" }}>38 - 40</td>
              <td style={{ padding: "10px 0" }}>32 - 34</td>
              <td style={{ padding: "10px 0" }}>40 - 42</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 0", fontWeight: "var(--weight-medium)" }}>L</td>
              <td style={{ padding: "10px 0" }}>41 - 43</td>
              <td style={{ padding: "10px 0" }}>35 - 37</td>
              <td style={{ padding: "10px 0" }}>43 - 45</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 0", fontWeight: "var(--weight-medium)" }}>XL</td>
              <td style={{ padding: "10px 0" }}>44 - 46</td>
              <td style={{ padding: "10px 0" }}>38 - 40</td>
              <td style={{ padding: "10px 0" }}>46 - 48</td>
            </tr>
          </tbody>
        </table>

        <button onClick={onClose} className="btn-primary" style={{ width: "100%", marginTop: "var(--space-lg)" }}>
          Close Size Guide
        </button>
      </div>
    </div>
  );
}
