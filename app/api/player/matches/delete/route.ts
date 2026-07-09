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

    const { matchId } = await request.json();

    // Verify ownership before deleting
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ success: false, message: "Match not found" }, { status: 404 });
    }

    if (match.organizerId !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
    }

    // Cascade delete handles relational entries like LiveScore automatically
    await prisma.match.delete({
      where: { id: matchId },
    });

    return NextResponse.json({ success: true, message: "Match scrubbed successfully" }, { status: 200 });
  } catch (error) {
    console.error("[MATCH_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, message: "Server deletion failed" }, { status: 500 });
  }
}