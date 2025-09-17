const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBestsellers } = require('../controllers/productController');


// Protect all routes and allow only admins
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/bestsellers <-- ADD THIS NEW ROUTE
router.get('/bestsellers', getBestsellers);

// GET /api/admin/overview-stats
router.get('/overview-stats', getDashboardStats);

module.exports = router;