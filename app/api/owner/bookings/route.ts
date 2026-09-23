import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');


export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const owner = await prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) return NextResponse.json({ success: false }, { status: 404 });

    const bookings = await prisma.booking.findMany({
      where: { ground: { ownerId: owner.id } },
      include: {
        user: { select: { email: true, playerProfile: { select: { fullName: true, phoneNumber: true } } } },
        ground: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = requireRole(await authenticateRequest(request), 'OWNER');
    const body = await request.json();
    const { bookingId, status } = body; // status will be 'APPROVED' or 'REJECTED'
    if (typeof bookingId !== 'string' || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid booking update' }, { status: 400 });
    }

    const owner = await prisma.ownerProfile.findUnique({
      where: { userId: auth.userId },
      select: { id: true },
    });
    if (!owner) return NextResponse.json({ success: false, message: 'Owner profile not found' }, { status: 404 });

    const updatedBooking = await prisma.booking.updateMany({
      where: { id: bookingId, ground: { ownerId: owner.id } },
      data: { status }
    });
    if (updatedBooking.count === 0) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Booking updated' }, { status: 200 });
  } catch (error) {
    console.error('[OWNER_BOOKING_UPDATE_ERROR]', error);
    return authErrorResponse(error);
  }
}