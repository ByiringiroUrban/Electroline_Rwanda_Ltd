
import express from 'express';
import { createNotification, getNotifications, updateNotification, deleteNotification } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createNotification);
router.get('/', getNotifications);
router.put('/:id', authenticate, updateNotification);
router.delete('/:id', authenticate, deleteNotification);

export default router;
