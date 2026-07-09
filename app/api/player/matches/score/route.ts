import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "sathi_core_jwt_access_string_secret_2026_local"
);

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    
    if (!tokenMatch) {
      return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    // SAFEGUARD: Accommodate both common JWT payload structures
    const userId = (payload.userId || payload.id) as string;

    const { matchId, team } = await request.json(); 

    // 1. Verify match and organizer identity
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { liveScore: true }, 
    });

    if (!match) {
      return NextResponse.json({ success: false, message: "Match not found" }, { status: 404 });
    }
    
    if (match.organizerId !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
    }

    // 2. Calculate new score securely
    const currentHome = match.liveScore?.homeScore || 0;
    const currentAway = match.liveScore?.awayScore || 0;

    // 3. Update or Create the Score safely
    const updatedScore = await prisma.liveScore.upsert({
      where: { matchId: matchId },
      update: {
        homeScore: team === "HOME" ? currentHome + 1 : currentHome,
        awayScore: team === "AWAY" ? currentAway + 1 : currentAway,
      },
      create: {
        // We only use the scalar ID here. No "connect" object!
        matchId: matchId, 
        homeScore: team === "HOME" ? 1 : 0,
        awayScore: team === "AWAY" ? 1 : 0,
        timelineEvents: "[]", 
      },
    });

    return NextResponse.json({ success: true, liveScore: updatedScore }, { status: 200 });
    
  } catch (error) {
    // CRITICAL: We actually log the error now so it doesn't fail silently!
    console.error("[CRITICAL_SCORE_ERROR]:", error);
    return NextResponse.json({ success: false, message: "Score update failed" }, { status: 500 });
  }
}