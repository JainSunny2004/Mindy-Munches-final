const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a new Razorpay order
router.post('/create-razorpay-order', paymentController.createRazorpayOrder);

// Route to verify the payment signature after a successful transaction
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;