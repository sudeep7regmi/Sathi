import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest, authErrorResponse, requireRole } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groundId: string }> }
) {
  try {
    requireRole(await authenticateRequest(req), "PLAYER", "OWNER");
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
    return authErrorResponse(error);
  }
}