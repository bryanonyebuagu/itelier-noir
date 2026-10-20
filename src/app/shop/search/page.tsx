import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SearchResultsClient from "./SearchResultsClient";
import styles from "@/components/shop/ShopCategory.module.css";

export const metadata: Metadata = {
  title: "Search | Itelier Noir",
  description: "Search Itelier Noir pieces across men, women, sale, colors, fabrics, and product types.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className={styles.categoryPage}>
        <SearchResultsClient query={q} />
      </main>
      <Footer />
    </>
  );
}
