
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';

export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }
    
    // Sort notifications by creation date (newest first)
    const notifications = user.notifications.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sendResponse(res, 200, true, notifications);
  } catch (error) {
    console.error('Get user notifications error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }
    
    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return sendResponse(res, 404, false, 'Notification not found');
    }
    
    notification.read = true;
    await user.save();
    
    sendResponse(res, 200, true, { message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const addUserNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }
    
    user.notifications.push({
      title,
      message,
      type: type || 'info'
    });
    
    await user.save();
    sendResponse(res, 201, true, { message: 'Notification added successfully' });
  } catch (error) {
    console.error('Add user notification error:', error);
    sendResponse(res, 400, false, error.message);
  }
};
