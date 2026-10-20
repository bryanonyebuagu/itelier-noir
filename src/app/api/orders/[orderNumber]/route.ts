import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const {orderNumber} = await params;

    if (!email) {
      return NextResponse.json({ error: "Email validation parameter is required" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order details not found" }, { status: 404 });
    }

    // Verify matching email
    if (order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized access: email does not match order record" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Order tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
