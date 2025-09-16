// In backend/controllers/testimonialController.js
const VideoTestimonial = require('../models/VideoTestimonial');

// Update this function
exports.getAllVideoTestimonials = async (req, res) => {
  try {
    const videoTestimonials = await VideoTestimonial.find({});
    res.status(200).json(videoTestimonials);
  } catch (error) {
    console.error('Error fetching video testimonials from DB:', error);
    res.status(500).json({ message: 'Failed to fetch video testimonials' });
  }
};