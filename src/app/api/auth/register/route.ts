import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { hashPassword, generateToken } from "@/utils/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (typeof name!=="string" || !name.trim() || typeof email!=="string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password!=="string" || password.length<8 || password.length>256) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Create user with hashed password
    const passwordHash = hashPassword(password);
    
    // MOCK: Require verification. We will auto-verify the first account or mock standard verification
    const role = "USER";

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        phone,
        role,
        isVerified: false,
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: "Account registered successfully",
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
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
