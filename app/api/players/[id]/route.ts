import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const player = await prisma.playerProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        preferredPosition: true,
        skillLevel: true,
        goals: true,
        assists: true,
        matchesPlayed: true,
        wins: true,
        losses: true,
        user: {
          select: {
            email: true,
            isVerified: true,
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, player });
  } catch (error) {
    console.error('Failed to fetch player details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}