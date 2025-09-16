/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

// Video testimonials data - now exported for use in other components
export const videoTestimonialsData = [
  {
    id: 1,
    name: "Rajesh Patel",
    location: "Mumbai, Maharashtra",
    title: "Health Enthusiast & Father",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=710&fit=crop",
    fullQuote: "I was introduced to Mindy Munchs through a friend and I'm so glad I discovered these amazing traditional snacks. My whole family loves them!",
    rating: 5,
    duration: "2:15"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi, India",
    title: "Working Mother",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=710&fit=crop",
    fullQuote: "When my son told me that no other snacks taste as good as Mindy Munchs, I knew we had found something special. Perfect for our family!",
    rating: 5,
    duration: "1:45"
  },
  {
    id: 3,
    name: "Anita Gupta",
    location: "Bangalore, Karnataka",
    title: "Fitness Coach",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=710&fit=crop",
    fullQuote: "These traditional superfoods have transformed my client's snacking habits completely. I recommend Mindy Munchs to all my fitness clients!",
    rating: 5,
    duration: "1:30"
  },
  {
    id: 4,
    name: "Amit Kumar",
    location: "Chennai, Tamil Nadu",
    title: "Software Engineer",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=710&fit=crop",
    fullQuote: "Working from home, I needed healthy snacks that wouldn't make me feel sluggish. Mindy Munchs has been a game-changer for my productivity!",
    rating: 5,
    duration: "2:00"
  },
  {
    id: 5,
    name: "Meera Joshi",
    location: "Pune, Maharashtra",
    title: "Nutritionist",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=710&fit=crop",
    fullQuote: "As a nutritionist, I recommend Mindy Munchs to all my clients. These traditional superfoods are packed with nutrients and taste amazing!",
    rating: 5,
    duration: "1:50"
  },
  {
    id: 6,
    name: "Karan Singh",
    location: "Jaipur, Rajasthan",
    title: "College Student",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=710&fit=crop",
    fullQuote: "Perfect snacks for study sessions! Keeps me energized without the sugar crash. My hostel friends are all obsessed now!",
    rating: 5,
    duration: "1:25"
  }
];

// Custom hook to fetch video testimonials
export const useVideoTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const response = await fetch(`${import.meta.env.VITE_API_URL}/video-testimonials`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        } else {
          // Fallback to static data
          setTestimonials(videoTestimonialsData);
        }
      } catch (err) {
        console.warn('Failed to fetch video testimonials, using static data:', err);
        // Fallback to static data
        setTestimonials(videoTestimonialsData);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null)
  const scrollRef = useRef(null)
  const { testimonials: videoTestimonials, loading } = useVideoTestimonials();

  const closeVideo = () => setActiveVideo(null)

  if (loading) {
    return <div className="py-20 text-center">Loading video testimonials...</div>;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-orange-200 text-orange-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            🎥 Real Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 mb-4">
            What Our Customers Are Saying
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Authentic testimonials from real customers who love our traditional superfoods.
          </p>
        </motion.div>

        {/* Horizontal Scroll Container with Navigation Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll video testimonials left"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Video Testimonials Carousel - 9:16 Reel Style */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar px-12 py-6"
            style={{ scrollSnapType: "x mandatory", scrollBehavior: 'smooth' }}
          >
            {videoTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="flex-shrink-0 w-48 md:w-56 lg:w-60 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveVideo(testimonial)}
                style={{ scrollSnapAlign: 'center' }}
              >
                <img
                  src={testimonial.thumbnail}
                  alt={`${testimonial.name} testimonial`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="text-sm font-semibold truncate">{testimonial.name}</h4>
                  <p className="text-xs text-white/80 truncate">{testimonial.location}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">⭐</span>
                    ))}
                    <span className="text-xs text-white/60 ml-2">{testimonial.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Scroll video testimonials right"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
          >
            <motion.div
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {activeVideo.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">{activeVideo.name}</h3>
                    <p className="text-sm text-neutral-500">{activeVideo.location}</p>
                  </div>
                </div>
                <button
                  onClick={closeVideo}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Video Content */}
              <div className="aspect-video">
                <iframe
                  src={activeVideo.videoSrc}
                  title={`${activeVideo.name} testimonial`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(activeVideo.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-neutral-700 italic">
                  "{activeVideo.fullQuote}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default VideoTestimonials