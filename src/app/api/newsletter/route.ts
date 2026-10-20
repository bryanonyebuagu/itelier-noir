import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (typeof email!=="string" || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to the Itelier Noir editorial circle.",
      });
    }

    // Subscribe
    await db.newsletter.create({
      data: {
        email: email.toLowerCase().trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Welcome to the Itelier Noir editorial circle. Enjoy exclusive updates.",
    });
  } catch (error: any) {
    console.error("Newsletter Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
