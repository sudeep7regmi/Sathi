import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/app/services/cloudinary.service';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local'
);

export async function GET() {
  try {
    const grounds = await prisma.ground.findMany({
      include: {
        owner: { select: { futsalName: true, isVerified: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, grounds }, { status: 200 });
  } catch (error) {
    console.error('[GROUNDS_GET_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch grounds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check content-type header
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Invalid Content-Type. Expected multipart/form-data' },
        { status: 400 }
      );
    }

    // Authentication Check
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    // Parse FormData
    const formData = await request.formData();

    const groundId = formData.get('groundId') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;

    // Match exact key 'paymentReceipt'
    const receiptFile = formData.get('paymentReceipt') as File | null;

    if (!groundId || !date || !startTime || !endTime) {
      return NextResponse.json({ success: false, message: 'Missing required booking fields' }, { status: 400 });
    }

    if (!receiptFile || receiptFile.size === 0) {
      return NextResponse.json({ success: false, message: 'Payment receipt screenshot is required' }, { status: 400 });
    }

    const ground = await prisma.ground.findUnique({ where: { id: groundId } });
    if (!ground) {
      return NextResponse.json({ success: false, message: 'Ground not found' }, { status: 404 });
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || durationMinutes <= 0) {
      return NextResponse.json({ success: false, message: 'End time must be strictly after start time' }, { status: 400 });
    }

    // --- Exclusive Slot Overlap Check ---
    const bookingDate = new Date(date);
    const existingOverlap = await prisma.booking.findFirst({
      where: {
        groundId,
        status: { not: 'REJECTED' },
        date: bookingDate,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (existingOverlap) {
      return NextResponse.json(
        { success: false, message: 'This time slot is already booked or pending verification.' },
        { status: 409 }
      );
    }

    const totalCost = (durationMinutes / 60) * ground.pricePerHour;

    // Upload receipt image to Cloudinary
    const uploadResult = await uploadImage(receiptFile, 'sathi_futsal/receipts');

    const booking = await prisma.booking.create({
      data: {
        userId,
        groundId,
        date: bookingDate,
        startTime: start,
        endTime: end,
        duration: durationMinutes,
        totalCost,
        paymentReceiptUrl: uploadResult.url,
        paymentReceiptPublicId: uploadResult.publicId,
        paymentSubmittedAt: new Date(),
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, booking, message: 'Booking request submitted successfully!' }, { status: 201 });
  } catch (error: unknown) {
    console.error('[BOOKING_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to create booking' }, { status: 500 });
  }
}