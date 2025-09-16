const express = require('express');
const { body, param } = require('express-validator');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Validation rules
const addItemValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50')
];

const updateItemValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('quantity')
    .isInt({ min: 0, max: 50 })
    .withMessage('Quantity must be between 0 and 50')
];

const removeItemValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID')
];

// Routes
router.get('/', cartController.getCart);
router.post('/add', addItemValidation, cartController.addToCart);
router.put('/update/:productId', updateItemValidation, cartController.updateCartItem);
router.delete('/remove/:productId', removeItemValidation, cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
