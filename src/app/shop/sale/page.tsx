import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopHero from "@/components/shop/ShopHero";
import styles from "@/components/shop/ShopCategory.module.css";

export const metadata: Metadata = {
  title: "Sale | Itelier Noir",
  description: "Shop the Itelier Noir archive sale with 20% off selected men's and women's pieces.",
};

export default function SaleShopPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className={styles.categoryPage}>
        <ShopHero category="sale" />
        <ProductGrid category="sale" />
      </main>
      <Footer />
    </>
  );
}
