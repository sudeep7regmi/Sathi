import asyncHandler from 'express-async-handler';
import { Tournament, Futsal, User } from '../models/index.js';

// GET /api/tournaments
export const listTournaments = asyncHandler(async (req, res) => {
  const tours = await Tournament.findAll({
    include: [{ model: Futsal, as: 'futsal', attributes: ['id', 'name', 'area'] }],
    order: [['startDate', 'ASC']],
  });
  res.json(tours);
});

// GET /api/tournaments/:id
export const getTournament = asyncHandler(async (req, res) => {
  const t = await Tournament.findByPk(req.params.id, {
    include: [{ model: Futsal, as: 'futsal', attributes: ['id', 'name', 'area'] }],
  });
  if (!t) { res.status(404); throw new Error('Tournament not found'); }
  res.json(t);
});

// POST /api/tournaments  (owner/admin)
export const createTournament = asyncHandler(async (req, res) => {
  const body = req.body;
  const t = await Tournament.create({ ...body, organizerId: req.user.id });
  res.status(201).json(t);
});
