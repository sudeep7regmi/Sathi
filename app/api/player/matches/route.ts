import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "sathi_core_jwt_access_string_secret_2026_local"
);
// Inside app/api/player/matches/route.ts

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
      console.error("[SCORE_ERROR] No auth token found.");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);

    // SAFEGUARD: Check both common JWT key structures
    const userId = (payload.userId || payload.id) as string;

    const { matchId, team } = await request.json();

    // 1. Fetch the match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { liveScore: true },
    });

    if (!match) {
      console.error(`[SCORE_ERROR] Match ID ${matchId} not found in database.`);
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      );
    }

    // 2. Verify identity
    if (match.organizerId !== userId) {
      console.error(
        `[SCORE_ERROR] Security blocked update. Organizer is ${match.organizerId}, but requester is ${userId}`
      );
      return NextResponse.json(
        { success: false, message: "Unauthorized action" },
        { status: 403 }
      );
    }

    // 3. Update or Create Score
    const currentHome = match.liveScore?.homeScore || 0;
    const currentAway = match.liveScore?.awayScore || 0;

    let updatedScore;

    if (match.liveScore) {
      // If score exists, just update the numbers
      updatedScore = await prisma.liveScore.update({
        where: { matchId: matchId },
        data: {
          homeScore: team === "HOME" ? currentHome + 1 : currentHome,
          awayScore: team === "AWAY" ? currentAway + 1 : currentAway,
        },
      });
    } else {
      // If this is the FIRST goal, create the score record
      updatedScore = await prisma.liveScore.create({
        data: {
          matchId: matchId,
          homeScore: team === "HOME" ? 1 : 0,
          awayScore: team === "AWAY" ? 1 : 0,
          timelineEvents: "[]", // <--- THE FIX: Give the required field an empty array!
        },
      });
    }

    return NextResponse.json(
      { success: true, liveScore: updatedScore },
      { status: 200 }
    );
  } catch (error) {
    // CRITICAL: This will print the EXACT database or server error to your VS Code terminal!
    console.error("[CRITICAL_SCORE_API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
