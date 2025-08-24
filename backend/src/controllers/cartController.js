
import User from '../models/User.js';
import Product from '../models/Product.js';
import sendResponse from '../utils/sendResponse.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    if (product.countInStock < quantity) {
      return sendResponse(res, 400, false, 'Insufficient stock');
    }

    const user = await User.findById(userId);
    const existingCartItem = user.cart.find(item => item.product.toString() === productId);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    // Populate the cart after saving
    await user.populate('cart.product');

    sendResponse(res, 200, true, user.cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    sendResponse(res, 200, true, user.cart || []);
  } catch (error) {
    console.error('Get cart error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return sendResponse(res, 404, false, 'Cart item not found');
    }

    cartItem.quantity = quantity;
    await user.save();
    
    // Populate the cart after saving
    await user.populate('cart.product');

    sendResponse(res, 200, true, user.cart);
  } catch (error) {
    console.error('Update cart error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    
    await user.save();
    
    // Populate the cart after saving
    await user.populate('cart.product');

    sendResponse(res, 200, true, user.cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.cart = [];
    
    await user.save();

    sendResponse(res, 200, true, []);
  } catch (error) {
    console.error('Clear cart error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
