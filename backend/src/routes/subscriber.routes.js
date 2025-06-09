
import express from 'express';
import { subscribe, unsubscribe, getAllSubscribers } from '../controllers/subscriberController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Protected routes (admin only)
router.get('/', authenticate, getAllSubscribers);

export default router;
