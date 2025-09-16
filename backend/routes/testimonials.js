const express = require('express');
const router = express.Router();

const {
  getAllTestimonials,
  getVideoTestimonials
} = require('../controllers/testimonialController');

router.get('/', getAllTestimonials);
router.get('/videos', getVideoTestimonials);

module.exports = router;
