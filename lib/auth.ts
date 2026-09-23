import { jwtVerify, type JWTPayload } from "jose";

export type UserRole = "PLAYER" | "OWNER" | "ADMIN";

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function getAccessToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("sathi_access="))
    ?.slice("sathi_access=".length);

  return token ? decodeURIComponent(token) : null;
}

function isUserRole(value: unknown): value is UserRole {
  return value === "PLAYER" || value === "OWNER" || value === "ADMIN";
}

function payloadUser(payload: JWTPayload): AuthenticatedUser {
  if (typeof payload.userId !== "string" || !isUserRole(payload.role)) {
    throw new AuthError(401, "Invalid authentication token");
  }

  return { userId: payload.userId, role: payload.role };
}

export async function authenticateRequest(
  request: Request
): Promise<AuthenticatedUser> {
  const token = getAccessToken(request);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  if (!token) {
    throw new AuthError(401, "Unauthorized");
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payloadUser(payload);
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError(401, "Invalid or expired session");
  }
}

export function requireRole(
  user: AuthenticatedUser,
  ...roles: UserRole[]
): AuthenticatedUser {
  if (!roles.includes(user.role)) {
    throw new AuthError(403, "Forbidden");
  }
  return user;
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }
  return Response.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}
