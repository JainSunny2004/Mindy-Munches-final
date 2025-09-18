const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const testimonialRoutes = require("./routes/testimonials");
const adminRoutes = require("./routes/admin");
const videoTestimonialRoutes = require("./routes/videoTestimonials");
const newsletterRoutes = require("./routes/newsLetter");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/mindy-munchs",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", videoTestimonialRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payments", paymentRoutes);

// ================================================================
// EMAIL TEST ROUTES - FIXED IMPORTS ✅
// ================================================================

// Test email service configuration status
app.get('/api/test/email-status', (req, res) => {
  const status = {
    service: 'Brevo API',
    apiKey: process.env.BREVO_API_KEY ? '✅ Configured' : '❌ Missing',
    senderEmail: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'Not configured',
    senderName: process.env.BREVO_SENDER_NAME || 'Mindy Munchs',
    frontendUrl: process.env.FRONTEND_URL || 'Not configured',
    freeLimit: '300 emails/day',
    renderCompatible: '✅ Yes',
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Brevo email service configuration status',
    status
  });
});

// Test welcome email - ✅ FIXED IMPORT PATH
app.post('/api/test/welcome-email', async (req, res) => {
  try {
    // ✅ CORRECT: Use the actual emailService.js file
    const { sendWelcomeEmail } = require('./services/emailService');
    
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    console.log(`🧪 Testing welcome email to ${email}`);
    await sendWelcomeEmail(email, name || 'Test User');
    
    res.json({
      success: true,
      message: `Welcome email sent successfully to ${email}`,
      service: process.env.BREVO_API_KEY ? 'Brevo API' : 'No Brevo API Key configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
});

// Test order confirmation email - ✅ FIXED IMPORT PATH
app.post('/api/test/order-email', async (req, res) => {
  try {
    // ✅ CORRECT: Use the actual emailService.js file
    const { sendOrderConfirmation } = require('./services/emailService');
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Mock order details for testing
    const mockOrderDetails = {
      orderId: 'MM' + Date.now().toString().slice(-6) + '999',
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
        name: 'Test User',
        street: '123 Test Street, Test Colony',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456',
        country: 'India',
        phone: '+91 9876543210'
      }
    };

    console.log(`🧪 Testing order confirmation email to ${email}`);
    await sendOrderConfirmation(email, mockOrderDetails);
    
    res.json({
      success: true,
      message: `Order confirmation email sent successfully to ${email}`,
      service: process.env.BREVO_API_KEY ? 'Brevo API' : 'No Brevo API Key configured',
      orderId: mockOrderDetails.orderId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test order email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation email',
      error: error.message
    });
  }
});

// Test password reset email - ✅ FIXED IMPORT PATH
app.post('/api/test/reset-email', async (req, res) => {
  try {
    // ✅ CORRECT: Use the actual emailService.js file
    const { sendPasswordReset } = require('./services/emailService');
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Generate a mock reset token for testing
    const mockResetToken = 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    console.log(`🧪 Testing password reset email to ${email}`);
    await sendPasswordReset(email, mockResetToken);
    
    res.json({
      success: true,
      message: `Password reset email sent successfully to ${email}`,
      service: process.env.BREVO_API_KEY ? 'Brevo API' : 'No Brevo API Key configured',
      resetToken: mockResetToken,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test reset email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
});

// Test newsletter email - ✅ FIXED IMPORT PATH
app.post('/api/test/newsletter-email', async (req, res) => {
  try {
    // ✅ CORRECT: Use the actual emailService.js file
    const { sendNewsletterEmail } = require('./services/emailService');
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const subject = '📰 Mindy Munchs Newsletter - Test Edition';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Newsletter Test Success!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Welcome to Mindy Munchs Newsletter Test!</h2>
          <p>This is a test newsletter to verify our email integration is working perfectly.</p>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>✅ Sent via ${process.env.BREVO_API_KEY ? 'Brevo API' : 'No Brevo API Key'}</li>
            <li>📧 Test Email: ${email}</li>
            <li>⏰ Timestamp: ${new Date().toISOString()}</li>
            <li>🎯 Status: Integration Working!</li>
          </ul>
          <p>If you received this email, our email service is working perfectly! 🚀</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/products" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              🛍️ Shop Now
            </a>
          </div>
        </div>
      </div>
    `;

    console.log(`🧪 Testing newsletter email to ${email}`);
    await sendNewsletterEmail(email, subject, htmlContent);
    
    res.json({
      success: true,
      message: `Newsletter email sent successfully to ${email}`,
      service: process.env.BREVO_API_KEY ? 'Brevo API' : 'No Brevo API Key configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test newsletter email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter email',
      error: error.message
    });
  }
});

// ================================================================
// END OF EMAIL TEST ROUTES
// ================================================================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Mindy Munchs API is running",
    emailService: process.env.BREVO_API_KEY ? 'Brevo API (Production Ready)' : 'No email service configured',
    timestamp: new Date().toISOString(),
  });
});

// Test new product notification
app.post('/api/test/new-product-notification', async (req, res) => {
  try {
    const { testNewProductNotification } = require('./services/notificationService');
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Mock product data for testing
    const mockProduct = {
      _id: '60f1b2b3c4d5e6f7a8b9c0d1',
      name: 'Premium Roasted Makhana Mix',
      description: 'Crunchy and nutritious fox nuts roasted to perfection with traditional Indian spices. A healthy snack that\'s both delicious and guilt-free!',
      price: 299,
      originalPrice: 399,
      category: 'snacks',
      stock: 25,
      images: [
        { url: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Makhana' }
      ]
    };

    console.log(`🧪 Testing new product notification to ${email}`);
    const result = await testNewProductNotification(mockProduct, email);
    
    res.json({
      success: true,
      message: `New product notification sent successfully to ${email}`,
      product: mockProduct.name,
      service: process.env.BREVO_API_KEY ? 'Brevo API' : 'No Brevo API Key configured',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test new product notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send new product notification',
      error: error.message
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📧 Email Service: ${process.env.BREVO_API_KEY ? 'Brevo API (Production Ready)' : '⚠️  No Brevo API key - add BREVO_API_KEY to .env'}`);
});

module.exports = app;
