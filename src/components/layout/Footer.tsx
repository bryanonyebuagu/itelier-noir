"use client";

import { useState } from "react";
import { brandConfig } from "@/config/brand";
import { PhoneCall } from "lucide-react";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSubscribed(true);
                setEmail("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer
            style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-background)",
                padding: "var(--space-xxxl) 0 var(--space-xl)",
                marginTop: "var(--space-cinema)",
                borderTop: "1px solid var(--color-border-dark)",
            }}
        >
            <div
                className="container"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "var(--space-xl)",
                }}
            >
                {/* Editorial Brand Narrative */}
                <div style={{ gridColumn: "span 2" }}>
                    <h2
                        style={{
                            color: "var(--color-accent)",
                            fontSize: "var(--font-size-h3)",
                            letterSpacing: "0.1em",
                            marginBottom: "var(--space-sm)",
                            textTransform: "uppercase",
                        }}
                    >
                        {brandConfig.name}
                    </h2>
                    <p
                        style={{
                            color: "var(--color-border)",
                            fontSize: "var(--font-size-sm)",
                            lineHeight: "1.8",
                            maxWidth: "360px",
                            opacity: 0.8,
                            marginBottom: "var(--space-md)",
                        }}
                    >
                        Defined by structural severity and fluid grace. High-end
                        modern wardrobes curated with uncompromising, sustainable
                        commitment.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "var(--space-md)",
                            alignItems: "center",
                        }}
                    >
                        {/* Instagram */}
                        <a
                            href={brandConfig.socialLinks.instagram}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                opacity: 0.7,
                                color: "var(--color-background)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = "1")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "0.7")
                            }
                        >
                            <FaInstagram size={18} />
                        </a>

                        {/* Facebook */}
                        <a
                            href={brandConfig.socialLinks.facebook}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                opacity: 0.7,
                                color: "var(--color-background)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = "1")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "0.7")
                            }
                        >
                            <FaFacebook size={18} />
                        </a>

                        {/* X / Twitter */}
                        <a
                            href={brandConfig.socialLinks.twitter}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                opacity: 0.7,
                                color: "var(--color-background)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = "1")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "0.7")
                            }
                        >
                            <FaXTwitter size={18} />
                        </a>

                        {/* WhatsApp / Phone */}
                        <a
                            href={brandConfig.socialLinks.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                opacity: 0.7,
                                color: "var(--color-background)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = "1")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "0.7")
                            }
                        >
                            <PhoneCall size={17} />
                        </a>
                    </div>
                </div>

                {/* Collections Links */}
                <div>
                    <h4
                        style={{
                            color: "var(--color-accent)",
                            fontSize: "var(--font-size-xs)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            marginBottom: "var(--space-md)",
                        }}
                    >
                        SHOP COLLECTIONS
                    </h4>
                    <ul
                        style={{
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-xs)",
                            fontSize: "var(--font-size-sm)",
                            opacity: 0.8,
                        }}
                    >
                        <li>
                            <a
                                href="/shop/men"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Mens Collection
                            </a>
                        </li>
                        <li>
                            <a
                                href="/shop/women"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Womens Collection
                            </a>
                        </li>
                        <li>
                            <a
                                href="/shop/collections"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Editorial Runway
                            </a>
                        </li>
                        <li>
                            <a
                                href="/shop/sale"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Archive Sale
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4
                        style={{
                            color: "var(--color-accent)",
                            fontSize: "var(--font-size-xs)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            marginBottom: "var(--space-md)",
                        }}
                    >
                        CLIENT SERVICES
                    </h4>
                    <ul
                        style={{
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-xs)",
                            fontSize: "var(--font-size-sm)",
                            opacity: 0.8,
                        }}
                    >
                        <li>
                            <a
                                href="/about"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Our Story
                            </a>
                        </li>
                        <li>
                            <a
                                href="/tracking"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Track Your Order
                            </a>
                        </li>
                        <li>
                            <a
                                href="/help#shipping"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Shipping & Returns
                            </a>
                        </li>
                        <li>
                            <a
                                href="/help#sizing"
                                style={{ color: "var(--color-border)" }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-border)")
                                }
                            >
                                Bespoke Fitting Guide
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Signup */}
                <div style={{ minWidth: "260px" }}>
                    <h4
                        style={{
                            color: "var(--color-accent)",
                            fontSize: "var(--font-size-xs)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            marginBottom: "var(--space-md)",
                        }}
                    >
                        NEWSLETTER
                    </h4>
                    <p
                        style={{
                            color: "var(--color-border)",
                            fontSize: "var(--font-size-xs)",
                            opacity: 0.8,
                            marginBottom: "var(--space-sm)",
                            lineHeight: "1.6",
                        }}
                    >
                        Subscribe to receive exclusive archives access and 10% off
                        your initial order.
                    </p>
                    {subscribed ? (
                        <p
                            style={{
                                color: "var(--color-accent)",
                                fontSize: "var(--font-size-xs)",
                                letterSpacing: "0.05em",
                                marginTop: "var(--space-sm)",
                            }}
                        >
                            ✓ STYLING INVITATION RECEIVED.
                        </p>
                    ) : (
                        <form
                            onSubmit={handleSubscribe}
                            style={{
                                display: "flex",
                                borderBottom: "1px solid var(--color-border)",
                                paddingBottom: "4px",
                            }}
                        >
                            <input
                                type="email"
                                placeholder="YOUR EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    flex: 1,
                                    color: "var(--color-background)",
                                    fontSize: "var(--font-size-xs)",
                                    outline: "none",
                                    letterSpacing: "0.05em",
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    color: "var(--color-accent)",
                                    fontSize: "var(--font-size-xs)",
                                    fontWeight: "var(--weight-semibold)",
                                    letterSpacing: "0.1em",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                {loading ? "..." : "JOIN"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Copyright */}
            <div
                className="container"
                style={{
                    borderTop: "1px solid var(--color-border-dark)",
                    marginTop: "var(--space-xl)",
                    paddingTop: "var(--space-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    fontSize: "var(--font-size-xs)",
                    color: "var(--color-border)",
                    opacity: 0.6,
                }}
            >
                <p>© 2026 {brandConfig.name}. ALL RIGHTS RESERVED.</p>
                <p>CONCEIVED IN WEST AFRICA FOR THE GLOBAL STYLIST.</p>
            </div>
        </footer>
    );
}
