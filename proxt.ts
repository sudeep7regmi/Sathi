import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {

  const token = request.cookies.get("token")?.value;

  // No token
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {

    // Verify JWT
    jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    return NextResponse.next();

  } catch (error) {

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};