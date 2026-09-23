import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import based on your prisma setup location
import { authenticateRequest, authErrorResponse, requireRole } from '@/lib/auth';

// GET single user and player profile
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(await authenticateRequest(req), 'ADMIN');
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        playerProfile: true,
        ownerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return authErrorResponse(error);
  }
}

// PATCH update user and player profile stats
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireRole(await authenticateRequest(req), 'ADMIN');
    const { id } = await params;
    const body = await req.json();

    const {
      role,
      isVerified,
      // Player Profile Stats
      fullName,
      phoneNumber,
      preferredPosition,
      skillLevel,
      goals,
      assists,
      matchesPlayed,
      wins,
      losses,
    } = body;

    // Update User core fields
    await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(typeof isVerified === 'boolean' && { isVerified }),
        playerProfile: {
          upsert: {
            create: {
              fullName: fullName || 'Player',
              phoneNumber: phoneNumber || '',
              location: 'Nepal',
              age: 18,
              preferredPosition: preferredPosition || 'Forward',
              skillLevel: skillLevel || 'BEGINNER',
              goals: Number(goals) || 0,
              assists: Number(assists) || 0,
              matchesPlayed: Number(matchesPlayed) || 0,
              wins: Number(wins) || 0,
              losses: Number(losses) || 0,
            },
            update: {
              ...(fullName !== undefined && { fullName }),
              ...(phoneNumber !== undefined && { phoneNumber }),
              ...(preferredPosition !== undefined && { preferredPosition }),
              ...(skillLevel !== undefined && { skillLevel }),
              ...(goals !== undefined && { goals: Number(goals) }),
              ...(assists !== undefined && { assists: Number(assists) }),
              ...(matchesPlayed !== undefined && { matchesPlayed: Number(matchesPlayed) }),
              ...(wins !== undefined && { wins: Number(wins) }),
              ...(losses !== undefined && { losses: Number(losses) }),
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return authErrorResponse(error);
  }
}