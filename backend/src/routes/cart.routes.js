
import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.put('/update', authenticate, updateCartItem);
router.delete('/:productId', authenticate, removeFromCart);

export default router;
