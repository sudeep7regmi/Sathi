import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "sathi_core_jwt_access_string_secret_2026_local"
);

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);

    if (!tokenMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);

    const userId = (payload.userId || payload.id) as string;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    // Fetch user with playerProfile from MySQL
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        playerProfile: true,
      },
    });

    if (!user || !user.playerProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Player profile not found",
        },
        { status: 404 }
      );
    }

    // Fetch player's bookings from MySQL
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        ground: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const profile = user.playerProfile;

    return NextResponse.json(
      {
        success: true,
        profile: {
          ...profile,
          fullName: profile.fullName || "Player",
          profileImage: profile.profileImage || "",
          userId,
        },
        bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DASHBOARD_GET_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}