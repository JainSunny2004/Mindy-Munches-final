const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBestsellers } = require('../controllers/productController');
const { searchUsers, getAllAdmins, promoteUser, demoteAdmin } = require('../controllers/adminController');


// Protect all routes and allow only admins
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/bestsellers <-- ADD THIS NEW ROUTE
router.get('/bestsellers', getBestsellers);

// GET /api/admin/overview-stats
router.get('/overview-stats', getDashboardStats);

// User management routes
router.get('/users/search', searchUsers);           // Search users
router.get('/admins', getAllAdmins);               // Get all admins  
router.patch('/users/:id/promote', promoteUser);   // Make user admin
router.patch('/users/:id/demote', demoteAdmin);    // Remove admin role

module.exports = router;