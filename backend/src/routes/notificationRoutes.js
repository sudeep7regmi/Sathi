import { Router } from 'express';
import { listNotifications, markRead, markAllRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/', protect, listNotifications);
r.patch('/read-all', protect, markAllRead);
r.patch('/:id/read', protect, markRead);
export default r;
