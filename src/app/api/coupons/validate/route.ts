import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ error: "Coupon code has expired" }, { status: 400 });
    }

    // Check usage limits
    if (coupon.usageCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon code has reached its usage limit" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Coupon validated successfully",
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (error: any) {
    console.error("Coupon Validate Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
