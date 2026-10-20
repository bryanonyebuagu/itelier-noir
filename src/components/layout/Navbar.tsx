"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Heart, Search, X, ShieldAlert } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import CartDrawer from "../cart/CartDrawer";
import { curatedCatalog } from "@/components/shop/catalog";
import { formatNaira, getProductPrice, safeJsonParse, type ShopColor, type ShopProduct } from "@/components/shop/types";

// ─── Fix 1: proper type so user?.role stops being "never" ───
interface SessionUser {
    id: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
}

// ─── Tooltip wrapper — reused on all 4 icon buttons ───
function IconTooltip({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    const [visible, setVisible] = useState(false);
    return (
        <span
            style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
            }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <span
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-background)",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",

                        whiteSpace: "nowrap",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        pointerEvents: "none",
                        zIndex: 9999,
                        fontFamily: "var(--font-heading)",
                    }}
                >
                    {label}
                    {/* Arrow */}
                    <span
                        style={{
                            position: "absolute",
                            top: "-4px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "4px solid transparent",
                            borderRight: "4px solid transparent",
                            borderBottom: "4px solid var(--color-primary)",
                        }}
                    />
                </span>
            )}
        </span>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const [isShrunk, setIsShrunk] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartOpen, setCartOpen] = useState(false);
    const [user, setUser] = useState<SessionUser | null>(null);
    const [searchProducts, setSearchProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(false);

    const cartItems = useCart((state) => state.items);
    const wishlistItems = useWishlist((state) => state.items);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => setIsShrunk(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error(err);
            }
        };

        checkSession();
    }, [pathname]);

    useEffect(() => {
        if (!searchOpen || searchProducts.length > 0) return;

        const controller = new AbortController();
        const loadSearchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/products", { signal: controller.signal });
                if (res.ok) {
                    const data = await res.json();
                    const products = (data.products || []) as ShopProduct[];
                    setSearchProducts(products);
                }
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                console.error("Search products error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadSearchProducts();

        return () => controller.abort();
    }, [searchOpen, searchProducts.length]);

    const suggestions = searchQuery.trim()
        ? searchProducts
            .filter((prod) => {
                const query = searchQuery.trim().toLowerCase();
                const colors = safeJsonParse<ShopColor[]>(prod.colors, []).map((color) => color.name).join(" ");
                const tags = prod.tags?.join(" ") || "";

                return [
                    prod.title,
                    prod.category,
                    prod.description,
                    prod.productType || "",
                    prod.material || "",
                    colors,
                    tags,
                ].some((value) => value.toLowerCase().includes(query));
            })
            .slice(0, 6)
        : [];

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        window.location.href = `/shop/search?q=${encodeURIComponent(searchQuery)}`;
        setSearchOpen(false);
    };

    return (
        <>
            <header
                className="site-header"
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    backgroundColor:
                        pathname === "/" && !isShrunk
                            ? "transparent"
                            : "rgba(250, 249, 246, 0.658)",
                    borderBottom:
                        pathname === "/" && !isShrunk
                            ? "none"
                            : "1px solid var(--color-border)",
                    transition: "var(--transition-smooth)",
                    height: isShrunk ? "65px" : "85px",
                    display: "flex",
                    alignItems: "center",
                    color: "var(--color-primary)",
                }}
            >
                <div
                    className="container site-nav-inner"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="site-brand"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: isShrunk
                                ? "var(--font-size-xl)"
                                : "var(--font-size-h3)",
                            fontWeight: "var(--weight-semibold)",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                        }}
                    >
                        {brandConfig.name}
                    </Link>

                    {/* Nav Links */}
                    <nav
                        className="site-nav-links"
                        style={{
                            display: "flex",
                            gap: "var(--space-xl)",
                            textTransform: "uppercase",
                            fontSize: "var(--font-size-xs)",
                            fontWeight: "var(--weight-medium)",
                            letterSpacing: "0.1em",
                        }}
                    >
                        {[
                            { href: "/shop/men", label: "Men" },
                            { href: "/shop/women", label: "Women" },
                            { href: "/about", label: "Story" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    color:
                                        pathname === href
                                            ? "var(--color-accent)"
                                            : "inherit",
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                        {/* Sale gets its own colour override */}
                        <Link
                            href="/shop/sale"
                            style={{ color: "var(--color-error)" }}
                        >
                            Sale
                        </Link>
                    </nav>

                    {/* Icon Controls */}
                    <div
                        className="site-nav-controls"
                        style={{
                            display: "flex",
                            gap: "var(--space-md)",
                            alignItems: "center",
                        }}
                    >
                        {/* Search */}
                        <IconTooltip label="Search">
                            <button
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search items"
                            >
                                <Search size={18} />
                            </button>
                        </IconTooltip>

                        {/* Admin shortcut — only renders when role is ADMIN */}
                        {user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                title="Admin Control Dashboard"
                                style={{
                                    color: "var(--color-accent)",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <ShieldAlert size={18} />
                            </Link>
                        )}

                        {/* Profile */}
                        <IconTooltip label="Profile">
                            <Link
                                href={user ? "/account/dashboard" : "/account/login"}
                                aria-label="My Account"
                            >
                                <User size={18} />
                            </Link>
                        </IconTooltip>

                        {/* Favourites */}
                        <IconTooltip label="Favourites">
                            <Link
                                href="/favorites"
                                style={{ position: "relative" }}
                                aria-label="Wishlist"
                            >
                                <Heart size={18} />
                                {wishlistItems.length > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-6px",
                                            right: "-6px",
                                            backgroundColor: "var(--color-accent)",
                                            color: "var(--color-primary)",
                                            fontSize: "8px",
                                            fontWeight: "var(--weight-bold)",
                                            borderRadius: "50%",
                                            width: "12px",
                                            height: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>
                        </IconTooltip>

                        {/* Cart */}
                        <IconTooltip label="Cart">
                            <button
                                onClick={() => setCartOpen(true)}
                                style={{ position: "relative" }}
                                aria-label="Open Shopping Cart"
                            >
                                <ShoppingBag size={18} />
                                {cartCount > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-6px",
                                            right: "-6px",
                                            backgroundColor: "var(--color-primary)",
                                            color: "var(--color-background)",
                                            fontSize: "8px",
                                            fontWeight: "var(--weight-bold)",
                                            borderRadius: "50%",
                                            width: "12px",
                                            height: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border:
                                                pathname === "/" && !isShrunk
                                                    ? "1px solid var(--color-background)"
                                                    : "1px solid var(--color-border)",
                                        }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </IconTooltip>
                    </div>
                </div>
            </header>

            {/* Floating Search Drawer */}
            {searchOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "var(--color-background)",
                        borderBottom: "1px solid var(--color-border)",
                        padding: "var(--space-xl) 0",
                        zIndex: 10000,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                >
                    <div
                        className="container"
                        style={{ position: "relative", width: "100%" }}
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            style={{
                                display: "flex",
                                width: "100%",
                                borderBottom: "2px solid var(--color-primary)",
                            }}
                        >
                            <input
                                type="text"
                                placeholder="SEARCH BLACK, COATS, DRESSES, SILK..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{
                                    width: "100%",
                                    padding: "var(--space-md) 0",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "var(--font-size-h3)",
                                    fontFamily: "var(--font-heading)",
                                    letterSpacing: "0.05em",
                                    color: "var(--color-primary)",
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: "0 var(--space-md)",
                                    color: "var(--color-primary)",
                                }}
                            >
                                <Search size={22} />
                            </button>
                        </form>
                        
                        {/* Real-time search suggestions dropdown */}
                        {searchQuery.trim() && (
                            <div
                                style={{
                                    marginTop: "var(--space-md)",
                                    width: "100%",
                                    backgroundColor: "var(--color-background)",
                                    maxHeight: "350px",
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--space-sm)",
                                    borderTop: "1px solid var(--color-border)",
                                    paddingTop: "var(--space-md)",
                                }}
                            >
                                {loading && (
                                    <div style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", padding: "var(--space-sm) 0" }}>
                                        Seeking silhouettes...
                                    </div>
                                )}
                                {!loading && suggestions.length === 0 && (
                                    <div style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", padding: "var(--space-sm) 0" }}>
                                        No matching Itelier Noir pieces found.
                                    </div>
                                )}
                                {!loading && suggestions.map((prod) => {
                                    const activePrice = getProductPrice(prod);
                                    const imagesArray = safeJsonParse<string[]>(prod.images, []);
                                    const thumbnail = imagesArray[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200";
                                    return (
                                        <Link
                                            key={prod.id}
                                            href={`/product/${prod.slug}`}
                                            onClick={() => setSearchOpen(false)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "var(--space-md)",
                                                padding: "var(--space-sm) 0",
                                                borderBottom: "1px solid rgba(0,0,0,0.03)",
                                                transition: "var(--transition-fast)",
                                            }}
                                        >
                                            <Image
                                                src={thumbnail}
                                                alt={prod.title}
                                                width={50}
                                                height={60}
                                                style={{
                                                    width: "50px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    backgroundColor: "var(--color-skeleton)",
                                                }}
                                            />
                                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                                                    <span style={{
                                                        fontFamily: "var(--font-heading)",
                                                        fontSize: "var(--font-size-base)",
                                                        fontWeight: "var(--weight-medium)",
                                                        color: "var(--color-primary)",
                                                        textTransform: "uppercase",
                                                    }}>
                                                        {prod.title}
                                                    </span>
                                                    {prod.badge && (
                                                        <span style={{
                                                            backgroundColor: "var(--color-primary)",
                                                            color: "var(--color-background)",
                                                            fontSize: "8px",
                                                            fontWeight: "var(--weight-bold)",
                                                            padding: "2px 6px",
                                                            letterSpacing: "0.1em",
                                                            textTransform: "uppercase",
                                                        }}>
                                                            {prod.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <span style={{
                                                    fontSize: "10px",
                                                    color: "var(--color-text-muted)",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.1em",
                                                    marginTop: "2px",
                                                }}>
                                                    {prod.category.toLowerCase()}
                                                </span>
                                                <span style={{
                                                    fontSize: "var(--font-size-xs)",
                                                    color: "var(--color-accent)",
                                                    fontWeight: "var(--weight-semibold)",
                                                    marginTop: "2px",
                                                }}>
                                                    {formatNaira(activePrice)}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={() => setSearchOpen(false)}
                            style={{
                                position: "absolute",
                                right: "20px",
                                top: "-10px",
                                color: "var(--color-primary)",
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
