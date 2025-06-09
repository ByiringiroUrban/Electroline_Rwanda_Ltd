
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendResponse from '../utils/sendResponse.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return sendResponse(res, 400, false, 'User already exists');

    // Check if this is the first user - make them admin
    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0 || email === 'admin@rwandastyle.com';

    const user = await User.create({ 
      name, 
      email, 
      password,
      isAdmin 
    });

    sendResponse(res, 201, true, {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendResponse(res, 200, true, {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      sendResponse(res, 401, false, 'Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
