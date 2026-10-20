import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopHero from "@/components/shop/ShopHero";
import styles from "@/components/shop/ShopCategory.module.css";

export const metadata: Metadata = {
  title: "Men | Itelier Noir",
  description: "Shop Itelier Noir menswear: tailored silhouettes, luxury knitwear, and refined essentials.",
};

export default function MenShopPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className={styles.categoryPage}>
        <ShopHero category="men" />
        <ProductGrid category="men" />
      </main>
      <Footer />
    </>
  );
}
