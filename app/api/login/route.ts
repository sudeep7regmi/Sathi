import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth.schema";
import { generateAccessToken, generateRefreshToken } from "@/lib/token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = loginSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, errors: parsedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsedData.data;

    // 1. Verify User Exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3. Generate Tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    // 4. Save refresh token to DB for revocation checks later
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 5. Construct secure response with HttpOnly Cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Authentication successful",
        role: user.role,
      },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("sathi_access", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60, // 15 Minutes
      path: "/",
    });

    response.cookies.set("sathi_refresh", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 Days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
