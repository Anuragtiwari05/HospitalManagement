// src/utils/auth.ts
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// Type assertion to satisfy TypeScript
const SECRET: Secret = JWT_SECRET;

// Type-safe expiresIn: number (seconds) or string like "1d", "2h", "30m", "10s"
type ExpiresIn = number | `${number}${"d" | "h" | "m" | "s"}`;

// Generate JWT token
export function generateToken(
  payload: Record<string, any>,
  expiresIn: ExpiresIn = "1d"
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET, options);
}

// Verify JWT token
export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as string | JwtPayload;
  } catch {
    return null;
  }
}

// Middleware helper for Next.js API routes
export async function getPayloadFromRequest(req: Request): Promise<string | JwtPayload | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  return verifyToken(token);
}
