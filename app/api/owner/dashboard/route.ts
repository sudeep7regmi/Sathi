import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function GET(request: Request) {
  try {
    // 1. Extract and Verify Token
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = payload.userId as string;

    // 2. Dynamically fetch Owner Profile WITH their specific Grounds and Bookings
    const ownerData = await prisma.ownerProfile.findUnique({
      where: { userId },
      include: {
        grounds: {
          include: {
            bookings: {
              where: { status: 'COMPLETED' } // Only count completed revenue
            }
          }
        }
      }
    });

    if (!ownerData) {
      return NextResponse.json({ success: false, message: 'Owner profile not found' }, { status: 404 });
    }

    // 3. Dynamically calculate business metrics
    const totalGrounds = ownerData.grounds.length;
    let totalRevenue = 0;
    let totalCompletedBookings = 0;

    ownerData.grounds.forEach(ground => {
      totalCompletedBookings += ground.bookings.length;
      ground.bookings.forEach(booking => {
        totalRevenue += booking.totalCost;
      });
    });

    return NextResponse.json({
      success: true,
      profile: {
        futsalName: ownerData.futsalName,
        futsalLocation: ownerData.futsalLocation,
        isVerified: ownerData.isVerified,
      },
      metrics: {
        totalGrounds,
        totalRevenue,
        totalCompletedBookings,
      },
      grounds: ownerData.grounds.map(g => ({
        id: g.id,
        name: g.name,
        pricePerHour: g.pricePerHour
      }))
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('[OWNER_API_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Server error loading owner data' }, { status: 500 });
  }
}