import asyncHandler from 'express-async-handler';
import { User } from '../models/index.js';
import { signToken } from '../utils/token.js';

const publicUser = (u) => ({
  id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, city: u.city,
  position: u.position, skill: u.skill, rating: u.rating, matchesPlayed: u.matchesPlayed,
  avatarHue: u.avatarHue, verified: u.verified, status: u.status,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, city, position, skill } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Name, email and password are required');
  }
  const exists = await User.findOne({ where: { email } });
  if (exists) { res.status(409); throw new Error('Email already registered'); }

  const user = await User.create({
    name, email, password, phone, role: role || 'player', city,
    position, skill, avatarHue: Math.floor(Math.random() * 360),
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// PUT /api/auth/me
export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['name', 'phone', 'city', 'position', 'skill'];
  fields.forEach((f) => { if (req.body[f] !== undefined) req.user[f] = req.body[f]; });
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});
