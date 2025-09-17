const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

// Simple subscribe route - no external dependencies
router.post('/subscribe', async (req, res) => {
  try {
    const { email, source = 'footer' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const existingGuest = await Guest.findOne({ email });

    if (existingGuest && existingGuest.newsletterSubscribed) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    // If guest exists but not subscribed, update subscription
    if (existingGuest) {
      existingGuest.newsletterSubscribed = true;
      existingGuest.subscriptionSource = source;
      await existingGuest.save();
    } else {
      // Create new guest subscriber
      const guest = new Guest({
        email,
        name: '',
        newsletterSubscribed: true,
        subscriptionSource: source
      });
      await guest.save();
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter! 🎉'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Newsletter API is working!' });
});

module.exports = router;
