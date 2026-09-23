import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    requireRole(await authenticateRequest(request), 'ADMIN');
    const grounds = await prisma.ground.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        pricePerHour: true,
        createdAt: true,
        owner: { select: { futsalName: true, user: { select: { email: true } } } },
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, grounds }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN_GROUNDS_GET_ERROR]', error);
    return authErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    requireRole(await authenticateRequest(request), 'ADMIN');
    const { searchParams } = new URL(request.url);
    const groundId = searchParams.get('id');
    if (!groundId) return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
    await prisma.ground.delete({ where: { id: groundId } });
    return NextResponse.json({ success: true, message: 'Arena deleted' }, { status: 200 });
  } catch (error) {
    console.error('[ADMIN_GROUND_DELETE_ERROR]', error);
    return authErrorResponse(error);
  }
}