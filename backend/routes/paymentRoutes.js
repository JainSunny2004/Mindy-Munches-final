const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

const { authenticate } = require('../middleware/auth');

// ✅ FIXED: Add authenticate middleware to both routes
router.post('/create-razorpay-order', authenticate, paymentController.createRazorpayOrder);
router.post('/verify-payment', authenticate, paymentController.verifyPayment);


module.exports = router;