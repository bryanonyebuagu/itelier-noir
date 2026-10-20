import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

// GET all orders for admin
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Admin Orders GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update order status or details
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, paymentStatus, trackingNumber } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const existing = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;

    // Handle inventory adjustment if order is cancelled or marked expired (restock items)
    // or if a pending payment is completed, check if stock was already decremented.
    // In our system, the `/api/orders` POST decrements stock on creation to hold it.
    // If order transitions to EXPIRED, we should restock the items!
    if (status === "EXPIRED" && existing.status !== "EXPIRED" && existing.paymentStatus === "PAID" && existing.status !== "ON_HOLD") {
      // Return items to stock
      for (const item of existing.items) {
        await db.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    const order = await db.order.update({
      where: { id },
      data,
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Admin Orders PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
