import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

// GET all coupons
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error("Admin Coupons GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a coupon
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, type, value, expiryDate, maxUses } = body;

    if (!code || !type || value === undefined || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if coupon code already exists
    const existing = await db.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type.toUpperCase(), // PERCENTAGE or FIXED
        value: parseFloat(value),
        expiryDate: new Date(expiryDate),
        maxUses: parseInt(maxUses) || 100,
        usageCount: 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Admin Coupon POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT edit or toggle coupon state
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isActive, code, type, value, expiryDate, maxUses } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });
    }

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const data: any = {};
    if (isActive !== undefined) data.isActive = !!isActive;
    if (code !== undefined) data.code = code.toUpperCase().trim();
    if (type !== undefined) data.type = type.toUpperCase();
    if (value !== undefined) data.value = parseFloat(value);
    if (expiryDate !== undefined) data.expiryDate = new Date(expiryDate);
    if (maxUses !== undefined) data.maxUses = parseInt(maxUses);

    const coupon = await db.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Admin Coupon PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a coupon
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });
    }

    const existing = await db.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await db.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    console.error("Admin Coupon DELETE Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
