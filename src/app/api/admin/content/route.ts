import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

// GET homepage content
export async function GET(request: NextRequest) {
  try {
    let content = await db.homepageContent.findFirst();
    if (!content) {
      // Create a default one if not found
      content = await db.homepageContent.create({
        data: {
          announcementText: "COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS OVER ₦150,000",
          announcementActive: true,
          heroTitle: "ITELIER NOIR",
          heroSubtitle: "THE HAUTE COUTURE EDITION",
          heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
          promoBannerTitle: "COLLECTION PREVIEW SALE",
          promoBannerText: "Unlock exclusive archive silhouettes at special editorial rates for a limited time.",
          promoBannerExpiry: new Date(Date.now() + 1000 * 60 * 60 * 48),
        },
      });
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Admin Content GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST/PUT update homepage content
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      announcementText,
      announcementActive,
      heroTitle,
      heroSubtitle,
      heroImage,
      promoBannerTitle,
      promoBannerText,
      promoBannerExpiry,
    } = body;

    const existing = await db.homepageContent.findFirst();

    let content;
    if (existing) {
      content = await db.homepageContent.update({
        where: { id: existing.id },
        data: {
          announcementText: announcementText !== undefined ? announcementText : existing.announcementText,
          announcementActive: announcementActive !== undefined ? !!announcementActive : existing.announcementActive,
          heroTitle: heroTitle !== undefined ? heroTitle : existing.heroTitle,
          heroSubtitle: heroSubtitle !== undefined ? heroSubtitle : existing.heroSubtitle,
          heroImage: heroImage !== undefined ? heroImage : existing.heroImage,
          promoBannerTitle: promoBannerTitle !== undefined ? promoBannerTitle : existing.promoBannerTitle,
          promoBannerText: promoBannerText !== undefined ? promoBannerText : existing.promoBannerText,
          promoBannerExpiry: promoBannerExpiry !== undefined ? new Date(promoBannerExpiry) : existing.promoBannerExpiry,
        },
      });
    } else {
      content = await db.homepageContent.create({
        data: {
          announcementText: announcementText || "COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS OVER ₦150,000",
          announcementActive: announcementActive !== undefined ? !!announcementActive : true,
          heroTitle: heroTitle || "ITELIER NOIR",
          heroSubtitle: heroSubtitle || "THE HAUTE COUTURE EDITION",
          heroImage: heroImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070",
          promoBannerTitle: promoBannerTitle || "COLLECTION PREVIEW SALE",
          promoBannerText: promoBannerText || "Unlock exclusive archive silhouettes at special editorial rates.",
          promoBannerExpiry: promoBannerExpiry ? new Date(promoBannerExpiry) : new Date(Date.now() + 1000 * 60 * 60 * 48),
        },
      });
    }

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error("Admin Content POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
