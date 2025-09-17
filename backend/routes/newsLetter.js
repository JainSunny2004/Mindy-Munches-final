const express = require('express');
const router = express.Router();

// Import only the function that works
const { subscribeToNewsletter } = require('../controllers/newsletterController');

// Only add the working route first
router.post('/subscribe', subscribeToNewsletter);

// Simple test route to verify it's working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Newsletter route is working!' });
});

module.exports = router;
