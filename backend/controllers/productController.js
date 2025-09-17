const { validationResult } = require('express-validator');
const Product = require('../models/Product');

const User = require('../models/User');
const Guest = require('../models/Guest');
const emailService = require('../services/emailService');

// Get all products with filtering, sorting, and pagination
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      isActive = true
    } = req.query;

    // Build filter object
    const filter = {};
    if (isActive !== 'false') {
      filter.isActive = true;
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query - FIXED: Use correct populate path
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('ratings.reviews.user', 'name');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNextPage: skip + products.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const filter = {
      isActive: true,
      $text: { $search: q }
    };

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        products,
        query: q
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

// New function to get bestsellers
const getBestsellers = async (req, res) => {
  try {
    const products = await Product.find({
      isBestseller: true,
      isActive: true,
    }).sort({ 'ratings.count': -1 }).limit(3);

    res.json({
     success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get bestsellers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bestsellers' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ratings.reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    console.log('Create product request received:', req.body);
    console.log('User role:', req.user?.role);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Ensure images array has at least one image with proper structure
    if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
      req.body.images = [{
        url: '/placeholder-image.jpg',
        alt: req.body.name || 'Product image',
        isPrimary: true
      }];
    }

    // Ensure at least one image is marked as primary
    const hasPrimary = req.body.images.some(img => img.isPrimary);
    if (!hasPrimary && req.body.images.length > 0) {
      req.body.images[0].isPrimary = true;
    }

    // Create product with processed data
    const productData = {
      ...req.body,
      // Ensure proper data types
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stock: parseInt(req.body.stock),
      weight: req.body.weight && req.body.weight.value ? {
        value: parseFloat(req.body.weight.value),
        unit: req.body.weight.unit || 'g'
      } : undefined,
      // Handle nutritional info
      nutritionalInfo: req.body.nutritionalInfo ? 
        Object.keys(req.body.nutritionalInfo).reduce((acc, key) => {
          const value = parseFloat(req.body.nutritionalInfo[key]);
          if (!isNaN(value)) acc[key] = value;
          return acc;
        }, {}) : undefined,
      // Ensure boolean fields
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : false,
      isOrganic: req.body.isOrganic !== undefined ? Boolean(req.body.isOrganic) : false,
      isBestseller: req.body.isBestseller !== undefined ? Boolean(req.body.isBestseller) : false
    };

    const product = new Product(productData);
    await product.save();
    
    console.log('Product created successfully:', product._id);
    try {
    // Send newsletter to all subscribers about the new product
    const users = await User.find({ newsletterSubscribed: true }).select('email unsubscribeToken');
    const guests = await Guest.find({ newsletterSubscribed: true }).select('email unsubscribeToken');
    
    const allSubscribers = [
        ...users.map(user => ({ email: user.email, token: user.unsubscribeToken })),
        ...guests.map(guest => ({ email: guest.email, token: guest.unsubscribeToken }))
    ];

    if (allSubscribers.length > 0) {
        console.log(`Sending new product notification to ${allSubscribers.length} subscribers`);
        
        // Send emails in batches to avoid overwhelming the email service
        const batchSize = 10;
        for (let i = 0; i < allSubscribers.length; i += batchSize) {
            const batch = allSubscribers.slice(i, i + batchSize);
            
            await Promise.all(
                batch.map(subscriber => 
                    emailService.sendNewProductNotification(
                        subscriber.email, 
                        product, 
                        subscriber.token
                    ).catch(error => {
                        console.error(`Failed to send email to ${subscriber.email}:`, error);
                    })
                )
            );
            
            // Add small delay between batches
            if (i + batchSize < allSubscribers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        console.log('New product notifications sent successfully');
    }
} catch (emailError) {
    console.error('Error sending new product notifications:', emailError);
    // Don't fail the product creation if email sending fails
}
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};


// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Process the update data similar to create
    const updateData = {
      ...req.body,
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stock: parseInt(req.body.stock),
      weight: req.body.weight && req.body.weight.value ? {
        value: parseFloat(req.body.weight.value),
        unit: req.body.weight.unit || 'g'
      } : undefined,
      nutritionalInfo: req.body.nutritionalInfo ? 
        Object.keys(req.body.nutritionalInfo).reduce((acc, key) => {
          const value = parseFloat(req.body.nutritionalInfo[key]);
          if (!isNaN(value)) acc[key] = value;
          return acc;
        }, {}) : undefined,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : undefined,
      isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : undefined,
      isOrganic: req.body.isOrganic !== undefined ? Boolean(req.body.isOrganic) : undefined,
      isBestseller: req.body.isBestseller !== undefined ? Boolean(req.body.isBestseller) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};


// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Toggle product status (Admin only)
const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product status',
      error: error.message
    });
  }
};

// Add product review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.ratings.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add new review
    product.ratings.reviews.push({
      user: userId,
      rating,
      comment
    });

    // Update ratings
    const totalRating = product.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = totalRating / product.ratings.reviews.length;
    product.ratings.count = product.ratings.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        review: product.ratings.reviews[product.ratings.reviews.length - 1]
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('ratings.reviews.user', 'name')
      .select('ratings');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        reviews: product.ratings.reviews,
        ratings: product.ratings
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getCategories,
  searchProducts,
  getBestsellers,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  addReview,
  getProductReviews
};
