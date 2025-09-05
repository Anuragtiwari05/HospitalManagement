import jwt, { JwtPayload, Secret } from "jsonwebtoken";

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// Type assertion to satisfy TypeScript
const SECRET: Secret = JWT_SECRET;

// Generate JWT token
export function generateToken(
  payload: Record<string, any>,
  expiresIn: string = "1d"
): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

// Verify JWT token
export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, SECRET);
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
