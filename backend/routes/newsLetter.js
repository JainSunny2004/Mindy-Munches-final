const express = require('express');
const router = express.Router();
const {
  subscribeToNewsletter,
  sendNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterStats
} = require('../controllers/newsletterController');
const { authenticate, requireAdmin } = require('../middleware/auth'); // FIXED: correct import names

// Public routes
router.post('/subscribe', subscribeToNewsletter);
router.get('/unsubscribe', unsubscribeFromNewsletter);

// Admin routes
router.post('/send', authenticate, requireAdmin, sendNewsletter); // FIXED: correct function names
router.get('/stats', authenticate, requireAdmin, getNewsletterStats); // FIXED: correct function names

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Newsletter API is working!' });
});

module.exports = router;
