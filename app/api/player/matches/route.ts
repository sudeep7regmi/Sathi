import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const body = await request.json();
    
    // Create match and instantly add the creator as a participant
    const newMatch = await prisma.match.create({
      data: {
        organizerId: userId,
        title: body.title,
        location: body.location,
        date: new Date(body.date),
        startTime: new Date(`${body.date}T${body.startTime}:00`),
        endTime: new Date(`${body.date}T${body.endTime}:00`),
        playerLimit: parseInt(body.playerLimit),
        matchType: body.matchType,
        skillReq: body.skillReq,
        status: 'UPCOMING',
      }
    });

    return NextResponse.json({ success: true, match: newMatch }, { status: 201 });
  } catch (error: unknown) {
    // ADD THIS CONSOLE LOG:
    console.error('[MATCH_CREATE_ERROR]', error); 
    return NextResponse.json({ success: false, message: 'Failed to create match' }, { status: 500 });
  }
}


export async function GET() {
  // Public route to fetch all upcoming matches for matchmaking
  try {
    const matches = await prisma.match.findMany({
      where: { status: 'UPCOMING' },
      include: { organizer: { select: { email: true } } },
      orderBy: { date: 'asc' }
    });
    return NextResponse.json({ success: true, matches }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}