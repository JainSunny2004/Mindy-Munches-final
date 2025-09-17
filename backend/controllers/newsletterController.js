const User = require('../models/User');
const Guest = require('../models/Guest');
const emailService = require('../services/emailService');

// Subscribe to newsletter
exports.subscribeToNewsletter = async (req, res) => {
  try {
    const { email, name, source = 'footer' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const existingGuest = await Guest.findOne({ email });
    const existingUser = await User.findOne({ email });

    if (existingGuest && existingGuest.newsletterSubscribed) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    if (existingUser && existingUser.newsletterSubscribed) {
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
        name: name || '',
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
};

// Other functions remain the same...
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;
    const users = await User.find({ newsletterSubscribed: true });
    const guests = await Guest.find({ newsletterSubscribed: true });

    const subscriberEmails = [
      ...users.map(user => user.email),
      ...guests.map(guest => guest.email)
    ];

    if (subscriberEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No subscribers found'
      });
    }

    const batchSize = 10;
    for (let i = 0; i < subscriberEmails.length; i += batchSize) {
      const batch = subscriberEmails.slice(i, i + batchSize);
      await Promise.all(
        batch.map(email => emailService.sendNewsletterEmail(email, subject, htmlContent))
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
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

exports.unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required'
      });
    }

    const user = await User.findOne({ unsubscribeToken: token });
    const guest = await Guest.findOne({ unsubscribeToken: token });

    if (user) {
      user.newsletterSubscribed = false;
      await user.save();
    } else if (guest) {
      guest.newsletterSubscribed = false;
      await guest.save();
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invalid unsubscribe token'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
};

exports.getNewsletterStats = async (req, res) => {
  try {
    const userSubscribers = await User.countDocuments({ newsletterSubscribed: true });
    const guestSubscribers = await Guest.countDocuments({ newsletterSubscribed: true });
    const totalSubscribers = userSubscribers + guestSubscribers;

    const subscriptionSources = await Guest.aggregate([
      { $match: { newsletterSubscribed: true } },
      { $group: { _id: '$subscriptionSource', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalSubscribers,
        userSubscribers,
        guestSubscribers,
        subscriptionSources
      }
    });

  } catch (error) {
    console.error('Get newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get newsletter statistics'
    });
  }
};
