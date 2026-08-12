import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groundId: string }> }
) {
  try {
    const { groundId } = await params;

    const bookings = await prisma.booking.findMany({
      where: {
        groundId: groundId,
      },
      select: {
        id: true,
        groundId: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching ground bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ground bookings" },
      { status: 500 }
    );
  }
}