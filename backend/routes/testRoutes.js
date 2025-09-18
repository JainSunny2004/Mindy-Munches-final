// backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { 
  sendWelcomeEmail, 
  sendOrderConfirmation, 
  sendPasswordReset,
  sendNewsletterEmail 
} = require('../services/emailService');

// Test welcome email
router.post('/test-welcome-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    await sendWelcomeEmail(email, name || 'Test User');
    
    res.json({
      success: true,
      message: `Welcome email sent successfully to ${email}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
});

// Test order confirmation email
router.post('/test-order-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Mock order details for testing
    const mockOrderDetails = {
      orderId: 'MM' + Date.now().toString().slice(-6) + '123',
      items: [
        {
          name: 'Premium Sattu Mix',
          quantity: 2,
          price: 299,
          image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Sattu'
        },
        {
          name: 'Roasted Makhana',
          quantity: 1,
          price: 199,
          image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Makhana'
        }
      ],
      totalAmount: 797,
      shippingAddress: {
        name: 'Sunny Test User',
        street: '123 Test Street, Test Colony',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456',
        country: 'India',
        phone: '+91 9876543210'
      }
    };

    await sendOrderConfirmation(email, mockOrderDetails);
    
    res.json({
      success: true,
      message: `Order confirmation email sent successfully to ${email}`,
      orderId: mockOrderDetails.orderId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test order email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation email',
      error: error.message
    });
  }
});

// Test password reset email
router.post('/test-reset-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Generate a mock reset token for testing
    const mockResetToken = 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    await sendPasswordReset(email, mockResetToken);
    
    res.json({
      success: true,
      message: `Password reset email sent successfully to ${email}`,
      resetToken: mockResetToken,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test reset email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
});

// Test newsletter email
router.post('/test-newsletter-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const subject = '📰 Mindy Munchs Newsletter - Test Edition';
    const htmlContent = `
      <h2>🎉 Welcome to Mindy Munchs Newsletter Test!</h2>
      <p>This is a test newsletter to verify our SendPulse integration is working perfectly.</p>
      <p><strong>Test Details:</strong></p>
      <ul>
        <li>Sent via SendPulse API</li>
        <li>Test Email: ${email}</li>
        <li>Timestamp: ${new Date().toISOString()}</li>
      </ul>
      <p>If you received this email, our integration is working! 🚀</p>
    `;

    await sendNewsletterEmail(email, subject, htmlContent);
    
    res.json({
      success: true,
      message: `Newsletter email sent successfully to ${email}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter email',
      error: error.message
    });
  }
});

// Get SendPulse status
router.get('/sendpulse-status', (req, res) => {
  const status = {
    apiId: process.env.SENDPULSE_API_ID ? '✅ Configured' : '❌ Missing',
    apiSecret: process.env.SENDPULSE_API_SECRET ? '✅ Configured' : '❌ Missing',
    fromEmail: process.env.SENDPULSE_FROM_EMAIL || 'Not configured',
    frontendUrl: process.env.FRONTEND_URL || 'Not configured',
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'SendPulse configuration status',
    status
  });
});

module.exports = router;
