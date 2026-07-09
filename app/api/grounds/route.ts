import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function GET() {
  try {
    // Publicly fetch all grounds including their owner's futsal name
    const grounds = await prisma.ground.findMany({
      include: {
        owner: { select: { futsalName: true, isVerified: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, grounds }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch grounds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const body = await request.json();
    const { groundId, date, startTime, endTime } = body;

    // 1. Fetch the ground to securely check the price
    const ground = await prisma.ground.findUnique({ where: { id: groundId } });
    if (!ground) return NextResponse.json({ success: false, message: 'Ground not found' }, { status: 404 });

    // 2. Calculate duration in minutes and total cost securely on the server
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;
    
    if (durationMinutes <= 0) {
      return NextResponse.json({ success: false, message: 'End time must be after start time' }, { status: 400 });
    }

    const totalCost = (durationMinutes / 60) * ground.pricePerHour;

    // 3. Create the booking record
    const booking = await prisma.booking.create({
      data: {
        userId,
        groundId,
        date: new Date(date),
        startTime: start,
        endTime: end,
        duration: durationMinutes,
        totalCost,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, booking, message: 'Booking request sent!' }, { status: 201 });
  } catch (error: unknown) {
    console.error('[BOOKING_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to create booking' }, { status: 500 });
  }
}
