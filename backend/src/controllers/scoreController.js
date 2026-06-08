import asyncHandler from 'express-async-handler';
import { Match } from '../models/index.js';

// PATCH /api/matches/:id/score  { scoreHome, scoreAway, clock, status }  (host/admin)
// Also pushes a live update over Socket.io to everyone watching the match.
export const updateScore = asyncHandler(async (req, res) => {
  const match = await Match.findByPk(req.params.id);
  if (!match) { res.status(404); throw new Error('Match not found'); }
  if (match.hostId !== req.user.id && req.user.role !== 'admin') {
    res.status(403); throw new Error('Only the host/scorer can update the score');
  }
  ['scoreHome', 'scoreAway', 'clock', 'status'].forEach((f) => {
    if (req.body[f] !== undefined) match[f] = req.body[f];
  });
  await match.save();

  const payload = {
    id: match.id, scoreHome: match.scoreHome, scoreAway: match.scoreAway,
    clock: match.clock, status: match.status,
  };
  req.app.get('io')?.to(`match:${match.id}`).emit('score:update', payload);
  res.json(payload);
});

// POST /api/matches/:id/events  { minute, team, type, note }  (host/admin)
export const addEvent = asyncHandler(async (req, res) => {
  const match = await Match.findByPk(req.params.id);
  if (!match) { res.status(404); throw new Error('Match not found'); }
  if (match.hostId !== req.user.id && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not allowed');
  }
  const event = {
    minute: req.body.minute, team: req.body.team, type: req.body.type, note: req.body.note || '',
  };
  match.events = [event, ...(match.events || [])];
  if (event.type === 'goal') {
    if (event.team === 'home') match.scoreHome += 1; else match.scoreAway += 1;
  }
  await match.save();

  req.app.get('io')?.to(`match:${match.id}`).emit('score:event', {
    event, scoreHome: match.scoreHome, scoreAway: match.scoreAway,
  });
  res.status(201).json({ event, scoreHome: match.scoreHome, scoreAway: match.scoreAway });
});
