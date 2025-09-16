const Testimonial = require('../models/Testimonial');

// Get all testimonials from MongoDB
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }); // latest first
    res.json({
      success: true,
      testimonials,
      totalCount: testimonials.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message,
    });
  }
};

// Get static/dummy video testimonials (or you can extend to DB)
const getVideoTestimonials = (req, res) => {
  try {
    const videoTestimonials = [
      {
        id: 1,
        name: "Dr. Anjali Mehta",
        title: "Nutritionist",
        videoUrl: "/videos/testimonial1.mp4",
        thumbnail: "/images/video-thumb1.jpg",
        message: "I recommend Mindy Munchs to all my patients for their organic quality.",
        duration: "2:30",
        location: "Chennai, India"
      },
      {
        id: 2,
        name: "Chef Vikram Singh",
        title: "Professional Chef",
        videoUrl: "/videos/testimonial2.mp4",
        thumbnail: "/images/video-thumb2.jpg",
        message: "The spices and oils from Mindy Munchs elevate every dish I create.",
        duration: "1:45",
        location: "Pune, India"
      }
    ];
    res.json({
      success: true,
      videos: videoTestimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video testimonials',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTestimonials,
  getVideoTestimonials,
};
