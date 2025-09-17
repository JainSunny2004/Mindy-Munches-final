const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import existing route files (keeping the working ones)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const testimonialRoutes = require('./routes/testimonials');
const adminRoutes = require('./routes/admin');
const videoTestimonialRoutes = require('./routes/videoTestimonials');

// Import Guest model for newsletter functionality
const Guest = require('./models/Guest');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindy-munchs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Existing Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', videoTestimonialRoutes);
// Add this line after line 87 (after videoTestimonialRoutes)
//app.use('/api/newsletter', require('./routes/newsLetter'));


// ✅ NEWSLETTER ROUTES (Built-in - No external file needed)
// Newsletter subscription route
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name, source = 'footer' } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Email validation regex
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if email already exists
    const existingGuest = await Guest.findOne({ email: email.toLowerCase() });

    if (existingGuest && existingGuest.newsletterSubscribed) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter! 🎉'
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
        email: email.toLowerCase(),
        name: name || '',
        newsletterSubscribed: true,
        subscriptionSource: source
      });
      await guest.save();
    }


    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter. Please try again.'
    });
  }
});

// Newsletter test route
app.get('/api/newsletter/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Newsletter API is working!',
    timestamp: new Date().toISOString()
  });
});

// Get newsletter subscribers count (admin route)
app.get('/api/newsletter/stats', async (req, res) => {
  try {
    const subscriberCount = await Guest.countDocuments({ newsletterSubscribed: true });
    const totalGuests = await Guest.countDocuments();

    res.json({
      success: true,
      data: {
        subscribers: subscriberCount,
        totalGuests: totalGuests,
        subscriptionRate: totalGuests > 0 ? ((subscriberCount / totalGuests) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get newsletter statistics'
    });
  }
});

// Unsubscribe route
app.get('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Unsubscribe token is required'
      });
    }

    const guest = await Guest.findOne({ unsubscribeToken: token });

    if (guest) {
      guest.newsletterSubscribed = false;
      await guest.save();
      
      res.json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Invalid unsubscribe token'
      });
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mindy Munchs API is running',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      newsletter: 'Active'
    }
  });
});

// List all available routes (development only)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods)
        });
      }
    });
    res.json({ routes });
  });
}

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedPath: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/newsletter/subscribe',
      '/api/newsletter/test',
      '/api/products',
      '/api/auth',
      '/api/cart',
      '/api/orders'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
