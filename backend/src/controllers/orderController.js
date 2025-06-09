
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import sendResponse from '../utils/sendResponse.js';

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
      .populate('orderItems.product', 'name');

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
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found');
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    sendResponse(res, 200, true, updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
