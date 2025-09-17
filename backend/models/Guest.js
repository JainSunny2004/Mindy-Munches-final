const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true,
    required: false // Name is optional for a guest
  },
  newsletterSubscribed: {
    type: Boolean,
    default: true
  },
  subscriptionSource: {
    type: String,
    enum: ['footer', 'popup', 'checkout', 'manual'],
    default: 'footer'
  },
  unsubscribeToken: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Generate unsubscribe token before saving
guestSchema.pre('save', function(next) {
  if (this.isNew && !this.unsubscribeToken) {
    this.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});


module.exports = mongoose.model('Guest', guestSchema);
