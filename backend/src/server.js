import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server as SocketServer } from 'socket.io';

import { connectDB, sequelize } from './config/db.js';
import './models/index.js'; // register models + associations
import { initSockets } from './sockets/index.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import futsalRoutes from './routes/futsalRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Socket.io
const io = new SocketServer(server, { cors: { origin: CLIENT_URL, credentials: true } });
app.set('io', io);
initSockets(io);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'sathi-api', time: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/futsals', futsalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    // Sync tables (use migrations in production). alter keeps schema in step during dev.
    await sequelize.sync({ alter: true });
    console.log('✓ Models synced');
    server.listen(PORT, () => console.log(`✓ Sathi API on http://localhost:${PORT}`));
  } catch (err) {
    console.error('✗ Startup failed:', err.message);
    process.exit(1);
  }
})();
