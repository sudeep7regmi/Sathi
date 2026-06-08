import { Router } from 'express';
import { listBookings, createBooking, updateBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/', protect, listBookings);
r.post('/', protect, createBooking);
r.patch('/:id', protect, updateBooking);
export default r;
