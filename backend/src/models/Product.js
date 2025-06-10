
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  description: { 
    type: String,
    trim: true
  },
  image: { 
    type: String,
    default: '/api/placeholder/300/300'
  },
  images: [{
    type: String,
    default: []
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Shoes', 'Clothes', 'Accessories'],
    default: 'Clothes'
  },
  countInStock: { 
    type: Number, 
    default: 0,
    min: [0, 'Stock count cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Number of reviews cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  discount: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Calculate discount percentage if originalPrice exists
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    const discount = ((this.originalPrice - this.price) / this.originalPrice) * 100;
    return `${Math.round(discount)}% OFF`;
  }
  return null;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Product', productSchema);
