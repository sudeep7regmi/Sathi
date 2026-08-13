import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import {
  uploadImage,
  deleteImage,
} from "@/app/services/cloudinary.service";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "sathi_core_jwt_access_string_secret_2026_local"
);

export async function POST(request: Request) {
  try {
    // 1. AUTHENTICATION
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);

    if (!tokenMatch) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    // 2. FIND PLAYER PROFILE
    const player = await prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, message: "Player profile not found" },
        { status: 404 }
      );
    }

    // 3. READ & VALIDATE FORM DATA
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please select an image file" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image size must be less than 5MB" },
        { status: 400 }
      );
    }

    // 4. UPLOAD NEW IMAGE TO CLOUDINARY
    const uploadResult = await uploadImage(
      file,
      "sathi_futsal/profile-images"
    );

    // Store reference to old public ID before DB mutation
    const oldPublicId = player.profileImagePublicId;

    // 5. UPDATE DATABASE RECORD
    const updatedPlayer = await prisma.playerProfile.update({
      where: { userId },
      data: {
        profileImage: uploadResult.url,
        profileImagePublicId: uploadResult.publicId,
      },
    });

    // 6. CLEAN UP OLD CLOUDINARY ASSET
    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId);
      } catch (deleteError) {
        console.error(
          "[CLOUDINARY_CLEANUP_ERROR] Failed to delete old image:",
          deleteError
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile image updated successfully",
        profileImage: updatedPlayer.profileImage,
        profileImagePublicId: updatedPlayer.profileImagePublicId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PROFILE_IMAGE_UPLOAD_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload profile image" },
      { status: 500 }
    );
  }
}