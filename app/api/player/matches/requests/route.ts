import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

// GET: Fetch incoming requests for the organizer
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    // Find requests where the Match Organizer is the current user
    const pendingRequests = await prisma.joinRequest.findMany({
      where: {
        match: { organizerId: userId },
        status: 'PENDING'
      },
      include: {
        player: { select: { fullName: true, preferredPosition: true, skillLevel: true, rating: true } },
        match: { select: { title: true, date: true } }
      }
    });

    return NextResponse.json({ success: true, requests: pendingRequests }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: 'Failed to fetch requests.' }, { status: 500 });
  }
}

// PUT: Approve or Reject a request
export async function PUT(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { requestId, action } = body; // action will be 'APPROVE' or 'REJECT'

    const joinRequest = await prisma.joinRequest.findUnique({ where: { id: requestId } });
    if (!joinRequest) return NextResponse.json({ success: false, message: 'Request not found.' }, { status: 404 });

    if (action === 'REJECT') {
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });
      return NextResponse.json({ success: true, message: 'Request rejected.' }, { status: 200 });
    }

    if (action === 'APPROVE') {
      // 1. Update request status
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
      });

      // 2. Add player to the match participants list
      await prisma.matchParticipant.create({
        data: {
          matchId: joinRequest.matchId,
          playerId: joinRequest.playerId
        }
      });
      
      return NextResponse.json({ success: true, message: 'Player added to the match.' }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: 'Failed to process request.' }, { status: 500 });
  }
}