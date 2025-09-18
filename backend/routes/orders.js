const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('shippingAddress.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('shippingAddress.phone')
    .trim()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('ZIP code must be between 5 and 10 characters'),
  body('paymentMethod')
    .isIn(['cod', 'razorpay'])
    .withMessage('Payment method must be either COD or Razorpay'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateOrderStatusValidation = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status')
];

// ✅ ADMIN ROUTES FIRST (more specific routes should come first)
router.get('/admin/all', authenticate, requireAdmin, orderController.getAllOrders);
router.get('/admin/analytics', authenticate, requireAdmin, orderController.getOrderAnalytics);
router.patch('/admin/:id/status', authenticate, requireAdmin, updateOrderStatusValidation, orderController.updateOrderStatus);

// ✅ USER ROUTES (less specific routes come after)
router.get('/', authenticate, orderController.getUserOrders);
router.post('/', authenticate, createOrderValidation, orderController.createOrder);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router;
