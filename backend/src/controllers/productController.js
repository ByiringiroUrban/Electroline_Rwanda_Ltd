
import Product from '../models/Product.js';
import sendResponse from '../utils/sendResponse.js';

export const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    
    const { name, price, originalPrice, description, image, images, countInStock, category, featured, isNew, discount } = req.body;
    
    const product = new Product({
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      description,
      image,
      images: images || [],
      countInStock: parseInt(countInStock) || 0,
      category,
      featured: Boolean(featured),
      isNew: Boolean(isNew),
      discount
    });

    const savedProduct = await product.save();
    console.log('Product created successfully:', savedProduct);
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
    
    // Only allow valid categories
    const validCategories = [
      'CCTV Cameras & Security Systems',
      'Electrical Installations & Maintenance', 
      'Networking & Telecommunications',
      'IT Services & Consultancy',
      'Technical Testing & Repair Services',
      'Electronic Components & Tools'
    ];
    
    if (category) {
      if (validCategories.includes(category)) {
        query.category = category;
      } else {
        // Return empty results for invalid categories
        return sendResponse(res, 200, true, {
          products: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            totalProducts: 0,
            hasNext: false,
            hasPrev: false
          }
        });
      }
    } else {
      // Only show products with valid categories
      query.category = { $in: validCategories };
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
    const updateData = { ...req.body };
    
    // Ensure proper data types
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.countInStock) updateData.countInStock = parseInt(updateData.countInStock);
    if (updateData.featured !== undefined) updateData.featured = Boolean(updateData.featured);
    if (updateData.isNew !== undefined) updateData.isNew = Boolean(updateData.isNew);
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
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
    // Only get featured products with valid categories
    const validCategories = [
      'CCTV Cameras & Security Systems',
      'Electrical Installations & Maintenance', 
      'Networking & Telecommunications',
      'IT Services & Consultancy',
      'Technical Testing & Repair Services',
      'Electronic Components & Tools'
    ];
    
    const products = await Product.find({ 
      featured: true,
      category: { $in: validCategories }
    }).limit(8);
    
    sendResponse(res, 200, true, products);
  } catch (error) {
    console.error('Get featured products error:', error);
    sendResponse(res, 500, false, error.message);
  }
};
