import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local'
);

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await params;
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const existingRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    if (existingRequest.playerId !== userId) {
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
    return NextResponse.json(
      { success: false, message: 'Failed to withdraw application.' },
      { status: 500 }
    );
  }
}