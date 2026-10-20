import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Calculate Total Revenue from paid orders
    const paidOrders = await db.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      select: {
        total: true,
      },
    });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    // 2. Count total orders
    const totalOrdersCount = await db.order.count();

    // 3. Count total users (excluding admins)
    const customerCount = await db.user.count({
      where: {
        role: "USER",
      },
    });

    // 4. Low stock products (stock < 5)
    const lowStockProducts = await db.product.findMany({
      where: {
        stock: {
          lt: 5,
        },
      },
      select: {
        id: true,
        title: true,
        stock: true,
        slug: true,
      },
    });

    // 5. Recent orders list
    const recentOrders = await db.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        orderNumber: true,
        email: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    // 6. Category stats for inventory analysis
    const products = await db.product.findMany({
      select: {
        category: true,
      },
    });
    const categoryCounts: Record<string, number> = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return NextResponse.json({
      revenue: totalRevenue,
      ordersCount: totalOrdersCount,
      customersCount: customerCount,
      lowStockProducts,
      recentOrders,
      categoryCounts,
    });
  } catch (error: any) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
