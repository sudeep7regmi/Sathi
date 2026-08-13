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
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = (payload.userId || payload.id) as string;

    const body = await request.json();
    const { matchId, team } = body;

    // Validate payload
    if (!matchId || typeof matchId !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid matchId is required" },
        { status: 400 }
      );
    }

    if (team !== "HOME" && team !== "AWAY") {
      return NextResponse.json(
        { success: false, message: "Team must be either 'HOME' or 'AWAY'" },
        { status: 400 }
      );
    }

    // 1. Verify match existence & organizer permissions
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { organizerId: true },
    });

    if (!match) {
      return NextResponse.json({ success: false, message: "Match not found" }, { status: 404 });
    }

    if (match.organizerId !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
    }

    // 2. Perform atomic upsert to avoid concurrency issues
    const updatedScore = await prisma.liveScore.upsert({
      where: { matchId },
      update: {
        homeScore: team === "HOME" ? { increment: 1 } : undefined,
        awayScore: team === "AWAY" ? { increment: 1 } : undefined,
      },
      create: {
        matchId,
        homeScore: team === "HOME" ? 1 : 0,
        awayScore: team === "AWAY" ? 1 : 0,
        timelineEvents: "[]",
      },
    });

    return NextResponse.json({ success: true, liveScore: updatedScore }, { status: 200 });

  } catch (error) {
    console.error("[CRITICAL_SCORE_ERROR]:", error);
    return NextResponse.json({ success: false, message: "Score update failed" }, { status: 500 });
  }
}