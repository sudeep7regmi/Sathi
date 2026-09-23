import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest, authErrorResponse, requireRole } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), "PLAYER", "OWNER");

    const { matchId } = await request.json();

    // Verify ownership before deleting
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ success: false, message: "Match not found" }, { status: 404 });
    }

    if (match.organizerId !== auth.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
    }

    // Cascade delete handles relational entries like LiveScore automatically
    await prisma.match.delete({
      where: { id: matchId },
    });

    return NextResponse.json({ success: true, message: "Match scrubbed successfully" }, { status: 200 });
  } catch (error) {
    console.error("[MATCH_DELETE_ERROR]", error);
    return authErrorResponse(error);
  }
}