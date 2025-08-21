import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  description: { 
    type: String,
    required: [true, 'Category description is required'],
    trim: true
  },
  image: { 
    type: String,
    default: '/api/placeholder/400/300'
  },
  color: {
    type: String,
    default: 'bg-blue-100 text-blue-800'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);