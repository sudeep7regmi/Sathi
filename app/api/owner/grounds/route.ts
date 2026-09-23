import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/app/services/cloudinary.service';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';


export async function POST(request: Request) {
  try {
    const { userId } = requireRole(await authenticateRequest(request), 'OWNER');

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
    return authErrorResponse(error);
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = requireRole(await authenticateRequest(request), 'OWNER');
    const ownerProfile = await prisma.ownerProfile.findUnique({
      where: { userId },
    });

    if (!ownerProfile) return NextResponse.json({ success: false }, { status: 404 });

    const grounds = await prisma.ground.findMany({ where: { ownerId: ownerProfile.id } });
    return NextResponse.json({ success: true, grounds }, { status: 200 });
  } catch (error) {
    return authErrorResponse(error);
  }
}