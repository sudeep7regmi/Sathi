import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function GET(request: Request) {
  try {
    // 1. Grab tokens from the inbound request context
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized session identity missing' }, { status: 401 });
    }

    // 2. Decode user verification keys from payload signature
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = payload.userId as string;

    // 3. Select dynamic statistics models mapping fields inside profile databases
    const profileData = await prisma.playerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    if (!profileData) {
      return NextResponse.json({ success: false, message: 'Profile data record missing mapping layout parameters' }, { status: 404 });
    }

    // 4. Gather matches scheduled that the user joined
    const upcomingMatches = await prisma.matchParticipant.findMany({
      where: { playerId: profileData.id },
      include: {
        match: {
          include: {
            ground: { select: { name: true, address: true } }
          }
        }
      },
      take: 5
    });

    return NextResponse.json({
      success: true,
      profile: profileData,
      matches: upcomingMatches.map(p => p.match)
    }, { status: 200 });

  } catch (error) {
    console.error('[PLAYER_DASHBOARD_API_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error fetching player statistics logs' }, { status: 500 });
  }
}