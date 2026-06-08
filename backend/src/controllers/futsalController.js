import asyncHandler from 'express-async-handler';
import { Futsal, User } from '../models/index.js';

// GET /api/futsals
export const listFutsals = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.verified) where.verified = req.query.verified === 'true';
  if (req.query.mine && req.user) where.ownerId = req.user.id;
  const futsals = await Futsal.findAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(futsals);
});

// GET /api/futsals/:id
export const getFutsal = asyncHandler(async (req, res) => {
  const futsal = await Futsal.findByPk(req.params.id, {
    include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
  });
  if (!futsal) { res.status(404); throw new Error('Futsal not found'); }
  res.json(futsal);
});

// POST /api/futsals  (owner)
export const createFutsal = asyncHandler(async (req, res) => {
  const { name, area, city, pricePerHour, openHours, courts } = req.body;
  if (!name || !area || !pricePerHour) {
    res.status(400); throw new Error('name, area and pricePerHour are required');
  }
  const futsal = await Futsal.create({
    name, area, city, pricePerHour, openHours,
    courts: courts || [{ name: 'Court 1', size: '40 × 20 m', surface: 'Artificial turf', status: 'Active' }],
    ownerId: req.user.id, status: 'Pending', verified: false,
  });
  res.status(201).json(futsal);
});

// PUT /api/futsals/:id  (owner of record / admin)
export const updateFutsal = asyncHandler(async (req, res) => {
  const futsal = await Futsal.findByPk(req.params.id);
  if (!futsal) { res.status(404); throw new Error('Futsal not found'); }
  if (futsal.ownerId !== req.user.id && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not allowed');
  }
  ['name', 'area', 'city', 'pricePerHour', 'openHours', 'courts', 'photos'].forEach((f) => {
    if (req.body[f] !== undefined) futsal[f] = req.body[f];
  });
  await futsal.save();
  res.json(futsal);
});
