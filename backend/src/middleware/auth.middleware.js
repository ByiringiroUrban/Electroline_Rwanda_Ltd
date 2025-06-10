
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

    if (!token) return sendResponse(res, 401, false, 'Access token is required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return sendResponse(res, 401, false, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return sendResponse(res, 401, false, 'Not authorized');
  }
};
