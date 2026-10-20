import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopHero from "@/components/shop/ShopHero";
import styles from "@/components/shop/ShopCategory.module.css";

export const metadata: Metadata = {
  title: "Women | Itelier Noir",
  description: "Shop Itelier Noir womenswear: silk shirting, sculptural knits, and editorial luxury pieces.",
};

export default function WomenShopPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className={styles.categoryPage}>
        <ShopHero category="women" />
        <ProductGrid category="women" />
      </main>
      <Footer />
    </>
  );
}
