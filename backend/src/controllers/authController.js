
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';
import { sendWelcomeEmail, sendForgotPasswordEmail } from '../utils/emailService.js';

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

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

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

    // Check for demo admin credentials first
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

    // Find regular user
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Generate 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset token in user (you might want to add these fields to User model)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    await sendForgotPasswordEmail(user.email, user.name, resetToken);

    sendResponse(res, 200, true, { message: 'Password reset code sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return sendResponse(res, 400, false, 'Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendResponse(res, 200, true, { message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
