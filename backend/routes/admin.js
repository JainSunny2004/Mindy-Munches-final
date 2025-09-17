const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBestsellerProducts } = require('../controllers/productController'); // FIXED: correct function name

// Protect all routes and allow only admins
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/bestsellers - FIXED: using correct function
router.get('/bestsellers', getBestsellerProducts);

// GET /api/admin/overview-stats - FIXED: inline implementation
router.get('/overview-stats', async (req, res) => {
  try {
    const Product = require('../models/Product');
    const User = require('../models/User');
    const Guest = require('../models/Guest');

    // Get dashboard stats
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const bestsellerProducts = await Product.countDocuments({ isBestseller: true });
    const totalUsers = await User.countDocuments();
    const newsletterSubscribers = await Guest.countDocuments({ newsletterSubscribed: true });

    // Get recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price category createdAt isActive isFeatured');

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          activeProducts,
          featuredProducts,
          bestsellerProducts,
          totalUsers,
          newsletterSubscribers
        },
        recentProducts
      }
    });

  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

module.exports = router;
