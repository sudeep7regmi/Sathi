import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImage, deleteImage } from '@/app/services/cloudinary.service';
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

// Helper function to handle authentication and profile verification
async function authenticateOwner(request: Request) {
  try {
    const { userId } = requireRole(await authenticateRequest(request), 'OWNER');

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
    requireRole(await authenticateRequest(request), 'OWNER');
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
    return authErrorResponse(error);
  }
}

// PUT /api/owner/grounds/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(await authenticateRequest(request), 'OWNER');
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
    return authErrorResponse(error);
  }
}

// DELETE /api/owner/grounds/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(await authenticateRequest(request), 'OWNER');
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
    return authErrorResponse(error);
  }
}