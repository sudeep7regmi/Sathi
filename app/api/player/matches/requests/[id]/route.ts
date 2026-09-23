import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const auth = requireRole(await authenticateRequest(request), 'PLAYER');
    const player = await prisma.playerProfile.findUnique({
      where: { userId: auth.userId },
      select: { id: true },
    });
    if (!player) return NextResponse.json({ success: false, message: 'Player profile not found' }, { status: 404 });

    const existingRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    if (existingRequest.playerId !== player.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await prisma.joinRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json(
      { success: true, message: 'Request withdrawn successfully.' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting request:', error);
    return authErrorResponse(error);
  }
}