import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
  if (!tokenMatch) return null;
  try {
    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    return payload.role === 'ADMIN' ? payload.userId as string : null;
  } catch { return null; }
}

export async function GET(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) return NextResponse.json({ success: false }, { status: 401 });

  const users = await prisma.user.findMany({
    where: { id: { not: adminId } }, // Hide the admin from their own deletion list
    select: { id: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, users }, { status: 200 });
}

export async function DELETE(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) return NextResponse.json({ success: false }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true, message: 'User permanently deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}