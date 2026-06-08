import { Router } from 'express';
import {
  listMatches, getMatch, createMatch, joinMatch, handleRequest, listRequests,
} from '../controllers/matchController.js';
import { updateScore, addEvent } from '../controllers/scoreController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/', listMatches);
r.get('/:id', getMatch);
r.post('/', protect, createMatch);
r.post('/:id/join', protect, joinMatch);
r.get('/:id/requests', protect, listRequests);
r.patch('/:id/requests/:userId', protect, handleRequest);
r.patch('/:id/score', protect, updateScore);
r.post('/:id/events', protect, addEvent);
export default r;
