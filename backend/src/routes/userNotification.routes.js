
import express from 'express';
import { getUserNotifications, markNotificationAsRead, addUserNotification } from '../controllers/userNotificationController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getUserNotifications);
router.put('/:notificationId/read', authenticate, markNotificationAsRead);
router.post('/add', authenticate, addUserNotification);

export default router;
