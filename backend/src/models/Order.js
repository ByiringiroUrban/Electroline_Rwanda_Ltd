
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, required: true, default: 'Rwanda' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['MTN Mobile Money', 'Airtel Money', 'Visa/MasterCard', 'Cash on Delivery']
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    updateTime: { type: String },
    emailAddress: { type: String }
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Received', 'Cancelled'],
    default: 'Pending'
  },
  // New fields for admin approval workflow
  adminApprovalRequired: {
    type: Boolean,
    default: false
  },
  adminApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminApprovedAt: {
    type: Date
  },
  adminComments: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);
