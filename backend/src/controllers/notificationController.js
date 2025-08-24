
import Notification from '../models/Notification.js';
import sendResponse from '../utils/sendResponse.js';

export const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    // Import User model
    const User = (await import('../models/User.js')).default;
    
    const notification = new Notification({
      title,
      message,
      type,
      createdBy: req.user._id
    });

    const savedNotification = await notification.save();
    
    // Add notification to all users
    await User.updateMany(
      {},
      {
        $push: {
          notifications: {
            title,
            message,
            type: type || 'info',
            read: false,
            createdAt: new Date()
          }
        }
      }
    );
    
    sendResponse(res, 201, true, savedNotification);
  } catch (error) {
    console.error('Create notification error:', error);
    sendResponse(res, 400, false, error.message);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);
    
    sendResponse(res, 200, true, notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!notification) {
      return sendResponse(res, 404, false, 'Notification not found');
    }
    
    sendResponse(res, 200, true, notification);
  } catch (error) {
    console.error('Update notification error:', error);
    sendResponse(res, 400, false, error.message);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return sendResponse(res, 404, false, 'Notification not found');
    }
    sendResponse(res, 200, true, { message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
