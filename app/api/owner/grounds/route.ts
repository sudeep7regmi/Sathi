import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'sathi_core_jwt_access_string_secret_2026_local');

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const userId = payload.userId as string;

    const ownerProfile = await prisma.ownerProfile.findUnique({ where: { userId } });
    if (!ownerProfile) return NextResponse.json({ success: false, message: 'Owner profile not found' }, { status: 404 });

    const body = await request.json();
    const { name, address, pricePerHour, amenities, description } = body;

    const newGround = await prisma.ground.create({
      data: {
        ownerId: ownerProfile.id,
        name,
        address,
        pricePerHour: parseFloat(pricePerHour),
        amenities,
        description,
      }
    });

    return NextResponse.json({ success: true, ground: newGround }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: 'Failed to create ground' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/sathi_access=([^;]+)/);
    if (!tokenMatch) return NextResponse.json({ success: false }, { status: 401 });

    const { payload } = await jwtVerify(tokenMatch[1], SECRET_KEY);
    const ownerProfile = await prisma.ownerProfile.findUnique({ where: { userId: payload.userId as string } });
    
    if (!ownerProfile) return NextResponse.json({ success: false }, { status: 404 });

    const grounds = await prisma.ground.findMany({ where: { ownerId: ownerProfile.id } });
    return NextResponse.json({ success: true, grounds }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}