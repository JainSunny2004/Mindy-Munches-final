const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBestsellers } = require('../controllers/productController');
const { searchUsers, getAllAdmins, promoteUser, demoteAdmin } = require('../controllers/adminController');
const { getStockStats, updateStock, restockLowItems } = require('../controllers/stockController');



// Protect all routes and allow only admins
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/bestsellers <-- ADD THIS NEW ROUTE
router.get('/bestsellers', getBestsellers);

// GET /api/admin/overview-stats
router.get('/overview-stats', getDashboardStats);

// Stock management routes
router.get('/stock/stats', getStockStats);
router.patch('/stock/:productId', updateStock);
router.post('/stock/restock-low', restockLowItems);

// User management routes
router.get('/users/search', searchUsers);           // Search users
router.get('/admins', getAllAdmins);               // Get all admins  
router.patch('/users/:id/promote', promoteUser);   // Make user admin
router.patch('/users/:id/demote', demoteAdmin);    // Remove admin role

router.get('/analytics', getAnalytics); // Analytics endpoint

module.exports = router;