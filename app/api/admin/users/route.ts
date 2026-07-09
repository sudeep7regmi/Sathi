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
    where: { id: { not: adminId } }, 
    // Added isVerified to the select payload
    select: { id: true, email: true, role: true, isVerified: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, users }, { status: 200 });
}

// NEW: PATCH method to handle the verification toggle
export async function PATCH(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { userId, isVerified } = await request.json();

    // 1. Update the root User account
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified }
    });

    // 2. If it's an Owner, also update their OwnerProfile status so grounds show as verified
    if (updatedUser.role === 'OWNER') {
      await prisma.ownerProfile.updateMany({
        where: { userId: userId },
        data: { isVerified }
      });
    }

    return NextResponse.json({ success: true, isVerified }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update verification status' }, { status: 500 });
  }
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