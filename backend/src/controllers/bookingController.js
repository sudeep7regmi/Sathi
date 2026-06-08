import asyncHandler from 'express-async-handler';
import { Booking, Futsal, User, Notification } from '../models/index.js';

const include = [
  { model: Futsal, as: 'futsal', attributes: ['id', 'name', 'area', 'ownerId'] },
  { model: User, as: 'user', attributes: ['id', 'name', 'avatarHue'] },
];

// GET /api/bookings  — players see their own; owners see bookings on their futsals
export const listBookings = asyncHandler(async (req, res) => {
  let where = {};
  if (req.user.role === 'player') {
    where.userId = req.user.id;
  } else if (req.user.role === 'owner') {
    const futsals = await Futsal.findAll({ where: { ownerId: req.user.id }, attributes: ['id'] });
    where.futsalId = futsals.map((f) => f.id);
  }
  if (req.query.status) where.status = req.query.status;
  const bookings = await Booking.findAll({ where, include, order: [['date', 'ASC'], ['startTime', 'ASC']] });
  res.json(bookings);
});

// POST /api/bookings  (player books a court)
export const createBooking = asyncHandler(async (req, res) => {
  const { futsalId, court, date, startTime, endTime, amount } = req.body;
  if (!futsalId || !court || !date || !startTime) {
    res.status(400); throw new Error('futsalId, court, date and startTime are required');
  }
  const clash = await Booking.findOne({ where: { futsalId, court, date, startTime } });
  if (clash) { res.status(409); throw new Error('That slot is already booked'); }

  const futsal = await Futsal.findByPk(futsalId);
  if (!futsal) { res.status(404); throw new Error('Futsal not found'); }

  const booking = await Booking.create({
    futsalId, court, date, startTime, endTime, userId: req.user.id,
    amount: amount || futsal.pricePerHour, status: 'pending',
  });
  await Notification.create({
    userId: futsal.ownerId, type: 'booking',
    title: 'New booking request', body: `${court} · ${date} ${startTime}`, link: '/bookings',
  });
  res.status(201).json(booking);
});

// PATCH /api/bookings/:id  { status }  (owner/admin confirm or decline)
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id, { include: [{ model: Futsal, as: 'futsal' }] });
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  const isOwner = booking.futsal.ownerId === req.user.id;
  if (!isOwner && req.user.role !== 'admin') { res.status(403); throw new Error('Not allowed'); }

  booking.status = req.body.status || booking.status;
  await booking.save();
  await Notification.create({
    userId: booking.userId, type: 'booking',
    title: `Booking ${booking.status}`, body: `${booking.court} · ${booking.date} ${booking.startTime}`, link: '/bookings',
  });
  res.json(booking);
});
