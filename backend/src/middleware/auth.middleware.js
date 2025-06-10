
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;

    if (!token) return sendResponse(res, 401, false, 'Access token is required');

    // Check if token is properly formatted (basic validation)
    if (token.split('.').length !== 3) {
      return sendResponse(res, 401, false, 'Invalid token format');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        return sendResponse(res, 401, false, 'Invalid token');
      } else if (jwtError.name === 'TokenExpiredError') {
        return sendResponse(res, 401, false, 'Token expired');
      } else {
        return sendResponse(res, 401, false, 'Token verification failed');
      }
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) return sendResponse(res, 401, false, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return sendResponse(res, 401, false, 'Authentication failed');
  }
};
