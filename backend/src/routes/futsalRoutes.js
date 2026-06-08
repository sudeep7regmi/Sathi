import { Router } from 'express';
import { listFutsals, getFutsal, createFutsal, updateFutsal } from '../controllers/futsalController.js';
import { protect, authorize } from '../middleware/auth.js';

const r = Router();
r.get('/', listFutsals);
r.get('/:id', getFutsal);
r.post('/', protect, authorize('owner', 'admin'), createFutsal);
r.put('/:id', protect, authorize('owner', 'admin'), updateFutsal);
export default r;
