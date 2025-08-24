
import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderStatus,
  approveOrderReception,
  getPendingApprovalOrders
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/all', authenticate, getAllOrders);  // Admin route
router.get('/myorders', authenticate, getMyOrders);
router.get('/pending-approval', authenticate, getPendingApprovalOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/pay', authenticate, updateOrderToPaid);
router.put('/:id/status', authenticate, updateOrderStatus);
router.put('/:id/approve', authenticate, approveOrderReception);

export default router;
