import asyncHandler from 'express-async-handler';
import { User, Futsal, Match, Booking, Notification } from '../models/index.js';

// GET /api/admin/stats
export const stats = asyncHandler(async (req, res) => {
  const [users, players, owners, futsals, pendingFutsals, matches, liveMatches, bookings] = await Promise.all([
    User.count(),
    User.count({ where: { role: 'player' } }),
    User.count({ where: { role: 'owner' } }),
    Futsal.count(),
    Futsal.count({ where: { verified: false } }),
    Match.count(),
    Match.count({ where: { status: 'live' } }),
    Booking.count(),
  ]);
  res.json({ users, players, owners, admins: users - players - owners, futsals, pendingFutsals, matches, liveMatches, bookings });
});

// GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.role) where.role = req.query.role;
  const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(users);
});

// PATCH /api/admin/users/:id  { status }
export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (req.body.status) user.status = req.body.status;
  await user.save();
  res.json(user);
});

// GET /api/admin/verifications  — futsals awaiting verification
export const listVerifications = asyncHandler(async (req, res) => {
  const futsals = await Futsal.findAll({
    where: { verified: false },
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'ASC']],
  });
  res.json(futsals);
});

// PATCH /api/admin/verifications/:id  { action: 'approve' | 'reject' }
export const decideVerification = asyncHandler(async (req, res) => {
  const futsal = await Futsal.findByPk(req.params.id);
  if (!futsal) { res.status(404); throw new Error('Futsal not found'); }
  if (req.body.action === 'approve') { futsal.verified = true; futsal.status = 'Active'; }
  else { futsal.status = 'Rejected'; }
  await futsal.save();
  await Notification.create({
    userId: futsal.ownerId, type: 'system',
    title: req.body.action === 'approve' ? 'Your venue was verified' : 'Verification rejected',
    body: futsal.name, link: '/courts',
  });
  res.json(futsal);
});
