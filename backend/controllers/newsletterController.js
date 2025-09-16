const User = require('../models/User');
const Guest = require('../models/Guest'); // <-- ADD THIS LINE
const emailService = require('../services/emailService');

exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;

    // Get subscribed emails from both User and Guest models
    const users = await User.find({ newsletterSubscribed: true });
    const guests = await Guest.find({ newsletterSubscribed: true });
    
    // Combine all emails into a single array
    const subscriberEmails = [
      ...users.map(user => user.email),
      ...guests.map(guest => guest.email)
    ];

    for (const email of subscriberEmails) {
      // You may want to send emails in batches for a large number of subscribers
      await emailService.sendNewsletterEmail(email, subject, htmlContent);
    }

    res.json({
      success: true,
      message: `Newsletter sent to ${subscriberEmails.length} subscribers`
    });
  } catch (error) {
    console.error('Newsletter sending failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter'
    });
  }
};