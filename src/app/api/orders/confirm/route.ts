import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access: Please login first." }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // Find the order
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order details not found" }, { status: 404 });
    }

    // Verify ownership
    if (order.userId !== user.id && order.email.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized: You do not own this order." }, { status: 403 });
    }

    // Ensure it can be completed
    if (order.paymentStatus !== "PAID" || !["DELIVERED","SHIPPED"].includes(order.status)) return NextResponse.json({error:"Only a paid, shipped order can be confirmed as received."},{status:409});

    // Update status to COMPLETED
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order marked as COMPLETED successfully.",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Confirm Order Delivery Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
