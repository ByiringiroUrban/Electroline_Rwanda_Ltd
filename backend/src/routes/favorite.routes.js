
import express from 'express';
import { addToFavorites, removeFromFavorites, getFavorites } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', authenticate, addToFavorites);
router.delete('/:productId', authenticate, removeFromFavorites);
router.get('/', authenticate, getFavorites);

export default router;
