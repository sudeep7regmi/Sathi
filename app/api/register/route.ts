import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  registerPlayerSchema,
  registerOwnerSchema,
} from "@/lib/validation/auth.schema";
import { uploadImage } from "@/app/services/cloudinary.service";

// Defined locally to eliminate dependency on @prisma/client exports
type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PRO" ;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const role = formData.get("role") as string;

    // ============================================
    // PLAYER REGISTRATION
    // ============================================
    if (role === "PLAYER") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const fullName = formData.get("fullName") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const location = formData.get("location") as string;
      const age = Number(formData.get("age"));
      const preferredPosition = formData.get("preferredPosition") as string;
      const skillLevel = formData.get("skillLevel") as string;
      const bio = (formData.get("bio") as string) || "";

      // Accept file under "profileImage", "image", or "avatar"
      const profileImage =
        formData.get("profileImage") ||
        formData.get("image") ||
        formData.get("avatar");

      // Validate Input Fields
      const parsedData = registerPlayerSchema.safeParse({
        role,
        email,
        password,
        fullName,
        phoneNumber,
        location,
        age,
        preferredPosition,
        skillLevel,
        bio,
      });

      if (!parsedData.success) {
        return NextResponse.json(
          {
            success: false,
            errors: parsedData.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      // Check Existing Email
      const existingUser = await prisma.user.findUnique({
        where: { email: parsedData.data.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email is already registered" },
          { status: 409 }
        );
      }

      // Validate Profile Image File
      let imageFile: File | null = null;
      if (profileImage instanceof File && profileImage.size > 0) {
        if (!profileImage.type.startsWith("image/")) {
          return NextResponse.json(
            { success: false, message: "Profile image must be an image file" },
            { status: 400 }
          );
        }
        if (profileImage.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, message: "Profile image must be smaller than 5MB" },
            { status: 400 }
          );
        }
        imageFile = profileImage;
      }

      // Hash Password
      const passwordHash = await bcrypt.hash(parsedData.data.password, 12);

      // Upload Profile Image First if Provided
      let imageUrl: string | null = null;
      let imagePublicId: string | null = null;

      if (imageFile) {
        try {
          const uploadResult = await uploadImage(
            imageFile,
            "sathi_futsal/profile-images"
          );

          imageUrl =
            uploadResult?.url ||
            (uploadResult as unknown as { secureUrl?: string })?.secureUrl ||
            null;

          imagePublicId =
            uploadResult?.publicId ||
            uploadResult?.publicId ||
            null;
        } catch (uploadError) {
          console.error("[REGISTRATION_IMAGE_UPLOAD_ERROR]", uploadError);
        }
      }

      // Create User with playerProfile
      const newUser = await prisma.user.create({
        data: {
          email: parsedData.data.email,
          passwordHash,
          role: "PLAYER",
          playerProfile: {
            create: {
              fullName: parsedData.data.fullName,
              phoneNumber: parsedData.data.phoneNumber,
              location: parsedData.data.location,
              age: parsedData.data.age,
              preferredPosition: parsedData.data.preferredPosition,
              skillLevel: parsedData.data.skillLevel as SkillLevel,
              bio: parsedData.data.bio || "",
              profileImage: imageUrl,
              profileImagePublicId: imagePublicId,
            },
          },
        },
        include: { playerProfile: true },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Player account created successfully",
          userId: newUser.id,
        },
        { status: 201 }
      );
    }

    // ============================================
    // OWNER REGISTRATION
    // ============================================
    if (role === "OWNER") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const fullName = formData.get("fullName") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const futsalName = formData.get("futsalName") as string;
      const futsalLocation = formData.get("futsalLocation") as string;

      const parsedData = registerOwnerSchema.safeParse({
        role,
        email,
        password,
        fullName,
        phoneNumber,
        futsalName,
        futsalLocation,
      });

      if (!parsedData.success) {
        return NextResponse.json(
          {
            success: false,
            errors: parsedData.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: parsedData.data.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email is already registered" },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(parsedData.data.password, 12);

      const newUser = await prisma.user.create({
        data: {
          email: parsedData.data.email,
          passwordHash,
          role: "OWNER",
          ownerProfile: {
            create: {
              fullName: parsedData.data.fullName,
              phoneNumber: parsedData.data.phoneNumber,
              futsalName: parsedData.data.futsalName,
              futsalLocation: parsedData.data.futsalLocation,
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Owner account created successfully",
          userId: newUser.id,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid role specified" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[REGISTER_API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}