const express = require('express');
const router = express.Router();
const {
  subscribeToNewsletter,
  sendNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterStats
} = require('../controllers/newsletterController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribeToNewsletter);
router.get('/unsubscribe', unsubscribeFromNewsletter);

// Admin routes
router.post('/send', authenticateToken, isAdmin, sendNewsletter);
router.get('/stats', authenticateToken, isAdmin, getNewsletterStats);

module.exports = router;
