import asyncHandler from 'express-async-handler';
import { Match, Futsal, User, MatchPlayer, Notification } from '../models/index.js';

const include = [
  { model: User, as: 'host', attributes: ['id', 'name', 'avatarHue', 'rating'] },
  { model: Futsal, as: 'futsal', attributes: ['id', 'name', 'area', 'city'] },
  { model: MatchPlayer, as: 'memberships', include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatarHue', 'position', 'skill', 'rating'] }] },
];

// GET /api/matches  (?skill=&format=&futsalId=&status=)
export const listMatches = asyncHandler(async (req, res) => {
  const where = {};
  ['skill', 'format', 'futsalId', 'status'].forEach((k) => { if (req.query[k]) where[k] = req.query[k]; });
  const matches = await Match.findAll({ where, include, order: [['date', 'ASC'], ['time', 'ASC']] });
  res.json(matches);
});

// GET /api/matches/:id
export const getMatch = asyncHandler(async (req, res) => {
  const match = await Match.findByPk(req.params.id, { include });
  if (!match) { res.status(404); throw new Error('Match not found'); }
  res.json(match);
});

// POST /api/matches
export const createMatch = asyncHandler(async (req, res) => {
  const { title, futsalId, format, type, skill, date, time, capacity, pricePerHead, requiresApproval } = req.body;
  if (!title || !futsalId || !date || !time) {
    res.status(400); throw new Error('title, futsalId, date and time are required');
  }
  const match = await Match.create({
    title, futsalId, format, type, skill, date, time,
    capacity, pricePerHead, requiresApproval, hostId: req.user.id, status: 'open',
  });
  // Host auto-joins as accepted
  await MatchPlayer.create({ matchId: match.id, userId: req.user.id, status: 'accepted' });
  const full = await Match.findByPk(match.id, { include });
  res.status(201).json(full);
});

// POST /api/matches/:id/join  → creates a join request (or auto-accept)
export const joinMatch = asyncHandler(async (req, res) => {
  const match = await Match.findByPk(req.params.id);
  if (!match) { res.status(404); throw new Error('Match not found'); }

  const accepted = await MatchPlayer.count({ where: { matchId: match.id, status: 'accepted' } });
  if (accepted >= match.capacity) { res.status(400); throw new Error('Match is full'); }

  const [mp, created] = await MatchPlayer.findOrCreate({
    where: { matchId: match.id, userId: req.user.id },
    defaults: { status: match.requiresApproval ? 'pending' : 'accepted' },
  });
  if (!created) { res.status(409); throw new Error('Already requested or joined'); }

  await Notification.create({
    userId: match.hostId, type: 'request',
    title: `${req.user.name} wants to join`, body: match.title, link: `/matches/${match.id}`,
  });
  res.status(201).json({ status: mp.status });
});

// PATCH /api/matches/:id/requests/:userId  { action: 'accept' | 'decline' }  (host only)
export const handleRequest = asyncHandler(async (req, res) => {
  const match = await Match.findByPk(req.params.id);
  if (!match) { res.status(404); throw new Error('Match not found'); }
  if (match.hostId !== req.user.id && req.user.role !== 'admin') {
    res.status(403); throw new Error('Only the host can manage requests');
  }
  const mp = await MatchPlayer.findOne({ where: { matchId: match.id, userId: req.params.userId } });
  if (!mp) { res.status(404); throw new Error('Request not found'); }

  mp.status = req.body.action === 'accept' ? 'accepted' : 'declined';
  await mp.save();

  const accepted = await MatchPlayer.count({ where: { matchId: match.id, status: 'accepted' } });
  if (accepted >= match.capacity) { match.status = 'full'; await match.save(); }

  await Notification.create({
    userId: Number(req.params.userId),
    type: mp.status === 'accepted' ? 'approved' : 'system',
    title: mp.status === 'accepted' ? 'Your join request was accepted' : 'Your join request was declined',
    body: match.title, link: `/matches/${match.id}`,
  });
  res.json({ status: mp.status, accepted });
});

// GET /api/matches/:id/requests  (host only) — pending requests
export const listRequests = asyncHandler(async (req, res) => {
  const rows = await MatchPlayer.findAll({
    where: { matchId: req.params.id, status: 'pending' },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatarHue', 'position', 'skill', 'rating'] }],
  });
  res.json(rows);
});
