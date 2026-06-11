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

// Real-Time Event Engine
io.on('connection', (socket: Socket) => {
  console.log('⚡ Client connected:', socket.id);

  // 1. JOIN MATCH ROOM: Isolates chat and score updates to specific matches
  socket.on('join_match_room', (matchId: string) => {
    socket.join(matchId);
    console.log(`User joined match room: ${matchId}`);
  });

  // 2. LIVE CHAT MESSAGING
  socket.on('send_message', (data: { matchId: string, senderId: string, senderName: string, content: string, timestamp: string }) => {
    // Broadcast to everyone in the match room EXCEPT the sender
    socket.to(data.matchId).emit('receive_message', data);
  });

  // 3. LIVE SCORE UPDATES
  socket.on('update_score', (data: { matchId: string, homeScore: number, awayScore: number, eventType: string }) => {
    // Broadcast instantly to all spectators and players in the room
    io.to(data.matchId).emit('score_updated', data);
  });

  // 4. PUSH NOTIFICATIONS
  socket.on('send_notification', (data: { targetUserId: string, type: string, message: string }) => {
    // Emit a global broadcast that the frontend filters
    io.emit('receive_notification', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 SATHI Real-Time Socket Server running on port ${PORT}`);
});