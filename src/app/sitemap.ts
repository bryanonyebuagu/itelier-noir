import { MetadataRoute } from "next";
import { db } from "@/utils/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://iteliernoir.com";

  // 1. Static Pages
  const staticPages = [
    "",
    "/about",
    "/shop",
    "/shop/men",
    "/shop/women",
    "/shop/collections",
    "/shop/sale",
    "/tracking",
    "/account/login",
    "/account/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Fetch Products dynamically from Supabase
  let productUrls: any[] = [];
  try {
    const products = await db.product.findMany({
      where: { isVisible: true },
      select: { slug: true, updatedAt: true },
    });

    productUrls = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: prod.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  return [...staticPages, ...productUrls];
}
