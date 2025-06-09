import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

export const productRoutes = express.Router();

// Routes
productRoutes.post('/', createProduct);
productRoutes.get('/', getAllProducts);
productRoutes.get('/:id', getProductById);
productRoutes.put('/:id', updateProduct);
productRoutes.delete('/:id', deleteProduct);
