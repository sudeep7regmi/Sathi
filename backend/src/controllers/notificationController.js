import asyncHandler from 'express-async-handler';
import { Notification } from '../models/index.js';

// GET /api/notifications
export const listNotifications = asyncHandler(async (req, res) => {
  const notifs = await Notification.findAll({
    where: { userId: req.user.id }, order: [['createdAt', 'DESC']], limit: 50,
  });
  res.json(notifs);
});

// PATCH /api/notifications/:id/read
export const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!n) { res.status(404); throw new Error('Notification not found'); }
  n.read = true; await n.save();
  res.json(n);
});

// PATCH /api/notifications/read-all
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.update({ read: true }, { where: { userId: req.user.id, read: false } });
  res.json({ ok: true });
});
