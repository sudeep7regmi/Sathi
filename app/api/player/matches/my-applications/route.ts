import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local'
);

// Explicit interface for the application object from Prisma query
interface ApplicationItem {
  id: string;
  createdAt: Date | string;
  playerId: string;
  matchId: string;
  status: string;
  match: {
    id: string;
    title: string;
    date: Date | string;
    location: string;
    startTime: string;
    endTime: string;
    matchType: string;
    status: string;
    organizer: {
      id: string;
      email: string;
      playerProfile?: {
        fullName: string;
      } | null;
    };
  };
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    // 1. Get the player's PlayerProfile ID from their User ID
    const playerProfile = await prisma.playerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!playerProfile) {
      return NextResponse.json({ success: true, applications: [] }, { status: 200 });
    }

    // 2. Query joinRequests using playerProfile.id
    const myApplications = await prisma.joinRequest.findMany({
      where: {
        playerId: playerProfile.id,
      },
      include: {
        match: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            startTime: true,
            endTime: true,
            matchType: true,
            status: true,
            organizer: {
              select: {
                id: true,
                email: true,
                playerProfile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Format response to flatten organizer name (Explicitly type 'app')
    const formattedApplications = myApplications.map((app) => ({
      ...app,
      match: {
        ...app.match,
        startTime: app.match.startTime.toString(),
        endTime: app.match.endTime.toString(),
        organizer: {
          fullName:
            app.match.organizer?.playerProfile?.fullName ||
            app.match.organizer?.email ||
            'Match Organizer',
        },
      },
    }));

    return NextResponse.json(
      { success: true, applications: formattedApplications },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching player applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications.' },
      { status: 500 }
    );
  }
}