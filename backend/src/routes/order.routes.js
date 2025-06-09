
import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/myorders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/pay', authenticate, updateOrderToPaid);
router.put('/:id/status', authenticate, updateOrderStatus);
router.get('/', authenticate, getAllOrders);

export default router;
