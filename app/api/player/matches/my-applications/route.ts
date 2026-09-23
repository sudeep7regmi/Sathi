import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

// Explicit interface matching the exact query structure
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
    startTime: Date | string;
    endTime: Date | string;
    matchType: string;
    status: string;
    organizer?: {
      id: string;
      email: string;
      playerProfile?: {
        fullName: string;
      } | null;
    } | null;
  };
}

export async function GET(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), 'PLAYER');

    // 1. Get the player's PlayerProfile ID from their User ID
    const playerProfile = await prisma.playerProfile.findUnique({
      where: { userId: auth.userId },
      select: { id: true },
    });

    if (!playerProfile) {
      return NextResponse.json({ success: true, applications: [] }, { status: 200 });
    }

    // 2. Query joinRequests using playerProfile.id
    const myApplications = (await prisma.joinRequest.findMany({
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
    })) as unknown as ApplicationItem[];

    // 3. Format response to flatten organizer name
    const formattedApplications = myApplications.map((app: ApplicationItem) => ({
      ...app,
      match: {
        ...app.match,
        startTime: app.match.startTime ? app.match.startTime.toString() : '',
        endTime: app.match.endTime ? app.match.endTime.toString() : '',
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
    return authErrorResponse(error);
  }
}