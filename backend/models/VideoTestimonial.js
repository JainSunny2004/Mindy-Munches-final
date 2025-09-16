const mongoose = require('mongoose');

const videoTestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  videoSrc: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  fullQuote: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  duration: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoTestimonial', videoTestimonialSchema);