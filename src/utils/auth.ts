import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

function jwtSecret() {
  const secret=process.env.JWT_SECRET;
  if(!secret || secret.length<32) throw new Error("Configure JWT_SECRET with at least 32 random characters.");
  return secret;
}

// Hash a password using SHA-256 (stable, zero native compiler warnings on Windows)
export function hashPassword(password: string): string {
  const salt=crypto.randomBytes(16).toString("hex");
  return `scrypt:${salt}:${crypto.scryptSync(password,salt,64).toString("hex")}`;
}

// Compare a plain-text password with its hashed version
export function verifyPassword(password: string, hash: string): boolean {
  if(hash.startsWith("scrypt:")) {
    const [,salt,key]=hash.split(":");
    if(!salt || !key || !/^[a-f0-9]{128}$/i.test(key)) return false;
    return crypto.timingSafeEqual(crypto.scryptSync(password,salt,64),Buffer.from(key,"hex"));
  }
  // Legacy passwords are upgraded on the next successful login.
  const legacy=crypto.createHash("sha256").update(password).digest("hex");
  return /^[a-f0-9]{64}$/i.test(hash) && crypto.timingSafeEqual(Buffer.from(legacy,"hex"),Buffer.from(hash,"hex"));
}

// Generate JWT token containing payload
export function generateToken(payload: { id: string; email: string; role: string; name: string }): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: "7d",algorithm:"HS256" });
}

// Verify JWT token and return decoded payload
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, jwtSecret(), {algorithms:["HS256"]});
  } catch (error) {
    return null;
  }
}

// Extract authenticated user details from a NextRequest cookie
export function getUserFromRequest(request: NextRequest): { id: string; email: string; role: string; name: string } | null {
  const tokenCookie = request.cookies.get("atelier_auth_token");
  if (!tokenCookie) return null;

  return verifyToken(tokenCookie.value);
}
