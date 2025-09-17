const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Guest = require('../models/Guest');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email sending helper function
const sendProductNotificationEmail = async (product, type = 'new') => {
  try {
    console.log('Sending product notification email...');
    
    // Get all newsletter subscribers
    const users = await User.find({ newsletterSubscribed: true }).select('email');
    const guests = await Guest.find({ newsletterSubscribed: true }).select('email');
    
    const subscriberEmails = [
      ...users.map(user => user.email),
      ...guests.map(guest => guest.email)
    ];
    
    console.log(`Newsletter would be sent to ${subscriberEmails.length} subscribers:`);
    subscriberEmails.forEach(email => console.log(`   - ${email}`));
    console.log(`Product: ${product.name} (Rs.${product.price})`);

    // Actually send emails if subscribers exist
    if (subscriberEmails.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });

      const isUpdate = type === 'update';
      const subject = isUpdate ? `Updated Product: ${product.name}` : `New Product: ${product.name}`;
      const actionText = isUpdate ? 'Product Updated!' : 'New Product Alert!';
      
      // Send email to each subscriber
      for (const email of subscriberEmails) {
        try {
          await transporter.sendMail({
            from: `"Mindy Munches" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="color: #e67e22;">${actionText}</h2>
                </div>
                
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">${product.name}</h3>
                  <p style="color: #666; line-height: 1.6;">${product.description}</p>
                  
                  <div style="margin: 20px 0;">
                    <span style="font-size: 24px; color: #e67e22; font-weight: bold;">Rs.${product.price}</span>
                    ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; margin-left: 10px;">Rs.${product.originalPrice}</span>` : ''}
                  </div>
                  
                  ${product.isOrganic ? '<span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">ORGANIC</span>' : ''}
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/product/${product._id}" 
                       style="background: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                       Shop Now
                    </a>
                  </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0; color: #666;">
                  <p>Thank you for being part of the Mindy Munches family!</p>
                  <p style="font-size: 14px;">Made with love in India</p>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
                  <p><strong>Mindy Munches</strong></p>
                  <p>Ghaziabad, Uttar Pradesh, India</p>
                  <p>Email: Mindymunchs@gmail.com</p>
                </div>
              </div>
            `
          });
          console.log(`Email sent successfully to: ${email}`);
        } catch (emailSendError) {
          console.error(`Failed to send email to ${email}:`, emailSendError.message);
        }
      }
    }
  } catch (emailError) {
    console.error('Newsletter notification error:', emailError);
  }
};

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

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews', 'rating comment user createdAt');

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate('reviews', 'rating comment user createdAt')
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('reviews', 'rating');

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
};

// Get bestseller products
const getBestsellerProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({
      isActive: true,
      isBestseller: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('reviews', 'rating');

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get bestseller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bestseller products'
    });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    console.log('Create product request received:', req.body);
    console.log('User role:', req.user?.role);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Create product data
    const productData = {
      ...req.body,
      createdBy: req.user.id
    };

    const product = new Product(productData);
    await product.save();

    console.log('Product created successfully:', product._id);

    // Send newsletter notification for new product (only if product is active and featured)
    if (product.isActive && product.isFeatured) {
      try {
        await sendProductNotificationEmail(product, 'new');
      } catch (emailError) {
        console.error('Failed to send newsletter notification:', emailError);
        // Don't fail the product creation if email fails
      }
    } else {
      console.log(`Newsletter not triggered (isActive: ${product.isActive}, isFeatured: ${product.isFeatured})`);
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    console.log('Update product request received for ID:', req.params.id);
    console.log('Update data:', req.body);
    console.log('User role:', req.user?.role);

    const { id } = req.params;

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get the original product for comparison
    const originalProduct = await Product.findById(id);
    if (!originalProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, updatedBy: req.user.id, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    console.log('Product updated successfully:', updatedProduct._id);

    // Check if product became featured or if it was already featured and still active
    const shouldSendNotification = updatedProduct.isActive && updatedProduct.isFeatured && (
      // Product just became featured
      (!originalProduct.isFeatured && updatedProduct.isFeatured) ||
      // Product was already featured and significant changes were made (price, description, etc.)
      (originalProduct.isFeatured && (
        originalProduct.price !== updatedProduct.price ||
        originalProduct.description !== updatedProduct.description ||
        originalProduct.name !== updatedProduct.name
      ))
    );

    if (shouldSendNotification) {
      try {
        await sendProductNotificationEmail(updatedProduct, 'update');
      } catch (emailError) {
        console.error('Failed to send newsletter notification:', emailError);
        // Don't fail the product update if email fails
      }
    } else {
      console.log('Newsletter not triggered - no significant changes or product not featured');
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
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
      message: 'Failed to delete product'
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, sort = 'createdAt', order = 'desc' } = req.query;

    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const products = await Product.find({
      category: category,
      isActive: true
    })
    .sort(sortObj)
    .limit(parseInt(limit))
    .populate('reviews', 'rating');

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category'
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q: searchTerm, limit = 20 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const products = await Product.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            { category: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      ]
    })
    .limit(parseInt(limit))
    .populate('reviews', 'rating');

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getBestsellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts
};
