import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = params.matchId;

    // 1. Find the chat associated with this match
    const chat = await prisma.chat.findUnique({
      where: { matchId },
    });

    if (!chat) {
      // If no chat room exists yet, return an empty array
      return NextResponse.json([]);
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

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to load message history" }, 
      { status: 500 }
    );
  }
}