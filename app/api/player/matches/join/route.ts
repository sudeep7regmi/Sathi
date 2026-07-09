import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const { matchId } = await request.json();

    // 1. Get the player's profile ID
    const playerProfile = await prisma.playerProfile.findUnique({ where: { userId } });
    if (!playerProfile) {
      return NextResponse.json({ success: false, message: 'Player profile not found.' }, { status: 404 });
    }

    // 2. Prevent the match organizer from joining their own match as a participant via request
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return NextResponse.json({ success: false, message: 'Match not found.' }, { status: 404 });
    if (match.organizerId === userId) {
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
    return NextResponse.json({ success: false, message: 'Failed to send join request.' }, { status: 500 });
  }
}