import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import sendResponse from '../utils/sendResponse.js';
import { sendOrderNotificationEmail } from '../utils/emailService.js';

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return sendResponse(res, 400, false, 'No order items');
    }

    // Verify products exist and update stock
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return sendResponse(res, 404, false, `Product ${item.name} not found`);
      }
      if (product.countInStock < item.quantity) {
        return sendResponse(res, 400, false, `Insufficient stock for ${item.name}`);
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // Update product stock
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { countInStock: -item.quantity } }
      );
    }

    sendResponse(res, 201, true, createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    sendResponse(res, 400, false, error.message);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .populate('adminApprovedBy', 'name email');

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    sendResponse(res, 200, true, order);
  } catch (error) {
    console.error('Get order error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name')
      .populate('adminApprovedBy', 'name email')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .populate('adminApprovedBy', 'name email')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Processing';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer.email_address
    };

    const updatedOrder = await order.save();
    sendResponse(res, 200, true, updatedOrder);
  } catch (error) {
    console.error('Update order to paid error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    // Get user for notifications
    const user = await User.findById(order.user);

    // When status is "Delivered", it means product reached client and needs admin approval
    if (status === 'Delivered') {
      order.status = status;
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.adminApprovalRequired = true;
      order.adminApprovalStatus = 'pending';
    } else if (status === 'Received') {
      // This status means admin approved that client received the product
      if (!req.user.isAdmin) {
        return sendResponse(res, 403, false, 'Only admin can approve order reception');
      }
      order.status = status;
      order.adminApprovalRequired = false;
      order.adminApprovalStatus = 'approved';
      order.adminApprovedBy = req.user._id;
      order.adminApprovedAt = Date.now();
      if (adminComments) {
        order.adminComments = adminComments;
      }
    } else {
      order.status = status;
      
      // Send notification to user for order status changes
      if (user) {
        if (status === 'Approved') {
          user.notifications.push({
            title: 'Order Approved',
            message: `Your order #${order._id.toString().slice(-8)} has been approved and will be processed soon.`,
            type: 'success'
          });
          await user.save();
          
          // Send email notification
          await sendOrderNotificationEmail(
            user.email, 
            user.name, 
            order._id.toString(), 
            'approved'
          );
        } else if (status === 'Rejected') {
          user.notifications.push({
            title: 'Order Rejected',
            message: `Your order #${order._id.toString().slice(-8)} has been rejected. Please contact support for more information.`,
            type: 'error'
          });
          await user.save();
          
          // Send email notification
          await sendOrderNotificationEmail(
            user.email, 
            user.name, 
            order._id.toString(), 
            'rejected'
          );
        } else if (status === 'Shipped') {
          user.notifications.push({
            title: 'Order Shipped',
            message: `Your order #${order._id.toString().slice(-8)} has been shipped and is on its way to you.`,
            type: 'info'
          });
          await user.save();
          
          // Send email notification
          await sendOrderNotificationEmail(
            user.email, 
            user.name, 
            order._id.toString(), 
            'shipped'
          );
        } else if (status === 'Delivered') {
          user.notifications.push({
            title: 'Order Delivered',
            message: `Your order #${order._id.toString().slice(-8)} has been delivered successfully.`,
            type: 'success'
          });
          await user.save();
          
          // Send email notification
          await sendOrderNotificationEmail(
            user.email, 
            user.name, 
            order._id.toString(), 
            'delivered'
          );
        }
      }
    }

    const updatedOrder = await order.save();
    sendResponse(res, 200, true, updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

// New function for admin to approve/reject order reception
export const approveOrderReception = async (req, res) => {
  try {
    const { approved, adminComments } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    if (!req.user.isAdmin) {
      return sendResponse(res, 403, false, 'Only admin can approve orders');
    }

    if (!order.adminApprovalRequired) {
      return sendResponse(res, 400, false, 'This order does not require admin approval');
    }

    const user = await User.findById(order.user._id || order.user);
    
    if (approved) {
      order.status = 'Received';
      order.adminApprovalStatus = 'approved';
      
      // Add notification to user
      if (user) {
        user.notifications.push({
          title: 'Order Approved',
          message: `Your order #${order._id.toString().slice(-8)} has been approved and completed successfully.`,
          type: 'success'
        });
        await user.save();
        
        // Send email notification
        await sendOrderNotificationEmail(
          user.email, 
          user.name, 
          order._id.toString(), 
          'approved'
        );
      }
    } else {
      order.adminApprovalStatus = 'rejected';
      
      // Add notification to user
      if (user) {
        user.notifications.push({
          title: 'Order Rejected',
          message: `Your order #${order._id.toString().slice(-8)} has been rejected. ${adminComments || 'Please contact support for more information.'}`,
          type: 'error'
        });
        await user.save();
        
        // Send email notification
        await sendOrderNotificationEmail(
          user.email, 
          user.name, 
          order._id.toString(), 
          'rejected'
        );
      }
    }

    order.adminApprovedBy = req.user._id;
    order.adminApprovedAt = Date.now();
    if (adminComments) {
      order.adminComments = adminComments;
    }

    const updatedOrder = await order.save();
    sendResponse(res, 200, true, updatedOrder);
  } catch (error) {
    console.error('Approve order reception error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

// Get orders pending admin approval
export const getPendingApprovalOrders = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return sendResponse(res, 403, false, 'Access denied');
    }

    const orders = await Order.find({ 
      adminApprovalRequired: true,
      adminApprovalStatus: 'pending'
    })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ deliveredAt: -1 });

    sendResponse(res, 200, true, orders);
  } catch (error) {
    console.error('Get pending approval orders error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
