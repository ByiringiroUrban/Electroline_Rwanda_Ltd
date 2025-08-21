import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const fixInvalidCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const validCategories = [
      'CCTV Cameras & Security Systems',
      'Electrical Installations & Maintenance', 
      'Networking & Telecommunications',
      'IT Services & Consultancy',
      'Technical Testing & Repair Services',
      'Electronic Components & Tools'
    ];

    // Find products with invalid categories
    const invalidProducts = await Product.find({
      category: { $nin: validCategories }
    });

    console.log(`Found ${invalidProducts.length} products with invalid categories:`);
    
    for (const product of invalidProducts) {
      console.log(`- Product: ${product.name}, Current category: ${product.category}`);
      
      // Update invalid categories to default
      await Product.findByIdAndUpdate(product._id, {
        category: 'Electronic Components & Tools'
      });
      
      console.log(`  ✓ Updated to: Electronic Components & Tools`);
    }

    console.log('All invalid categories have been fixed!');
    
    // Verify the fix
    const remainingInvalid = await Product.find({
      category: { $nin: validCategories }
    });
    
    console.log(`Remaining invalid products: ${remainingInvalid.length}`);
    
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
fixInvalidCategories();