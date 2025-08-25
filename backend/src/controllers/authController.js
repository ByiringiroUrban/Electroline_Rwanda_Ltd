import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';
import { sendWelcomeEmail, sendForgotPasswordEmail, sendVerificationEmail } from '../utils/emailService.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return sendResponse(res, 400, false, 'Email already registered');
    }

    // Check if phone is provided and already exists
    if (phone) {
      const existingUserByPhone = await User.findOne({ phone });
      if (existingUserByPhone) {
        return sendResponse(res, 400, false, 'Phone number already registered');
      }
    }

    // Generate 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user (not verified yet) - password will be hashed by User model pre-save hook
    const user = new User({
      name,
      email,
      phone,
      password, // Let the User model handle hashing
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 3600000, // 1 hour
      isAdmin: false
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    sendResponse(res, 201, true, {
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationToken } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return sendResponse(res, 400, false, 'Invalid or expired verification token');
    }

    // Update user as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Generate token for automatic login
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendResponse(res, 200, true, {
      message: 'Email verified successfully! Welcome to Electroline Rwanda Ltd.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, emailVerified: false });
    if (!user) {
      return sendResponse(res, 400, false, 'User not found or already verified');
    }

    // Generate new verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    sendResponse(res, 200, true, { message: 'Verification code resent to your email' });
  } catch (error) {
    console.error('Resend verification error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Check for demo admin credentials first
    if (emailOrPhone === 'admin@rwandastyle.com' && password === 'admin123') {
      // Create or find admin user
      let adminUser = await User.findOne({ email: 'admin@rwandastyle.com' });
      
      if (!adminUser) {
        adminUser = new User({
          name: 'Admin User',
          email: 'admin@rwandastyle.com',
          password: 'admin123', // Let the User model handle hashing
          emailVerified: true,
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

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return sendResponse(res, 401, false, 'Please verify your email before logging in');
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
        phone: user.phone,
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
    
    // Store reset token in user
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

    // Update user password and clear reset token (password will be hashed by pre-save hook)
    user.password = newPassword; // Let the User model handle hashing
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendResponse(res, 200, true, { message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    sendResponse(res, 500, false, error.message);
  }
};