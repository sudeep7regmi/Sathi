import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define the exact paths that do not require authentication
const publicRoutes = ["/", "/login", "/register"];
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow Next.js internal files, images, and public static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // 2. Allow public unauthenticated routes
  if (publicRoutes.includes(pathname) || publicApiRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Extract the Access Token Cookie
  const accessToken = request.cookies.get("sathi_access")?.value;

  // 4. Redirect to login if token is missing on a protected route
  if (!accessToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // 5. Verify the token using `jose` for Edge compatibility
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "sathi_core_jwt_access_string_secret_2026_local"
    );
    const { payload } = await jwtVerify(accessToken, secret);

    const userRole = payload.role as string;

    // 6. Enforce Role-Based Access Control (RBAC) Routing Rules
    if (pathname.startsWith("/player") && userRole !== "PLAYER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/owner") && userRole !== "OWNER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Pass the request along if validation succeeds
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    // Token is invalid or expired
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Session expired" },
        { status: 401 }
      );
    }
    // Redirect to login to force a new session
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("sathi_access");
    return response;
  }
}

// Target all routes except standard static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
