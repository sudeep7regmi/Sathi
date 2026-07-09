import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
  if (!tokenMatch) return NextResponse.json({ success: false }, { status: 401 });

  const grounds = await prisma.ground.findMany({
    include: { owner: { select: { futsalName: true, user: { select: { email: true } } } } },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ success: true, grounds }, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const groundId = searchParams.get('id');

  if (!groundId) return NextResponse.json({ success: false }, { status: 400 });

  await prisma.ground.delete({ where: { id: groundId } });
  return NextResponse.json({ success: true, message: 'Arena deleted' }, { status: 200 });
}