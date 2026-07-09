import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configure Socket.IO to accept connections from our Next.js frontend
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Define strict types for our event payloads
interface ChatMessage {
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

// Real-Time Event Engine
io.on('connection', (socket: Socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // 1. JOIN MATCH ROOM: Isolates chat and score updates to specific matches
  socket.on('join_match_room', (matchId: string) => {
    socket.join(matchId);
    console.log(`User joined match room: ${matchId}`);
  });

  // 2. LIVE CHAT MESSAGING
  socket.on('send_message', (data: ChatMessage) => {
    // Broadcast to everyone in the match room EXCEPT the sender
    socket.to(data.matchId).emit('receive_message', data);
  });

  // 3. LIVE SCORE UPDATES (FIXED FOR GLOBAL HUB)
  socket.on('update_score', (data: TelemetryData) => {
    // We use io.emit() here so that everyone looking at the global 
    // Match Hub directory sees the score update instantly!
    io.emit('score_broadcast', data);
    console.log(`🏆 Global Score Update: Match ${data.matchId} | ${data.homeScore} - ${data.awayScore}`);
  });

  // 4. PUSH NOTIFICATIONS
  socket.on('send_notification', (data: NotificationData) => {
    // Emit a global broadcast that the frontend filters by targetUserId
    io.emit('receive_notification', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 SATHI Real-Time Socket Server running on port ${PORT}`);
});