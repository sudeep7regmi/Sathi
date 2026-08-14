import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

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
    const body = await request.json();
    const { bookingId, status } = body; // status will be 'APPROVED' or 'REJECTED'

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    return NextResponse.json({ success: true, booking: updatedBooking }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}