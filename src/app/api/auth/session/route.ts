import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/utils/auth";
import { db } from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const session = getUserFromRequest(request);
    if (!session) {
      return NextResponse.json({ user: null });
    }

    // Refresh user details from DB to capture any updates
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profilePicture: true,
        addresses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user, isOwner:user.role==="ADMIN" && user.email.toLowerCase()===process.env.OWNER_EMAIL?.trim().toLowerCase() });
  } catch (error: any) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
