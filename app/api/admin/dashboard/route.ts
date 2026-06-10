import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (payload.role !== 'ADMIN') return NextResponse.json({ success: false }, { status: 403 });

    // Execute dynamic database counts concurrently for speed
    const [totalPlayers, totalOwners, totalMatches, totalGrounds] = await Promise.all([
      prisma.user.count({ where: { role: 'PLAYER' } }),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.match.count(),
      prisma.ground.count()
    ]);

    return NextResponse.json({
      success: true,
      metrics: { totalPlayers, totalOwners, totalMatches, totalGrounds }
    }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: 'Admin API Error' }, { status: 500 });
  }
}