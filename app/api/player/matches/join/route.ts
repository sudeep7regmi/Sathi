import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), 'PLAYER');

    const { matchId } = await request.json();

    // 1. Get the player's profile ID
    const playerProfile = await prisma.playerProfile.findUnique({ where: { userId: auth.userId } });
    if (!playerProfile) {
      return NextResponse.json({ success: false, message: 'Player profile not found.' }, { status: 404 });
    }

    // 2. Prevent the match organizer from joining their own match as a participant via request
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return NextResponse.json({ success: false, message: 'Match not found.' }, { status: 404 });
    if (match.organizerId === auth.userId) {
      return NextResponse.json({ success: false, message: 'You are the organizer of this match.' }, { status: 400 });
    }

    // 3. Check if a request already exists
    const existingRequest = await prisma.joinRequest.findUnique({
      where: { matchId_playerId: { matchId, playerId: playerProfile.id } }
    });

    if (existingRequest) {
      return NextResponse.json({ success: false, message: 'You have already sent a request for this match.' }, { status: 400 });
    }

    // 4. Create the pending join request
    await prisma.joinRequest.create({
      data: {
        matchId,
        playerId: playerProfile.id,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, message: 'Join request sent successfully.' }, { status: 201 });
  } catch (error: unknown) {
    console.error('[JOIN_MATCH_ERROR]', error);
    return authErrorResponse(error);
  }
}