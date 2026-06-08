import { Router } from 'express';
import {
  stats, listUsers, updateUserStatus, listVerifications, decideVerification,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const r = Router();
r.use(protect, authorize('admin'));
r.get('/stats', stats);
r.get('/users', listUsers);
r.patch('/users/:id', updateUserStatus);
r.get('/verifications', listVerifications);
r.patch('/verifications/:id', decideVerification);
export default r;
