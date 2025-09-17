const express = require('express');
const { body, query } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('originalPrice')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('category')
    .isIn(['superfoods', 'grains', 'spices', 'oils', 'snacks', 'beverages'])
    .withMessage('Invalid category'),
  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Subcategory cannot exceed 50 characters'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3 and 20 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('weight.value')
    .optional()
    .isNumeric()
    .withMessage('Weight value must be numeric'),
  body('weight.unit')
    .optional()
    .isIn(['g', 'kg', 'ml', 'l'])
    .withMessage('Weight unit must be g, kg, ml, or l'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be boolean'),
  body('isOrganic')
    .optional()
    .isBoolean()
    .withMessage('isOrganic must be boolean'),
  body('isBestseller')
    .optional()
    .isBoolean()
    .withMessage('isBestseller must be boolean'),
  body('origin')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Origin cannot exceed 100 characters')
];

const searchValidation = [
  query('q').optional().trim().isLength({ min: 1, max: 100 }),
  query('category').optional().isIn(['superfoods', 'grains', 'spices', 'oils', 'snacks', 'beverages']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 })
];

// Public routes
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/bestsellers', productController.getBestsellerProducts); // FIXED: was getBestsellers
router.get('/search', searchValidation, productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory); // ADDED: this route exists in controller
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticate, requireAdmin, productValidation, productController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productController.deleteProduct);

module.exports = router;
