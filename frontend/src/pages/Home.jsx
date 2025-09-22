/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import TestimonialCard from "../components/TestimonialCard";
import { useVideoTestimonials } from "../components/VideoTestimonials"; // Import the hook
import Loader from "../components/Loader";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for previous
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Add state for mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Use the custom hook to get video testimonials
  const { testimonials: videoTestimonials, loading: videoLoading } =
    useVideoTestimonials();

  // scrollRef for testimonial sections
  const scrollRef = useRef(null);
  const videoScrollRef = useRef(null);

  // Media query hook to detect mobile/desktop with debouncing
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      setIsResizing(true);
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
        setIsResizing(false);
      }, 100); // Debounce resize
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Define separate image arrays for laptop (16:9) and mobile (9:16)
  const laptopImages = [
    {
      src: "/BANNER_1.png", // Keep original laptop banner
      alt: "Traditional Makhana preparation",
    },
    {
      src: "/BANNER_2.png", // Keep original laptop banner
      alt: "Organic Sattu ingredients",
    },
  ];

  const mobileImages = [
    {
      src: "/MOBILE_BANNER_1.png", // Mock 9:16 banner for mobile
      alt: "Traditional Makhana preparation mobile",
    },
    {
      src: "/MOBILE_BANNER_2.png", // Mock 9:16 banner for mobile
      alt: "Organic Sattu ingredients mobile",
    },
  ];

  // Choose hero images based on screen size
  const heroImages = isMobile ? mobileImages : laptopImages;

  // Enhanced image preloading with mobile priority
  useEffect(() => {
    const preloadImages = isMobile
      ? [...mobileImages, ...laptopImages] // Prioritize mobile images
      : [...laptopImages, ...mobileImages]; // Prioritize desktop images

    preloadImages.forEach((image, index) => {
      const img = new Image();
      img.src = image.src;
      // Add high priority for first few images
      if (index < 2) {
        img.loading = "eager";
      }
    });
  }, [isMobile]);

  // USP Data - 3 E's
  const uspData = [
    {
      icon: (
        <img
          src="/usp1.png"
          alt="Ease - Traditional to Modern"
          className="w-10 h-10 object-contain"
        />
      ),
      title: "Ease",
      description:
        "Bringing traditional food to modern convenience. Experience authentic Indian heritage foods with simple, accessible packaging.",
    },
    {
      icon: (
        <img
          src="/usp2.png"
          alt="Empower - Customize Your Way"
          className="w-10 h-10 object-contain"
        />
      ),
      title: "Empower",
      description:
        "Empowering you to make it your way. Customize your wellness journey with versatile traditional superfoods that adapt to your lifestyle.",
    },
    {
      icon: (
        <img
          src="/usp3.png"
          alt="Enrich - Overall Wellness"
          className="w-10 h-10 object-contain"
        />
      ),
      title: "Enrich",
      description:
        "Enriching your overall wellness. Nourish your body with nutrient-dense traditional foods that have sustained healthy living for generations.",
    },
  ];

  // Reset current index when switching device types to prevent out-of-bounds
  useEffect(() => {
    if (currentImageIndex >= heroImages.length) {
      setCurrentImageIndex(0);
    }
  }, [isMobile, heroImages.length, currentImageIndex]);

  // Mobile-optimized auto-rotation with longer intervals for mobile
  useEffect(() => {
    const interval = setInterval(
      () => {
        setDirection(1); // Auto-rotation always goes forward
        setCurrentImageIndex((prevIndex) =>
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
      },
      isMobile ? 6000 : 5000
    ); // Longer interval on mobile for better UX

    return () => clearInterval(interval);
  }, [heroImages.length, isMobile]);

  // Enhanced navigation functions with mobile-specific optimizations
  const goToPrevious = () => {
    if (isTransitioning || isResizing) return;
    setIsTransitioning(true);
    setDirection(-1);
    setCurrentImageIndex(
      currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
    );
    // Shorter timeout on mobile for more responsive feel
    setTimeout(() => setIsTransitioning(false), isMobile ? 400 : 600);
  };

  const goToNext = () => {
    if (isTransitioning || isResizing) return;
    setIsTransitioning(true);
    setDirection(1);
    setCurrentImageIndex(
      currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), isMobile ? 400 : 600);
  };

  // Mobile-specific animation variants
  const mobileAnimationVariants = {
    initial: {
      opacity: 0,
      y: direction > 0 ? 20 : -20, // Vertical movement for mobile
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: direction > 0 ? -20 : 20,
    },
  };

  const desktopAnimationVariants = {
    initial: {
      opacity: 0,
      x: direction > 0 ? 30 : -30, // Horizontal movement for desktop
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: direction > 0 ? -30 : 30,
    },
  };

  // Choose animation variants based on device
  const animationVariants = isMobile
    ? mobileAnimationVariants
    : desktopAnimationVariants;

  // Mobile-optimized transition settings
  const transitionSettings = {
    duration: isMobile ? 0.4 : 0.6, // Faster on mobile
    ease: isMobile ? "easeOut" : "easeInOut", // Different easing for mobile
    opacity: { duration: isMobile ? 0.2 : 0.3 },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const isVercel = () => {
          return (
            window.location.hostname.includes("vercel.app") ||
            import.meta.env.VITE_VERCEL_DEPLOY === "true"
          );
        };

        if (!import.meta.env.VITE_API_URL || !isVercel()) {
          throw new Error("API URL is not defined");
        }

        // Try fetching from the API
        const [
          apiProductsResponse,
          apiTestimonialsResponse,
          apiBestsellersResponse,
        ] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/products`),
          fetch(`${import.meta.env.VITE_API_URL}/testimonials`),
          fetch(`${import.meta.env.VITE_API_URL}/products/bestsellers`),
        ]);

        if (
          !apiProductsResponse.ok ||
          !apiTestimonialsResponse.ok ||
          !apiBestsellersResponse.ok
        ) {
          throw new Error("API responses not ok");
        }

        const productsData = await apiProductsResponse.json();
        const testimonialsData = await apiTestimonialsResponse.json();
        const bestsellersData = await apiBestsellersResponse.json();

        // Process products data for "Traditional Superfoods" section
        let allProducts = [];
        if (
          productsData &&
          productsData.success &&
          productsData.data &&
          Array.isArray(productsData.data.products)
        ) {
          allProducts = productsData.data.products;
        } else if (productsData && Array.isArray(productsData.products)) {
          allProducts = productsData.products;
        } else if (Array.isArray(productsData)) {
          allProducts = productsData;
        }

        // Process testimonials data
        let allTestimonials = [];
        if (
          testimonialsData &&
          testimonialsData.success &&
          testimonialsData.data &&
          Array.isArray(testimonialsData.data.testimonials)
        ) {
          allTestimonials = testimonialsData.data.testimonials;
        } else if (
          testimonialsData &&
          Array.isArray(testimonialsData.testimonials)
        ) {
          allTestimonials = testimonialsData.testimonials;
        } else if (Array.isArray(testimonialsData)) {
          allTestimonials = testimonialsData;
        }

        // Process bestsellers data for "Our Bestsellers" section
        let allBestsellers = [];
        if (
          bestsellersData &&
          bestsellersData.success &&
          bestsellersData.data &&
          Array.isArray(bestsellersData.data.products)
        ) {
          allBestsellers = bestsellersData.data.products;
        } else if (bestsellersData && Array.isArray(bestsellersData.products)) {
          allBestsellers = bestsellersData.products;
        } else if (Array.isArray(bestsellersData)) {
          allBestsellers = bestsellersData;
        }

        setProducts(allProducts.slice(0, 6)); // Use allProducts for this section
        setBestsellers(allBestsellers); // Use allBestsellers for this section
        setTestimonials(allTestimonials);
      } catch (error) {
        console.error("Error loading data from API:", error);
        // Set state to empty arrays in case of API failure
        setProducts([]);
        setBestsellers([]);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full">
      {/* HERO BANNER SECTION - Mobile-optimized animations */}
      <section
        className="relative w-screen overflow-hidden"
        style={{
          height: "auto",
          minHeight: "400px",
          width: "100vw",
        }}
      >
        {/* Background Images - Mobile-optimized container */}
        <div
          className="w-screen relative overflow-hidden transition-all ease-in-out"
          style={{
            aspectRatio: isMobile ? "9/16" : "16/9",
            width: "100%",
            maxWidth: "100vw",
            transitionDuration: isMobile ? "200ms" : "300ms", // Faster transition on mobile
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`${isMobile ? "mobile" : "laptop"}-${currentImageIndex}`}
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              className="w-full h-full"
              style={{
                objectFit: "contain",
                objectPosition: "center",
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                backgroundColor: "#f8f9fa",
                willChange: isMobile
                  ? "transform, opacity"
                  : "transform, opacity", // Mobile-specific optimization
                backfaceVisibility: "hidden",
                // Mobile-specific optimizations
                ...(isMobile && {
                  imageRendering: "crisp-edges", // Better mobile image rendering
                  transform: "translateZ(0)", // Force hardware acceleration on mobile
                }),
              }}
              initial={animationVariants.initial}
              animate={animationVariants.animate}
              exit={animationVariants.exit}
              transition={transitionSettings}
              loading="eager"
              // Mobile-specific image optimization
              {...(isMobile && {
                sizes: "(max-width: 768px) 100vw",
                fetchPriority: "high",
              })}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - Mobile-optimized touch targets */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning || isResizing}
          className={`absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
            isMobile
              ? "w-12 h-12 active:scale-95" // Larger touch targets on mobile with active state
              : "w-10 h-10 sm:w-12 sm:h-12"
          }`}
          aria-label="Previous image"
        >
          <svg
            className={`group-hover:scale-125 group-hover:-translate-x-0.5 transition-all duration-300 ease-out ${
              isMobile ? "w-6 h-6" : "w-5 h-5 sm:w-6 sm:h-6"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={goToNext}
          disabled={isTransitioning || isResizing}
          className={`absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
            isMobile
              ? "w-12 h-12 active:scale-95" // Larger touch targets on mobile
              : "w-10 h-10 sm:w-12 sm:h-12"
          }`}
          aria-label="Next image"
        >
          <svg
            className={`group-hover:scale-125 group-hover:translate-x-0.5 transition-all duration-300 ease-out ${
              isMobile ? "w-6 h-6" : "w-5 h-5 sm:w-6 sm:h-6"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Shop Now Button - ONLY VISIBLE ON LAPTOP/DESKTOP */}
        {!isMobile && (
          <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 right-3 sm:right-6 md:right-8 lg:right-12 z-30">
            <motion.div
              initial={{ opacity: 0, x: 60, y: 60, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                scale: { duration: 0.6, ease: "backOut" },
              }}
            >
              <Link
                to="/products"
                className="group relative inline-flex items-center justify-center"
              >
                <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-2xl transition-all duration-400 hover:scale-105 shadow-2xl hover:shadow-primary-500/25 border border-primary-400/20">
                  <span className="relative z-10 flex items-center gap-2 md:gap-3 whitespace-nowrap">
                    Shop Now
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-400 ease-out"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-primary-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-400 scale-110"></div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Navigation Dots - Mobile-optimized touch targets */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (!isTransitioning && !isResizing) {
                  setDirection(index > currentImageIndex ? 1 : -1);
                  setCurrentImageIndex(index);
                }
              }}
              disabled={isTransitioning || isResizing}
              className={`rounded-full transition-all ease-out disabled:cursor-not-allowed ${
                isMobile
                  ? "w-3 h-3 active:scale-90" // Larger dots on mobile with active state
                  : "w-2.5 h-2.5 sm:w-3 sm:h-3"
              } ${
                index === currentImageIndex
                  ? "bg-white shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              style={{
                transitionDuration: isMobile ? "200ms" : "400ms", // Faster transitions on mobile
              }}
              aria-label={`Go to slide ${index + 1}`}
              animate={{
                scale: index === currentImageIndex ? 1.25 : 1,
                opacity: index === currentImageIndex ? 1 : 0.7,
              }}
              whileHover={{
                scale:
                  isTransitioning || isResizing ? 1 : isMobile ? 1.15 : 1.1,
                opacity: 1,
              }}
              whileTap={{
                scale:
                  isTransitioning || isResizing ? 1 : isMobile ? 0.85 : 0.9,
              }}
              transition={{
                duration: isMobile ? 0.2 : 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </section>

      {/* CREATIVE BRAND SECTION - Separate Section with Content */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden overflow-y-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-neutral-800 leading-tight whitespace-nowrap mb-10">
                Revive{" "}
                <span className="text-primary-500">Wholesome Snacks</span> for
                Modern Convenience
              </h1>
            </motion.div>
          </div>

          {/* Equal columns below header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-stretch content-stretch">
            {/* LEFT column */}
            <div className="h-full">
              <p className="text-base md:text-lg lg:text-xl text-neutral-600 mb-6 leading-relaxed max-w-3xl">
                Health should feel personal , playful and rooted in our everyday
                lives
              </p>

              {/* Certifications: single line, no wrap, no x-scroll */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-3 mb-8 px-2 sm:px-0 overflow-x-visible sm:overflow-x-clip">
                {["Snack Boldly", "Snack Mindfully", "Snack your way"].map(
                  (cert, index) => (
                    <motion.div
                      key={cert}
                      className="bg-white/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg shadow-sm flex items-center gap-1 sm:gap-2 flex-none whitespace-nowrap"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-green-500 text-base sm:text-lg leading-none">
                        ✓
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-medium text-neutral-700 leading-none">
                        {cert}
                      </span>
                    </motion.div>
                  )
                )}
              </div>

              {/* Feature cards */}
              <motion.div
                className="relative w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-2xl md:text-3xl">🌱</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Rooted in Tradition
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Ancient superfoods, modern formats
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-2xl md:text-3xl">💪</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Nutrition First
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        High protein, clean ingredients
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-2xl md:text-3xl">❤️</span>
                      </div>
                      <h3 className="font-semibold text-neutral-800 mb-2 text-sm md:text-base">
                        Family-Crafted
                      </h3>
                      <p className="text-xs md:text-sm text-neutral-600">
                        Born from real kitchen experiments
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT column */}
            <div className="relative h-full">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                viewport={{ once: true }}
                className="w-full h-full"
              >
                <img
                  src="/Asset19.png"
                  alt="Creative brand mock"
                  className="w-full h-9/10 object-cover md:object-contain rounded-2xl md:rounded-3xl"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
          {/* USP Section - 3 E's */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-15">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Our Brand
                <span className="text-primary-600"> USP</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The 3 E's that define our commitment to bringing you the best of
                traditional Indian wellness
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {uspData.map((usp, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-primary-200 bg-primary-50 flex items-center justify-center group-hover:border-primary-400 group-hover:bg-primary-100 transition-all duration-200">
                    <div className="flex items-center justify-center w-full h-full">
                      {usp.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {usp.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {usp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section with Horizontal Scroll */}
      <section className="py-16 md:py-20 bg-neutral-50 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-500 mb-4">
              Our Bestsellers
            </h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover why thousands of customers choose these traditional
              superfoods for their daily nutrition.
            </p>
          </motion.div>

          {loading ? (
            <Loader text="Loading bestsellers..." />
          ) : (
            <div className="relative">
              {/* Horizontal Scrollable Container - 4 Cards Fully Visible */}
              <div
                id="bestseller-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollPaddingLeft: "1.5rem",
                  scrollPaddingRight: "1.5rem",
                }}
              >
                {bestsellers.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 snap-start"
                    style={{
                      width: "calc(25% - 18px)", // 25% width minus gap (24px total gap / 4 * 3)
                      minWidth: "280px", // Minimum width for mobile
                    }}
                  >
                    <ProductCard
                      product={product}
                      index={index}
                      showBestsellerBadge={true}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container =
                    document.getElementById("bestseller-scroll");
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Right"
                onClick={() => {
                  const container =
                    document.getElementById("bestseller-scroll");
                  const cardWidth = container.scrollWidth / bestsellers.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        id="our-story"
        className="py-8 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center "
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-neutral-800 mb-6 leading-tight whitespace-nowrap">
                We Are Preserving a Heritage of{" "}
                <span className="text-primary-500">
                  Traditional Indian SuperFoods
                </span>
              </h1>
            </motion.div>

            <div className="flex justify-center items-center max-h-screen px-4">
              <motion.div
                className="w-full max-w-[70vw] md:max-w-[75vw] lg:max-w-[80vw]"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Video Iframe */}
                <div className="relative w-full h-[78vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/tIxV269IutY"
                    title="From The Soil Of India"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 px-2 md:py-20 bg-neutral-50 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-500 mb-4">
              Traditional Superfoods
            </h2>
          </motion.div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : (
            <div className="relative">
              {/* Horizontal Scrollable Container - 4 Cards Fully Visible */}
              <div
                id="product-scroll"
                className="flex gap-6 pc-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollPaddingLeft: "1.5rem", // Account for gap
                  scrollPaddingRight: "1.5rem",
                }}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 snap-start"
                    style={{
                      width: "calc(25% - 18px)", // 25% width minus gap (24px total gap / 4 * 3)
                      minWidth: "280px", // Minimum width for mobile
                    }}
                  >
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Left"
                onClick={() => {
                  const container = document.getElementById("product-scroll");
                  const cardWidth = container.scrollWidth / products.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Scroll Right"
                onClick={() => {
                  const container = document.getElementById("product-scroll");
                  const cardWidth = container.scrollWidth / products.length;
                  const scrollAmount = cardWidth * 1; // Scroll by exactly 1 card width
                  container.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn-primary">
              Shop All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Combined Testimonials Section - Video (9:16) and Text - INCREASED HEIGHT */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-x-hidden min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-neutral-800 mb-6 leading-tight break-words">
              Our Customers <span className="text-primary-500">Experience</span>
            </h1>
          </motion.div>

          {/* Video Testimonials - Reel Style (9:16) with Horizontal Scroll */}
          {!videoLoading && videoTestimonials.length > 0 && (
            <div className="relative mb-15">
              {/* Left Arrow for Video Scroll */}
              <button
                onClick={() =>
                  videoScrollRef.current?.scrollBy({
                    left: -300,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105"
                aria-label="Scroll video testimonials left"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Video Testimonials Container */}
              <div
                ref={videoScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-6"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth",
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {videoTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-48 md:w-56 lg:w-60 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative"
                    style={{ scrollSnapAlign: "start" }}
                    onClick={() => setActiveVideo(testimonial)}
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
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg
                          className="w-5 h-5 text-primary-600 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="text-sm font-semibold truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-white/80 truncate">
                        {testimonial.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">
                            ⭐
                          </span>
                        ))}
                        <span className="text-xs text-white/60 ml-2">
                          {testimonial.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow for Video Scroll */}
              <button
                onClick={() =>
                  videoScrollRef.current?.scrollBy({
                    left: 300,
                    behavior: "smooth",
                  })
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105"
                aria-label="Scroll video testimonials right"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Text Reviews Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
              <span className="text-2xl mr-3">📝</span>
              <span className="text-lg font-semibold text-neutral-700">
                Customer Reviews
              </span>
            </div>
          </div>

          {/* Text Testimonials - Responsive with Hidden Mobile Arrows */}
          <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] mb-5">
            {/* Left Arrow - Hidden on Mobile, Visible on Tablet+ */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -200,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
              aria-label="Scroll testimonials left"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Text Testimonials Container - Optimized for Touch Scrolling */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-12 py-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch", // Enhanced touch scrolling for mobile
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0 w-[85vw] h-auto min-h-[280px] sm:w-[70vw] sm:min-h-[320px] md:w-80 md:h-96 lg:w-96 lg:h-96 max-w-sm"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="w-full h-full bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col justify-between transition-transform duration-300 hover:scale-105">
                    <TestimonialCard
                      testimonial={testimonial}
                      index={index}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Hidden on Mobile, Visible on Tablet+ */}
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: 200,
                  behavior: "smooth",
                })
              }
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full shadow-lg p-3 transition-all duration-200 hover:scale-105 items-center justify-center"
              aria-label="Scroll testimonials right"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Mobile Touch Indicator - Optional visual cue for swipe */}
            <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-gray-500 text-xs">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l4-4-4-4m6 8l4-4-4-4"
                />
              </svg>
            </div>
          </div>

          {/* Video Modal */}
          {activeVideo && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {activeVideo.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {activeVideo.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {activeVideo.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
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
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(activeVideo.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="text-neutral-700 italic">
                    "{activeVideo.fullQuote}"
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Trust Indicators */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-neutral-600">
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">⭐</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    4.9/5
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Average Rating
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">📦</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    500+
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Happy Customers
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 md:px-6 py-3 shadow-sm">
                <span className="text-xl md:text-2xl mr-2 md:mr-3">✅</span>
                <div>
                  <span className="font-semibold text-base md:text-lg">
                    98%
                  </span>
                  <span className="ml-2 text-xs md:text-sm">
                    Would Recommend
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
