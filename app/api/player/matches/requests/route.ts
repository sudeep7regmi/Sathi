import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

// GET: Fetch incoming requests for the organizer
export async function GET(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), 'OWNER');

    // Find requests where the Match Organizer is the current user
    const pendingRequests = await prisma.joinRequest.findMany({
      where: {
        match: { organizerId: auth.userId },
        status: 'PENDING'
      },
      include: {
        player: { select: { fullName: true, preferredPosition: true, skillLevel: true, rating: true } },
        match: { select: { title: true, date: true } }
      }
    });

    return NextResponse.json({ success: true, requests: pendingRequests }, { status: 200 });
  } catch (error: unknown) {
    console.error('[MATCH_REQUESTS_GET_ERROR]', error);
    return authErrorResponse(error);
  }
}

// PUT: Approve or Reject a request
export async function PUT(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), 'OWNER');
    const body = await request.json();
    const { requestId, action } = body; // action will be 'APPROVE' or 'REJECT'
    if (typeof requestId !== 'string' || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid request update' }, { status: 400 });
    }

    const joinRequest = await prisma.joinRequest.findFirst({
      where: { id: requestId, match: { organizerId: auth.userId } },
      select: { id: true, matchId: true, playerId: true, status: true },
    });
    if (!joinRequest) return NextResponse.json({ success: false, message: 'Request not found.' }, { status: 404 });

    if (action === 'REJECT') {
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });
      return NextResponse.json({ success: true, message: 'Request rejected.' }, { status: 200 });
    }

    if (action === 'APPROVE') {
      await prisma.$transaction(async (tx) => {
        const match = await tx.match.findUnique({
          where: { id: joinRequest.matchId },
          select: { playerLimit: true, _count: { select: { participants: true } } },
        });
        if (!match || match._count.participants >= match.playerLimit) {
          throw new Error('MATCH_FULL');
        }
        await tx.joinRequest.update({
          where: { id: requestId },
          data: { status: 'APPROVED' },
        });
        await tx.matchParticipant.create({
          data: { matchId: joinRequest.matchId, playerId: joinRequest.playerId },
        });
      });
      
      return NextResponse.json({ success: true, message: 'Player added to the match.' }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'MATCH_FULL') {
      return NextResponse.json({ success: false, message: 'This match is full.' }, { status: 409 });
    }
    console.error('[MATCH_REQUEST_UPDATE_ERROR]', error);
    return authErrorResponse(error);
  }
}