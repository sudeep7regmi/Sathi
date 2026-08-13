import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Token and new password are required.",
        },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // Hash the token received from the URL.
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token that has not expired.
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,

        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    // Hash the new password.
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password and invalidate reset token.
    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash: hashedPassword,

        resetToken: null,

        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Password successfully updated.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}