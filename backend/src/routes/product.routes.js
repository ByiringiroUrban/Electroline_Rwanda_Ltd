
import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const productRoutes = express.Router();

// Public routes
productRoutes.get('/', getAllProducts);
productRoutes.get('/featured', getFeaturedProducts);
productRoutes.get('/:id', getProductById);

// Protected routes (admin only - you can add admin middleware later)
productRoutes.post('/', authenticate, createProduct);
productRoutes.put('/:id', authenticate, updateProduct);
productRoutes.delete('/:id', authenticate, deleteProduct);
