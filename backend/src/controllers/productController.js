
import Product from '../models/Product.js';
import sendResponse from '../utils/sendResponse.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, image, images, countInStock, category, featured, isNew, discount } = req.body;
    
    const product = new Product({
      name,
      price,
      originalPrice,
      description,
      image,
      images: images || [],
      countInStock,
      category,
      featured,
      isNew,
      discount
    });

    const savedProduct = await product.save();
    sendResponse(res, 201, true, savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    sendResponse(res, 400, false, error.message);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    sendResponse(res, 200, true, {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }
    sendResponse(res, 200, true, product);
  } catch (error) {
    console.error('Get product error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }
    
    sendResponse(res, 200, true, product);
  } catch (error) {
    console.error('Update product error:', error);
    sendResponse(res, 400, false, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return sendResponse(res, 404, false, 'Product not found');
    }
    sendResponse(res, 200, true, { message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    sendResponse(res, 200, true, products);
  } catch (error) {
    console.error('Get featured products error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
