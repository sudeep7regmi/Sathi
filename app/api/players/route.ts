import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { fullName: { contains: search } },
            { preferredPosition: { contains: search } },
            { user: { email: { contains: search } } },
          ],
        }
      : {};

    const [players, total] = await Promise.all([
      prisma.playerProfile.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              isVerified: true,
            },
          },
        },
        orderBy: {
          fullName: "asc",
        },
      }),
      prisma.playerProfile.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      success: true,
      players,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Player search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search players" },
      { status: 500 }
    );
  }
}