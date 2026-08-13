// actions/ground.action.ts
"use server";

import { prisma } from "@/lib/prisma"; // Adjust import path to your prisma instance
import { deleteImage, uploadImage } from "../services/cloudinary.service";


export async function uploadGroundPaymentQr(groundId: string, formData: FormData) {
  try {
    const file = formData.get("qrCode") as File | null;

    if (!file || file.size === 0) {
      return { success: false, error: "Please select an image file to upload." };
    }

    // 1. Check if ground exists
    const ground = await prisma.ground.findUnique({
      where: { id: groundId },
      select: { paymentQrPublicId: true },
    });

    if (!ground) {
      return { success: false, error: "Ground not found." };
    }

    // 2. Delete old QR code from Cloudinary if it exists
    if (ground.paymentQrPublicId) {
      await deleteImage(ground.paymentQrPublicId);
    }

    // 3. Upload new QR image using your service
    const uploadResult = await uploadImage(file, "sathi_futsal/qrcodes");

    // 4. Update ground in database
    const updatedGround = await prisma.ground.update({
      where: { id: groundId },
      data: {
        paymentQrUrl: uploadResult.url,
        paymentQrPublicId: uploadResult.publicId,
      },
    });

    return {
      success: true,
      data: {
        paymentQrUrl: updatedGround.paymentQrUrl,
        paymentQrPublicId: updatedGround.paymentQrPublicId,
      },
    };
  } catch (error) {
    console.error("Error uploading payment QR code:", error);
    return { success: false, error: "Failed to upload payment QR code." };
  }
}