import { verifyToken } from '../utils/token.js';
import { Message, User } from '../models/index.js';

// Real-time layer: match chat + live score rooms.
export function initSockets(io) {
  // Optional auth handshake (token in socket.handshake.auth.token)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token) socket.user = verifyToken(token);
    } catch (_) { /* allow anonymous read-only */ }
    next();
  });

  io.on('connection', (socket) => {
    // Join / leave a thread or match room
    socket.on('room:join', (room) => socket.join(room));
    socket.on('room:leave', (room) => socket.leave(room));

    // Live chat — persists then broadcasts
    socket.on('chat:send', async ({ thread, text, matchId }) => {
      if (!socket.user || !text?.trim()) return;
      const msg = await Message.create({
        thread, text: text.trim(), senderId: socket.user.id, matchId: matchId || null,
      });
      const full = await Message.findByPk(msg.id, {
        include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatarHue'] }],
      });
      io.to(thread).emit('chat:message', full);
    });

    // Typing indicator
    socket.on('chat:typing', ({ thread, name }) => {
      socket.to(thread).emit('chat:typing', { name });
    });
  });
}
