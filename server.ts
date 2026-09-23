import express from 'express';
import http from 'http';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { jwtVerify } from 'jose';
import { prisma } from './lib/prisma';

const app = express();
const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not configured');
}

app.use(cors({ origin: allowedOrigin, credentials: true }));

const server = http.createServer(app);

interface AuthenticatedUser {
  userId: string;
  role: 'PLAYER' | 'OWNER' | 'ADMIN';
}

interface SocketData {
  user: AuthenticatedUser;
}

interface ChatMessagePayload {
  matchId: string;
  content: string;
}

interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface TelemetryData {
  matchId: string;
  homeScore: number;
  awayScore: number;
  eventType?: string;
}

interface NotificationData {
  targetUserId: string;
  type: string;
  message: string;
}

interface ClientToServerEvents {
  join_match_room: (matchId: string) => void;
  send_message: (data: ChatMessagePayload) => void;
  update_score: (data: TelemetryData) => void;
  send_notification: (data: NotificationData) => void;
}

interface ServerToClientEvents {
  receive_message: (data: ChatMessage) => void;
  score_broadcast: (data: TelemetryData) => void;
  receive_notification: (data: NotificationData) => void;
  socket_error: (data: { message: string }) => void;
}

type SathiSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
  server,
  {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  }
);

function isRole(value: unknown): value is AuthenticatedUser['role'] {
  return value === 'PLAYER' || value === 'OWNER' || value === 'ADMIN';
}

function tokenFromSocket(socket: SathiSocket): string | null {
  const handshakeToken = socket.handshake.auth.token;
  if (typeof handshakeToken === 'string' && handshakeToken.length > 0) {
    return handshakeToken;
  }

  const cookieHeader = socket.handshake.headers.cookie;
  if (typeof cookieHeader !== 'string') return null;

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sathi_access='));

  return cookie ? decodeURIComponent(cookie.slice('sathi_access='.length)) : null;
}

async function authenticateSocket(socket: SathiSocket): Promise<AuthenticatedUser> {
  const token = tokenFromSocket(socket);
  if (!token) throw new Error('Unauthorized');

  const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
  if (typeof payload.userId !== 'string' || !isRole(payload.role)) {
    throw new Error('Invalid authentication token');
  }

  return { userId: payload.userId, role: payload.role };
}

async function matchAccess(
  matchId: string,
  userId: string
): Promise<{ organizer: boolean; participant: boolean }> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      organizerId: true,
      participants: {
        where: { player: { userId } },
        select: { id: true },
      },
    },
  });

  if (!match) throw new Error('Match not found');
  return {
    organizer: match.organizerId === userId,
    participant: match.participants.length > 0,
  };
}

function validMatchId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 100;
}

function validContent(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 2000;
}

function validScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000;
}

function validShortText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 100;
}

io.use(async (socket, next) => {
  try {
    socket.data.user = await authenticateSocket(socket);
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket: SathiSocket) => {
  const { user } = socket.data;
  socket.join(`user:${user.userId}`);
  console.log(`Client connected: ${socket.id}`);

  const reject = (message: string) => socket.emit('socket_error', { message });

  socket.on('join_match_room', async (matchId) => {
    try {
      if (!validMatchId(matchId)) return reject('A valid matchId is required');
      const access = await matchAccess(matchId, user.userId);
      if (!access.organizer && !access.participant) return reject('Forbidden');

      socket.join(matchId);
      console.log(`User joined match room: ${matchId}`);
    } catch (error) {
      reject(error instanceof Error ? error.message : 'Unable to join match room');
    }
  });

  socket.on('send_message', async (data) => {
    try {
      if (
        !data ||
        !validMatchId(data.matchId) ||
        !validContent(data.content)
      ) {
        return reject('Invalid message payload');
      }

      const access = await matchAccess(data.matchId, user.userId);
      if (!access.organizer && !access.participant) return reject('Forbidden');

      const sender = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { email: true, playerProfile: { select: { fullName: true } } },
      });
      if (!sender) return reject('User not found');

      const message: ChatMessage = {
        id: randomUUID(),
        matchId: data.matchId,
        senderId: user.userId,
        senderName: sender.playerProfile?.fullName || sender.email,
        content: data.content.trim(),
        timestamp: new Date().toISOString(),
      };
      socket.to(data.matchId).emit('receive_message', message);
    } catch (error) {
      reject(error instanceof Error ? error.message : 'Unable to send message');
    }
  });

  socket.on('update_score', async (data) => {
    try {
      if (
        !data ||
        !validMatchId(data.matchId) ||
        !validScore(data.homeScore) ||
        !validScore(data.awayScore) ||
        (data.eventType !== undefined && !validShortText(data.eventType))
      ) {
        return reject('Invalid score payload');
      }

      const access = await matchAccess(data.matchId, user.userId);
      if (!access.organizer) return reject('Only the match organizer can update scores');

      io.emit('score_broadcast', {
        ...data,
        eventType: data.eventType?.trim(),
      });
      console.log(`Score update: Match ${data.matchId} | ${data.homeScore} - ${data.awayScore}`);
    } catch (error) {
      reject(error instanceof Error ? error.message : 'Unable to update score');
    }
  });

  socket.on('send_notification', (data) => {
    if (user.role !== 'ADMIN') {
      return reject('Only administrators can send notifications');
    }
    if (
      !data ||
      !validShortText(data.targetUserId) ||
      !validShortText(data.type) ||
      !validContent(data.message)
    ) {
      return reject('Invalid notification payload');
    }

    io.to(`user:${data.targetUserId}`).emit('receive_notification', {
      targetUserId: data.targetUserId,
      type: data.type.trim(),
      message: data.message.trim(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`SATHI Real-Time Socket Server running on port ${PORT}`);
});
