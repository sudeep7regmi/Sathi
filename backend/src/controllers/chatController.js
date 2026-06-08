import asyncHandler from 'express-async-handler';
import { Message, User } from '../models/index.js';

// GET /api/chat/:thread  — message history for a thread
export const getThread = asyncHandler(async (req, res) => {
  const messages = await Message.findAll({
    where: { thread: req.params.thread },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatarHue'] }],
    order: [['createdAt', 'ASC']],
    limit: 200,
  });
  res.json(messages);
});

// POST /api/chat/:thread  { text, matchId? }  — REST fallback (Socket.io is primary)
export const postMessage = asyncHandler(async (req, res) => {
  const { text, matchId } = req.body;
  if (!text?.trim()) { res.status(400); throw new Error('Message text required'); }
  const msg = await Message.create({
    thread: req.params.thread, text: text.trim(), senderId: req.user.id, matchId: matchId || null,
  });
  const full = await Message.findByPk(msg.id, {
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatarHue'] }],
  });
  // Broadcast to socket room if io is attached
  req.app.get('io')?.to(req.params.thread).emit('chat:message', full);
  res.status(201).json(full);
});
