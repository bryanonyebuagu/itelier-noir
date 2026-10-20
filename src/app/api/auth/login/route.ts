import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { verifyPassword, generateToken, hashPassword } from "@/utils/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== "string" || typeof password !== "string" || password.length > 256) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if(!user.passwordHash.startsWith("scrypt:")) await db.user.update({where:{id:user.id},data:{passwordHash:hashPassword(password)}});
    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "atelier_auth_token",
      value: token,
      httpOnly: true,
      sameSite:"lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
