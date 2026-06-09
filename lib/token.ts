import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

// if (!ACCESS_SECRET || !REFRESH_SECRET) {
//   throw new Error("JWT secrets are not defined in the environment variables.");
// }
export interface TokenPayload {
  userId: string;
  role: "PLAYER" | "OWNER" | "ADMIN";
}

export function generateAccessToken(payload: TokenPayload): string {
  // Access tokens are short-lived for security
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  // Refresh tokens last longer to keep active users logged in
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}
