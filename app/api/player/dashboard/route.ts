import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    
    if (!tokenMatch) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = (payload.userId || payload.id) as string;

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: userId }
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
    }

    // Return the profile data alongside the userId so the frontend can check ownership
    return NextResponse.json({ success: true, profile: { ...profile, userId } }, { status: 200 });

  } catch (error) {
    console.error('[DASHBOARD_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}