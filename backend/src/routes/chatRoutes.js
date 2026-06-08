import { Router } from 'express';
import { getThread, postMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/:thread', protect, getThread);
r.post('/:thread', protect, postMessage);
export default r;
