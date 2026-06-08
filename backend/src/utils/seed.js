// Seed the Sathi MySQL database with realistic Pokhara / NPR demo data.
// Usage:  npm run seed     (drops & recreates all tables, then inserts)
import dotenv from 'dotenv';
dotenv.config();

import { connectDB, sequelize } from '../config/db.js';
import {
  User, Futsal, Match, MatchPlayer, Booking, Message, Notification, Tournament,
} from '../models/index.js';

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };

async function run() {
  await connectDB();
  console.log('• Dropping & recreating tables…');
  await sequelize.sync({ force: true });

  // ── Users ──────────────────────────────────────────────
  console.log('• Creating users…');
  const admin = await User.create({ name: 'System Admin', email: 'admin@sathi.com', password: 'password123', role: 'admin', city: 'Pokhara' });

  const owners = await User.bulkCreate([
    { name: 'Lakeside Arena', email: 'owner@lakeside.np', password: 'password123', role: 'owner', city: 'Pokhara', verified: true },
    { name: 'Suresh Poudel',  email: 'greenfield@sathi.np', password: 'password123', role: 'owner', city: 'Pokhara', verified: false, status: 'Pending' },
  ], { individualHooks: true });

  const players = await User.bulkCreate([
    { name: 'Aarav Sharma',    email: 'aarav.sharma@gmail.com', password: 'password123', role: 'player', position: 'Midfielder', skill: 'Intermediate', rating: 4.6, matchesPlayed: 38, avatarHue: 152 },
    { name: 'Bishal Gurung',   email: 'bishal@sathi.np',  password: 'password123', role: 'player', position: 'Striker',    skill: 'Advanced',     rating: 4.8, matchesPlayed: 51, avatarHue: 24 },
    { name: 'Nirajan Thapa',   email: 'nirajan@sathi.np', password: 'password123', role: 'player', position: 'Goalkeeper', skill: 'Intermediate', rating: 4.4, matchesPlayed: 27, avatarHue: 210 },
    { name: 'Sandesh K.C.',    email: 'sandesh@sathi.np', password: 'password123', role: 'player', position: 'Defender',   skill: 'Advanced',     rating: 4.7, matchesPlayed: 44, avatarHue: 280 },
    { name: 'Prabin Magar',    email: 'prabin@sathi.np',  password: 'password123', role: 'player', position: 'Midfielder', skill: 'Beginner',     rating: 4.1, matchesPlayed: 12, avatarHue: 320 },
    { name: 'Rohan Shrestha',  email: 'rohan@sathi.np',   password: 'password123', role: 'player', position: 'Striker',    skill: 'Intermediate', rating: 4.5, matchesPlayed: 33, avatarHue: 48 },
    { name: 'Kiran Adhikari',  email: 'kiran@sathi.np',   password: 'password123', role: 'player', position: 'Winger',     skill: 'Advanced',     rating: 4.9, matchesPlayed: 60, avatarHue: 100 },
  ], { individualHooks: true });

  // ── Futsals ────────────────────────────────────────────
  console.log('• Creating futsals…');
  const courts = (n) => Array.from({ length: n }, (_, i) => ({
    name: `Court ${i + 1}`, size: '40 × 20 m', surface: i === 2 ? 'Wooden indoor' : 'Artificial turf', status: 'Active',
  }));
  const lakeside = await Futsal.create({ name: 'Lakeside Futsal Arena', ownerId: owners[0].id, area: 'Lakeside', city: 'Pokhara', pricePerHour: 1600, rating: 4.7, courts: courts(3), verified: true, status: 'Active' });
  const greenfield = await Futsal.create({ name: 'Greenfield Futsal', ownerId: owners[1].id, area: 'New Road', city: 'Pokhara', pricePerHour: 1400, rating: 4.5, courts: courts(1), verified: false, status: 'Pending' });
  const sportsHub = await Futsal.create({ name: 'Pokhara Sports Hub', ownerId: owners[0].id, area: 'Birauta', city: 'Pokhara', pricePerHour: 1800, rating: 4.8, courts: courts(3), verified: true, status: 'Active' });

  // ── Matches ────────────────────────────────────────────
  console.log('• Creating matches…');
  const m1 = await Match.create({ title: 'Evening 5-a-side', hostId: players[1].id, futsalId: lakeside.id, format: '5v5', skill: 'Intermediate', date: addDays(0), time: '18:00', capacity: 10, pricePerHead: 180, status: 'open' });
  const m2 = await Match.create({ title: 'Morning Kickabout', hostId: players[4].id, futsalId: greenfield.id, format: '5v5', skill: 'Beginner', date: addDays(1), time: '07:00', capacity: 10, pricePerHead: 150, status: 'open' });
  const m3 = await Match.create({ title: 'Sunday Showdown', hostId: players[6].id, futsalId: sportsHub.id, format: '6v6', skill: 'Advanced', date: addDays(3), time: '16:30', capacity: 12, pricePerHead: 220, status: 'live', scoreHome: 2, scoreAway: 1, clock: 485 });

  // Rosters & a pending request
  console.log('• Filling rosters…');
  await MatchPlayer.bulkCreate([
    { matchId: m1.id, userId: players[1].id, status: 'accepted' },
    { matchId: m1.id, userId: players[0].id, status: 'accepted' },
    { matchId: m1.id, userId: players[2].id, status: 'accepted' },
    { matchId: m1.id, userId: players[3].id, status: 'accepted' },
    { matchId: m1.id, userId: players[5].id, status: 'pending' },
    { matchId: m1.id, userId: players[6].id, status: 'pending' },
  ]);

  // ── Bookings ───────────────────────────────────────────
  console.log('• Creating bookings…');
  await Booking.bulkCreate([
    { futsalId: lakeside.id, court: 'Court 1', userId: players[0].id, date: addDays(0), startTime: '18:00', endTime: '19:00', amount: 1600, status: 'confirmed' },
    { futsalId: lakeside.id, court: 'Court 2', userId: players[1].id, date: addDays(0), startTime: '19:00', endTime: '20:00', amount: 1600, status: 'confirmed' },
    { futsalId: lakeside.id, court: 'Court 1', userId: players[3].id, date: addDays(0), startTime: '20:00', endTime: '21:00', amount: 1600, status: 'pending' },
    { futsalId: sportsHub.id, court: 'Court 1', userId: players[6].id, date: addDays(1), startTime: '17:00', endTime: '18:00', amount: 1800, status: 'pending' },
  ]);

  // ── Messages ───────────────────────────────────────────
  console.log('• Seeding chat…');
  await Message.bulkCreate([
    { thread: `match:${m1.id}`, matchId: m1.id, senderId: players[1].id, text: 'Bhai, are we on for 6 PM today?' },
    { thread: `match:${m1.id}`, matchId: m1.id, senderId: players[0].id, text: 'Yes! Just left Lakeside, reaching in 10.' },
    { thread: `match:${m1.id}`, matchId: m1.id, senderId: players[1].id, text: 'Perfect. We are 8, need 2 more.' },
  ]);

  // ── Notifications ──────────────────────────────────────
  await Notification.bulkCreate([
    { userId: players[1].id, type: 'request',  title: 'Rohan Shrestha wants to join', body: 'Evening 5-a-side', read: false },
    { userId: players[0].id, type: 'approved', title: 'Your join request was accepted', body: 'Sunday Showdown', read: false },
    { userId: owners[0].id,  type: 'booking',  title: 'New booking request', body: 'Court 1 · 8:00 PM', read: false },
  ]);

  // ── Tournament ─────────────────────────────────────────
  console.log('• Creating tournament…');
  await Tournament.create({
    name: 'Lakeside Cup 2026', futsalId: lakeside.id, organizerId: owners[0].id,
    format: '5v5 Knockout', maxTeams: 16, entryFee: 3500, startDate: addDays(12), endDate: addDays(14), status: 'Registering',
    standings: [
      { team: 'Lakeside Lions', played: 4, won: 4, drawn: 0, lost: 0, gd: 12, points: 12 },
      { team: 'Bagar United', played: 4, won: 3, drawn: 0, lost: 1, gd: 6, points: 9 },
      { team: 'New Road FC', played: 4, won: 2, drawn: 1, lost: 1, gd: 3, points: 7 },
      { team: 'Birauta Strikers', played: 4, won: 1, drawn: 1, lost: 2, gd: -2, points: 4 },
    ],
    fixtures: [
      { home: 'Lakeside Lions', away: 'Bagar United', score: '3–2', status: 'completed', kickoff: '18:00' },
      { home: 'New Road FC', away: 'Birauta Strikers', score: '', status: 'scheduled', kickoff: '19:30' },
    ],
  });

  console.log('\n✓ Seed complete!');
  console.log('  Admin  → admin@sathi.com / password123');
  console.log('  Owner  → owner@lakeside.np / password123');
  console.log('  Player → aarav.sharma@gmail.com / password123\n');
  await sequelize.close();
  process.exit(0);
}

run().catch((err) => { console.error('✗ Seed failed:', err); process.exit(1); });
