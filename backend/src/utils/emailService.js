import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'urbanpac20@gmail.com',
    pass: 'txwy ywhl avow hbcr'
  }
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: '"Eletroline Rwanda" <urbanpac20@gmail.com>',
      to,
      subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderNotificationEmail = async (userEmail, userName, orderId, status) => {
  const statusMessages = {
    'approved': 'Your order has been approved and is being processed.',
    'rejected': 'Unfortunately, your order has been rejected. Please contact support for more information. 0788854243',
    'delivered': 'Your order has been delivered successfully.',
    'shipped': 'Your order has been shipped and is on its way to you.'
  };

  const subject = `Order Update - ${orderId.slice(-8)}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Eletroline Rwanda - Order Update</h2>
      <p>Dear ${userName},</p>
      <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>Thank you for shopping with Eletroline Rwnanda!</p>
      <hr>
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, htmlContent);
};

export const sendForgotPasswordEmail = async (userEmail, userName, resetToken) => {
  const subject = 'Password Reset Request - Eletroline Rwanda';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Eletroline Rwanda - Password Reset</h2>
      <p>Dear ${userName},</p>
      <p>You requested a password reset for your Eletroline Rwanda account.</p>
      <p>Your temporary password reset code is: <strong style="color: #7c3aed; font-size: 18px;">${resetToken}</strong></p>
      <p>This code will expire in 1 hour for security reasons.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, htmlContent);
};

export const sendVerificationEmail = async (userEmail, userName, verificationToken) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ff6b35; margin: 0;">Electroline Rwanda Ltd.</h1>
        <p style="color: #666; margin: 5px 0;">Electronics & Technology Solutions</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h2 style="color: white; margin: 0;">Verify Your Email Address</h2>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hello <strong>${userName}</strong>,
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Thank you for registering with Electroline Rwanda Ltd. To complete your account setup, please verify your email address using the verification code below:
      </p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Verification Code:</p>
        <div style="font-size: 32px; font-weight: bold; color: #ff6b35; letter-spacing: 5px; font-family: 'Courier New', monospace;">
          ${verificationToken}
        </div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 1 hour</p>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 30px;">
        If you didn't create an account with us, please ignore this email.
      </p>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
        <p>© 2024 Electroline Rwanda Ltd. All rights reserved.</p>
        <p>Your trusted partner in electronics and technology solutions.</p>
      </div>
    </div>
  `;

  return await sendEmail(userEmail, 'Verify Your Email - Electroline Rwanda Ltd.', htmlContent);
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Welcome to Eletroline Rwanda!';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Welcome to Eletroline Rwanda!</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for joining Eletroline Rwanda! We're excited to have you as part of our community.</p>
      <p>You can now browse our products and place orders with ease.</p>
      <p>Happy shopping!</p>
      <hr>
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;

  return await sendEmail(userEmail, subject, htmlContent);
};