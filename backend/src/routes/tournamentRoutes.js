import { Router } from 'express';
import { listTournaments, getTournament, createTournament } from '../controllers/tournamentController.js';
import { protect, authorize } from '../middleware/auth.js';

const r = Router();
r.get('/', listTournaments);
r.get('/:id', getTournament);
r.post('/', protect, authorize('owner', 'admin'), createTournament);
export default r;
