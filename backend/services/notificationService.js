// services/notificationService.js
const User = require('../models/User');
const Guest = require('../models/Guest');
const { sendNewProductNotification } = require('./emailService');

// Send new product notifications to all newsletter subscribers
exports.notifyNewProduct = async (productData) => {
  try {
    console.log(` Starting new product notification for: ${productData.name}`);
    
    // Get all users who are subscribed to newsletter and are active
    const users = await User.find({
      newsletterSubscribed: true,
      isActive: true
    }).select('email name');

    // Get all guests who are subscribed to newsletter
    const guests = await Guest.find({
      newsletterSubscribed: true
    }).select('email');

    // Combine all subscribers
    const allSubscribers = [
      ...users.map(user => ({ 
        email: user.email, 
        name: user.name || 'Valued Customer' 
      })),
      ...guests.map(guest => ({ 
        email: guest.email, 
        name: 'Valued Customer' 
      }))
    ];

    if (allSubscribers.length === 0) {
      console.log(' No newsletter subscribers found');
      return { success: true, sent: 0, failed: 0 };
    }

    console.log(` Found ${allSubscribers.length} newsletter subscribers`);

    const results = {
      sent: 0,
      failed: 0,
      details: []
    };

    // Send emails in batches to avoid overwhelming Brevo API
    const batchSize = 5; // Small batches for Brevo free tier
    
    for (let i = 0; i < allSubscribers.length; i += batchSize) {
      const batch = allSubscribers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (subscriber) => {
        try {
          await sendNewProductNotification(
            subscriber.email, 
            productData, 
            subscriber.name
          );
          
          console.log(` Notification sent to ${subscriber.email}`);
          results.sent++;
          results.details.push({
            email: subscriber.email,
            status: 'success'
          });
        } catch (error) {
          console.error(` Failed to send to ${subscriber.email}:`, error.message);
          results.failed++;
          results.details.push({
            email: subscriber.email,
            status: 'failed',
            error: error.message
          });
        }
      });

      // Wait for current batch to complete
      await Promise.all(batchPromises);
      
      // Add delay between batches to respect Brevo rate limits
      if (i + batchSize < allSubscribers.length) {
        console.log(` Waiting 2 seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(` New product notification complete:`);

    return {
      success: true,
      sent: results.sent,
      failed: results.failed,
      productName: productData.name,
      details: results.details
    };

  } catch (error) {
    console.error('Error in notifyNewProduct:', error);
    throw error;
  }
};

// Test function to send notification to admin only
exports.testNewProductNotification = async (productData, adminEmail) => {
  try {
    
    await sendNewProductNotification(adminEmail, productData, 'Admin User');
    
    return { success: true, sent: 1, failed: 0 };
    
  } catch (error) {

    throw error;
  }
};
