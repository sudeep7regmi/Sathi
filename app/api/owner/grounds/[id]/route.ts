import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { uploadImage, deleteImage } from '@/app/services/cloudinary.service';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local'
);

// Helper function to handle authentication and profile verification
async function authenticateOwner(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
  if (!tokenMatch) return null;

  try {
    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const ownerProfile = await prisma.ownerProfile.findUnique({ where: { userId } });
    return ownerProfile;
  } catch (error) {
    return null;
  }
}

// GET /api/owner/grounds/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groundId } = await params;
    const ownerProfile = await authenticateOwner(request);

    if (!ownerProfile) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
    });

    if (!ground) {
      return NextResponse.json({ success: false, message: 'Ground not found' }, { status: 404 });
    }

    if (ground.ownerId !== ownerProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, ground }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ground:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch ground' }, { status: 500 });
  }
}

// PUT /api/owner/grounds/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groundId } = await params;
    const ownerProfile = await authenticateOwner(request);

    if (!ownerProfile) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const existingGround = await prisma.ground.findUnique({
      where: { id: groundId },
    });

    if (!existingGround) {
      return NextResponse.json({ success: false, message: 'Ground not found' }, { status: 404 });
    }

    if (existingGround.ownerId !== ownerProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const pricePerHour = formData.get('pricePerHour') as string;
    const amenities = formData.get('amenities') as string;
    const description = formData.get('description') as string;
    const qrFile = formData.get('paymentQr') as File | null;

    let paymentQrUrl = existingGround.paymentQrUrl;
    let paymentQrPublicId = existingGround.paymentQrPublicId;

    // Handle optional file replacement
    if (qrFile && qrFile.size > 0) {
      if (existingGround.paymentQrPublicId) {
        try {
          await deleteImage(existingGround.paymentQrPublicId);
        } catch (cloudinaryErr) {
          console.error('Failed to remove old image from Cloudinary:', cloudinaryErr);
        }
      }

      const uploadResult = await uploadImage(qrFile, 'sathi_futsal/qrcodes');
      paymentQrUrl = uploadResult.url;
      paymentQrPublicId = uploadResult.publicId;
    }

    const updatedGround = await prisma.ground.update({
      where: { id: groundId },
      data: {
        name,
        address,
        pricePerHour: parseFloat(pricePerHour),
        amenities,
        description,
        paymentQrUrl,
        paymentQrPublicId,
      },
    });

    return NextResponse.json({ success: true, ground: updatedGround }, { status: 200 });
  } catch (error) {
    console.error('Error updating ground:', error);
    return NextResponse.json({ success: false, message: 'Failed to update ground' }, { status: 500 });
  }
}

// DELETE /api/owner/grounds/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groundId } = await params;
    const ownerProfile = await authenticateOwner(request);

    if (!ownerProfile) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
    });

    if (!ground) {
      return NextResponse.json({ success: false, message: 'Ground not found' }, { status: 404 });
    }

    if (ground.ownerId !== ownerProfile.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You do not own this ground' },
        { status: 403 }
      );
    }

    if (ground.paymentQrPublicId) {
      try {
        await deleteImage(ground.paymentQrPublicId);
      } catch (cloudinaryErr) {
        console.error('Failed to remove image from Cloudinary:', cloudinaryErr);
      }
    }

    await prisma.ground.delete({
      where: { id: groundId },
    });

    return NextResponse.json(
      { success: true, message: 'Ground deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting ground:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete ground' },
      { status: 500 }
    );
  }
}