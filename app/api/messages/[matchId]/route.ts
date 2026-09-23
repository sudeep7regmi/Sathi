import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, authErrorResponse } from '@/lib/auth';


export async function GET(
  request: NextRequest,
  { params }: { params:Promise <{ matchId: string }> }
) {
  try {
    const {matchId} = await params;
    const auth = await authenticateRequest(request);
    const player = await prisma.playerProfile.findUnique({
      where: { userId: auth.userId },
      select: { id: true },
    });
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        organizerId: true,
        participants: player
          ? { where: { playerId: player.id }, select: { id: true } }
          : undefined,
      },
    });
    if (!match) return NextResponse.json({ success: false, message: 'Match not found' }, { status: 404 });
    if (match.organizerId !== auth.userId && match.participants.length === 0) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // 1. Find the chat associated with this match
    const chat = await prisma.chat.findUnique({
      where: { matchId },
    });

    if (!chat) {
      // If no chat room exists yet, return an empty array
      return NextResponse.json({ success: true, messages: [] });
    }

    // 2. Fetch all messages for this chat
    const messages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' },
      include: {
        // Change 'sender' to match your schema.prisma exact relation name if needed
        sender: {
          select: {
            playerProfile: {
              select: { fullName: true, profileImage: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return authErrorResponse(error);
  }
}