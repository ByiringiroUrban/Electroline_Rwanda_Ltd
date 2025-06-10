
import User from '../models/User.js';
import Product from '../models/Product.js';
import sendResponse from '../utils/sendResponse.js';

export const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }

    const user = await User.findById(userId);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    await user.populate('favorites');
    sendResponse(res, 200, true, user.favorites);
  } catch (error) {
    console.error('Add to favorites error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    await user.populate('favorites');
    sendResponse(res, 200, true, user.favorites);
  } catch (error) {
    console.error('Remove from favorites error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }
    sendResponse(res, 200, true, user.favorites || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
