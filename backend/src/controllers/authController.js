import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendResponse from '../utils/sendResponse.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return sendResponse(res, 400, false, 'User already exists');

  const user = await User.create({ name, email, password });

  sendResponse(res, 201, true, {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    sendResponse(res, 200, true, {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    sendResponse(res, 401, false, 'Invalid credentials');
  }
};
