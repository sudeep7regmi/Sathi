import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "sathi_core_jwt_access_string_secret_2026_local"
);

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
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);

    if (!tokenMatch) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = (payload.userId || payload.id) as string;

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
        organizerId: userId,
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
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}