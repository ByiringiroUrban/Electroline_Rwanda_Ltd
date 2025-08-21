import Category from '../models/Category.js';
import sendResponse from '../utils/sendResponse.js';

export const createCategory = async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    
    const { name, description, image, color } = req.body;
    
    const category = new Category({
      name,
      description,
      image,
      color: color || 'bg-blue-100 text-blue-800'
    });

    const savedCategory = await category.save();
    console.log('Category created successfully:', savedCategory);
    sendResponse(res, 201, true, savedCategory);
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, false, `Validation failed: ${validationErrors.join(', ')}`);
    }
    
    if (error.code === 11000) {
      return sendResponse(res, 400, false, 'Category name already exists');
    }
    
    sendResponse(res, 400, false, error.message);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };
    
    const categories = await Category.find(query).sort({ createdAt: -1 });
    
    sendResponse(res, 200, true, categories);
  } catch (error) {
    console.error('Get categories error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }
    sendResponse(res, 200, true, category);
  } catch (error) {
    console.error('Get category error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }
    
    sendResponse(res, 200, true, category);
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.code === 11000) {
      return sendResponse(res, 400, false, 'Category name already exists');
    }
    
    sendResponse(res, 400, false, error.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return sendResponse(res, 404, false, 'Category not found');
    }
    sendResponse(res, 200, true, { message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    sendResponse(res, 500, false, error.message);
  }
};