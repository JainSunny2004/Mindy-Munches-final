const express = require('express');
const router = express.Router();
const videoTestimonialController = require('../controllers/videoTestimonialController');

// GET /api/video-testimonials
router.get('/video-testimonials', videoTestimonialController.getAllVideoTestimonials);

module.exports = router;