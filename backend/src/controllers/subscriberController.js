
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
        
        // Log notification for admin email
        console.log(`Newsletter subscription notification:`);
        console.log(`- Admin email: getwayconnection@gmail.com`);
        console.log(`- Subscriber reactivated: ${email}`);
        console.log(`- Date: ${new Date().toISOString()}`);
        
        return sendResponse(res, 200, true, { 
          message: 'Welcome back! Your subscription has been reactivated successfully!' 
        });
      }
    }

    // Create new subscription
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Log notification for admin email
    console.log(`Newsletter subscription notification:`);
    console.log(`- Admin email: getwayconnection@gmail.com`);
    console.log(`- New subscriber: ${email}`);
    console.log(`- Date: ${new Date().toISOString()}`);
    console.log(`- Total subscribers: ${await Subscriber.countDocuments({ isActive: true })}`);

    sendResponse(res, 201, true, { 
      message: 'Successfully subscribed to our newsletter! Welcome to RwandaStyle!',
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

    // Log notification for admin email
    console.log(`Newsletter unsubscription notification:`);
    console.log(`- Admin email: getwayconnection@gmail.com`);
    console.log(`- Unsubscribed: ${email}`);
    console.log(`- Date: ${new Date().toISOString()}`);

    sendResponse(res, 200, true, { message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true }).select('email subscribedAt');
    sendResponse(res, 200, true, { 
      subscribers,
      total: subscribers.length,
      adminEmail: 'getwayconnection@gmail.com'
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
