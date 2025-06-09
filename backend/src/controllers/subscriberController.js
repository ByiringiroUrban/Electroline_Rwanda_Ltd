
import Subscriber from '../models/Subscriber.js';
import sendResponse from '../utils/sendResponse.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, false, 'Email is required');
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return sendResponse(res, 400, false, 'Email is already subscribed');
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return sendResponse(res, 200, true, { message: 'Subscription reactivated successfully!' });
      }
    }

    // Create new subscription
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    sendResponse(res, 201, true, { 
      message: 'Successfully subscribed to our newsletter!',
      subscriber: { email: subscriber.email, subscribedAt: subscriber.subscribedAt }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return sendResponse(res, 404, false, 'Email not found in our subscription list');
    }

    subscriber.isActive = false;
    await subscriber.save();

    sendResponse(res, 200, true, { message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true }).select('email subscribedAt');
    sendResponse(res, 200, true, subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
