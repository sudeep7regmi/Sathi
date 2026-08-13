// actions/booking.action.ts
"use server";

import { prisma } from "@/lib/prisma";
import { deleteImage, uploadImage } from "../services/cloudinary.service";


interface CreateBookingInput {
  userId: string;
  groundId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  totalCost: number;
}

/**
 * 1. PLAYER: Create Booking and Upload Payment Receipt
 */
export async function createBookingWithPayment(
  bookingData: CreateBookingInput,
  formData: FormData
) {
  try {
    const file = formData.get("receipt") as File | null;

    if (!file || file.size === 0) {
      return { success: false, error: "Payment receipt image is required." };
    }

    // Upload receipt screenshot to Cloudinary
    const uploadResult = await uploadImage(file, "sathi_futsal/receipts");

    // Create booking record with PENDING status
    const booking = await prisma.booking.create({
      data: {
        userId: bookingData.userId,
        groundId: bookingData.groundId,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration: bookingData.duration,
        totalCost: bookingData.totalCost,
        paymentReceiptUrl: uploadResult.url,
        paymentReceiptPublicId: uploadResult.publicId,
        paymentSubmittedAt: new Date(),
        status: "PENDING",
      },
    });

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to submit booking payment." };
  }
}

/**
 * 2. OWNER: Verify or Reject Player's Payment
 */
export async function verifyBookingPayment(
  bookingId: string,
  action: "APPROVE" | "REJECT"
) {
  try {
    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        paymentVerifiedAt: action === "APPROVE" ? new Date() : null,
      },
    });

    return {
      success: true,
      data: updatedBooking,
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error: "Failed to update payment status." };
  }
}

/**
 * 3. PLAYER / OWNER: Cancel Booking & Clean Up Cloudinary Image
 */
export async function cancelBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { paymentReceiptPublicId: true },
    });

    if (!booking) {
      return { success: false, error: "Booking not found." };
    }

    // Remove receipt image from Cloudinary if present
    if (booking.paymentReceiptPublicId) {
      await deleteImage(booking.paymentReceiptPublicId);
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        paymentReceiptUrl: null,
        paymentReceiptPublicId: null,
      },
    });

    return { success: true, data: cancelledBooking };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { success: false, error: "Failed to cancel booking." };
  }
}