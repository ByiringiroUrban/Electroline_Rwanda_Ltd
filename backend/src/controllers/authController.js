
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false // Regular users are not admin by default
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendResponse(res, 201, true, {
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for demo admin credentials
    if (email === 'admin@rwandastyle.com' && password === 'admin123') {
      // Create or find admin user
      let adminUser = await User.findOne({ email: 'admin@rwandastyle.com' });
      
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 12);
        adminUser = new User({
          name: 'Admin User',
          email: 'admin@rwandastyle.com',
          password: hashedPassword,
          isAdmin: true
        });
        await adminUser.save();
        console.log('Demo admin user created successfully');
      }

      const token = jwt.sign(
        { userId: adminUser._id, email: adminUser.email, isAdmin: adminUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return sendResponse(res, 200, true, {
        message: 'Admin login successful',
        token,
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          isAdmin: adminUser.isAdmin
        }
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendResponse(res, 200, true, {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
