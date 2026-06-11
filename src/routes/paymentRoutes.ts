import express from 'express';
import { checkout } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/checkout', protect, checkout);

export default router;