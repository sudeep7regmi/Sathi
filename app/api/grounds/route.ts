import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

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
    const auth = requireRole(await authenticateRequest(request), 'PLAYER');

    const body = await request.json();
    const { groundId, date, startTime, endTime } = body;

    // 1. Fetch the ground to securely check the price
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || durationMinutes <= 0 || durationMinutes > 24 * 60) {
      return NextResponse.json({ success: false, message: 'End time must be after start time' }, { status: 400 });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid booking date' }, { status: 400 });
    }

    const booking = await prisma.$transaction(async (tx) => {
      const ground = await tx.ground.findUnique({ where: { id: groundId } });
      if (!ground) throw new Error('GROUND_NOT_FOUND');
      await tx.$queryRaw`SELECT id FROM Ground WHERE id = ${groundId} FOR UPDATE`;
      const existingOverlap = await tx.booking.findFirst({
        where: {
          groundId,
          status: { notIn: ['REJECTED', 'CANCELLED'] },
          date: bookingDate,
          startTime: { lt: end },
          endTime: { gt: start },
        },
        select: { id: true },
      });
      if (existingOverlap) throw new Error('BOOKING_CONFLICT');
      return tx.booking.create({
        data: {
          userId: auth.userId,
          groundId,
          date: bookingDate,
          startTime: start,
          endTime: end,
          duration: durationMinutes,
          totalCost: (durationMinutes / 60) * ground.pricePerHour,
          status: 'PENDING',
        },
      });
    });

    return NextResponse.json({ success: true, booking, message: 'Booking request sent!' }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'GROUND_NOT_FOUND') {
      return NextResponse.json({ success: false, message: 'Ground not found' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'BOOKING_CONFLICT') {
      return NextResponse.json({ success: false, message: 'This time slot is already booked or pending verification.' }, { status: 409 });
    }
    console.error('[BOOKING_ERROR]', error);
    return authErrorResponse(error);
  }
}
