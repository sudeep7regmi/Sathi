import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "sathi_core_jwt_access_string_secret_2026_local"
);

type BookingData = {
  totalCost: number | string | bigint;
  status: string;
};

type GroundData = {
  id: string;
  name: string;
  pricePerHour: number | string | bigint;
  bookings: BookingData[];
};

type OwnerData = {
  futsalName: string;
  futsalLocation: string;
  isVerified: boolean;
  grounds: GroundData[];
};

export async function GET(request: Request) {
  try {
    // --------------------------------------------------
    // 1. Get authentication token
    // --------------------------------------------------

    const cookieHeader = request.headers.get("cookie") || "";

    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);

    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------
    // 2. Verify JWT
    // --------------------------------------------------

    const { payload } = await jwtVerify(token, SECRET_KEY);

    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token",
        },
        {
          status: 401,
        }
      );
    }

    // --------------------------------------------------
    // 3. Get owner data
    // --------------------------------------------------

    const ownerData = (await prisma.ownerProfile.findUnique({
      where: {
        userId,
      },

      include: {
        grounds: {
          include: {
            bookings: {
              where: {
                status: "COMPLETED",
              },
            },
          },
        },
      },
    })) as OwnerData | null;

    // --------------------------------------------------
    // 4. Check owner profile
    // --------------------------------------------------

    if (!ownerData) {
      return NextResponse.json(
        {
          success: false,
          message: "Owner profile not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------
    // 5. Calculate dashboard metrics
    // --------------------------------------------------

    const totalGrounds = ownerData.grounds.length;

    let totalRevenue = 0;

    let totalCompletedBookings = 0;

    ownerData.grounds.forEach((ground: GroundData) => {
      totalCompletedBookings += ground.bookings.length;

      ground.bookings.forEach((booking: BookingData) => {
        totalRevenue += Number(booking.totalCost);
      });
    });

    // --------------------------------------------------
    // 6. Prepare ground information
    // --------------------------------------------------

    const grounds = ownerData.grounds.map((ground: GroundData) => ({
      id: ground.id,
      name: ground.name,
      pricePerHour: Number(ground.pricePerHour),
    }));

    // --------------------------------------------------
    // 7. Return dashboard data
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        profile: {
          futsalName: ownerData.futsalName,
          futsalLocation: ownerData.futsalLocation,
          isVerified: ownerData.isVerified,
        },

        metrics: {
          totalGrounds,
          totalRevenue,
          totalCompletedBookings,
        },

        grounds,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("[OWNER_API_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error loading owner data",
      },
      {
        status: 500,
      }
    );
  }
}