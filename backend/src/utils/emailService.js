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