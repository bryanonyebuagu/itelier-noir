import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

// GET all reviews for moderation
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await db.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error("Admin Reviews GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT approve a review
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, approved } = body;

    if (!id || approved === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = await db.review.update({
      where: { id },
      data: {
        approved: !!approved,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Admin Reviews PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a review
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await db.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Admin Review DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
