import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest, authErrorResponse, requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      where: { status: "UPCOMING" },
      include: {
        liveScore: true,
        organizer: {
          select: {
            email: true,
            playerProfile: { select: { fullName: true } },
          },
        },
        joinRequests: true,
      },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ success: true, matches }, { status: 200 });
  } catch (error) {
    console.error("[MATCH_GET_ERROR]", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), "PLAYER", "OWNER");

    const body = await request.json();
    const { title, location, date, startTime, endTime, playerLimit, matchType, skillReq } = body;

    if (!title || !location || !date) {
      return NextResponse.json(
        { success: false, message: "Title, location, and date are required." },
        { status: 400 }
      );
    }

    const newMatch = await prisma.match.create({
      data: {
        organizerId: auth.userId,
        title,
        location,
        date: new Date(date),
        ...(startTime && { startTime: new Date(`${date}T${startTime}`) }),
        ...(endTime && { endTime: new Date(`${date}T${endTime}`) }),
        playerLimit: parseInt(playerLimit || "10", 10),
        matchType: matchType || "5v5",
        skillReq: skillReq || "INTERMEDIATE",
        status: "UPCOMING",
      },
      include: {
        liveScore: true,
      },
    });

    return NextResponse.json({ success: true, match: newMatch }, { status: 201 });
  } catch (error) {
    console.error("[MATCH_CREATE_ERROR]", error);
    return authErrorResponse(error);
  }
}