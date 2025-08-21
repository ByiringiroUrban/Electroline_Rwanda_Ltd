import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const categoryRoutes = express.Router();

// Public routes
categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:id', getCategoryById);

// Protected routes (admin only)
categoryRoutes.post('/', authenticate, createCategory);
categoryRoutes.put('/:id', authenticate, updateCategory);
categoryRoutes.delete('/:id', authenticate, deleteCategory);