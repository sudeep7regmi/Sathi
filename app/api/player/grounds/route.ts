import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/app/services/cloudinary.service';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

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
    const auth = requireRole(await authenticateRequest(request), 'PLAYER');
    // Check content-type header
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Invalid Content-Type. Expected multipart/form-data' },
        { status: 400 }
      );
    }

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

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const durationMinutes = (end.getTime() - start.getTime()) / 60000;

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      durationMinutes <= 0 ||
      durationMinutes > 24 * 60
    ) {
      return NextResponse.json({ success: false, message: 'End time must be strictly after start time' }, { status: 400 });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid booking date' }, { status: 400 });
    }

    const uploadResult = await uploadImage(receiptFile, 'sathi_futsal/receipts');
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
          paymentReceiptUrl: uploadResult.url,
          paymentReceiptPublicId: uploadResult.publicId,
          paymentSubmittedAt: new Date(),
          status: 'PENDING',
        },
      });
    });

    return NextResponse.json({ success: true, booking, message: 'Booking request submitted successfully!' }, { status: 201 });
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