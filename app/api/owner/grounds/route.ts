import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/app/services/cloudinary.service';


const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local'
);

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const ownerProfile = await prisma.ownerProfile.findUnique({ where: { userId } });
    if (!ownerProfile) {
      return NextResponse.json({ success: false, message: 'Owner profile not found' }, { status: 404 });
    }

    // Parse incoming request as FormData instead of JSON
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const pricePerHour = formData.get('pricePerHour') as string;
    const amenities = formData.get('amenities') as string;
    const description = formData.get('description') as string;

    // Optional payment QR image file
    const qrFile = formData.get('paymentQr') as File | null;

    let paymentQrUrl: string | null = null;
    let paymentQrPublicId: string | null = null;

    // Upload to Cloudinary if an image is provided
    if (qrFile && qrFile.size > 0) {
      const uploadResult = await uploadImage(qrFile, 'sathi_futsal/qrcodes');
      paymentQrUrl = uploadResult.url;
      paymentQrPublicId = uploadResult.publicId;
    }

    const newGround = await prisma.ground.create({
      data: {
        ownerId: ownerProfile.id,
        name,
        address,
        pricePerHour: parseFloat(pricePerHour),
        amenities,
        description,
        paymentQrUrl,
        paymentQrPublicId,
      },
    });

    return NextResponse.json({ success: true, ground: newGround }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating ground:', error);
    return NextResponse.json({ success: false, message: 'Failed to create ground' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const ownerProfile = await prisma.ownerProfile.findUnique({
      where: { userId: payload.userId as string },
    });

    if (!ownerProfile) return NextResponse.json({ success: false }, { status: 404 });

    const grounds = await prisma.ground.findMany({ where: { ownerId: ownerProfile.id } });
    return NextResponse.json({ success: true, grounds }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}