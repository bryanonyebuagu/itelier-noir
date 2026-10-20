import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, text, userName } = body;

    if (!productId || !rating || !text || !userName) {
      return NextResponse.json(
        { error: "Missing required fields (productId, rating, text, userName)" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || typeof text!=="string" || text.length>2000 || typeof userName!=="string" || userName.length>100) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // 1. Verify if the product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 2. Determine if the user is verified (bought the product)
    let isVerifiedBuyer = false;
    const user = getUserFromRequest(request);
    
    if (user) {
      // Find orders of this user that are paid (or processing/delivered) and contain this product
      const matchingOrder = await db.order.findFirst({
        where: {
          userId: user.id,
          paymentStatus: "PAID",
          items: {
            some: {
              productId: productId,
            },
          },
        },
      });
      if (matchingOrder) {
        isVerifiedBuyer = true;
      }
    }

    // 3. Create the review
    const review = await db.review.create({
      data: {
        productId,
        rating: parseInt(rating),
        text,
        userName,
        verified: isVerifiedBuyer,
        approved: false, // Moderated by default, admin approves it
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully. It will appear once approved by our curators.",
      review,
    });
  } catch (error: any) {
    console.error("Create Review Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
