import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const ProductCard = ({
  product,
  index = 0,
  viewMode = "grid",
  showBestsellerBadge = false,
}) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // State for size selection and image hovering
  const [selectedSize, setSelectedSize] = useState("500gm");
  const [isHovered, setIsHovered] = useState(false);
  
  // Map prices for sizes - assuming product.price is base price for 500gm
  const priceMap = {
    "500gm": product.price,
    "1kg": product.price * 2,
  };
  
  // Helper function to resolve image URLs
  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "";
    // External URLs (start with http)
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    // Local images - ensure they start with /
    if (!imagePath.startsWith("/")) {
      return `/${imagePath}`;
    }
    return imagePath;
  };
  
  // Get all valid images
  const productImages = useMemo(() => {
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      // Handle both string and object image formats
      return product.images
        .filter((img) => {
          if (typeof img === 'string') return img.trim() !== "";
          if (typeof img === 'object' && img.url) return img.url.trim() !== "";
          return false;
        })
        .map((img) => {
          if (typeof img === 'string') return resolveImageUrl(img);
          if (typeof img === 'object' && img.url) return resolveImageUrl(img.url);
          return '';
        });
    } else if (
      product.image &&
      typeof product.image === "string" &&
      product.image.trim() !== ""
    ) {
      return [resolveImageUrl(product.image)];
    }
    return [];
  }, [product]);
  
  // Get display image - show second image on hover if available, otherwise first
  const displayImage = useMemo(() => {
    if (productImages.length === 0) return null;
    // If hovering and multiple images exist, show second image
    if (isHovered && productImages.length > 1) {
      return productImages[1];
    }
    // Default to first image
    return productImages[0];
  }, [productImages, isHovered]);
  
  const formatPrice = (price) => {
    return `₹ ${(price ).toLocaleString("en-IN")}`;
  };
  
  // Updated: Allow guests to add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addItem(product);
    } catch (error) {
      // Error notification already handled in cartStore
      console.error('Add to cart failed:', error);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };
  
  const bestsellerRanks = {
    1: { rank: 1, badge: "Best Seller", sales: "2k+ Reviews" },
    2: { rank: 2, badge: "Top Choice", sales: "1.5k+ Reviews" },
    3: { rank: 3, badge: "Trending", sales: "1k+ Reviews" },
    4: { rank: 4, badge: "Best Value", sales: "150+ sold this month" },
  };
  
  const bestseller = bestsellerRanks[product.id];
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100 max-w-sm mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container - FULL WIDTH */}
      <div className="relative overflow-hidden aspect-square">
        <AnimatePresence mode="wait">
          {displayImage ? (
            <motion.img
              key={displayImage}
              src={displayImage}
              alt={`${product.name}${
                isHovered && productImages.length > 1 ? " - Hover view" : ""
              }`}
              className="w-full h-full object-cover"
              initial={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(2px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                filter: "blur(2px)",
              }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                scale: 1.08,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
              onError={(e) => {
                console.warn("Product image failed to load, using fallback:", e.target.src);
                if (!e.target.src.includes('data:image')) {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                }
              }}
            />
          ) : (
            <motion.div
              className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="text-center text-neutral-400">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs">No image</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Best Seller Badge */}
        {product.isBestseller && (
          <motion.div
            className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 z-10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <span>Best Seller</span>
            <motion.svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              whileHover={{
                scale: 1.3,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </motion.svg>
          </motion.div>
        )}
        
        {/* Featured Badge */}
        {product.isFeatured && !product.isBestseller && (
          <motion.div
            className="absolute top-3 left-3 bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Featured
          </motion.div>
        )}
        
        {/* Stock Badge */}
        {product.stock <= 5 && (
          <motion.div
            className={`absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10 backdrop-blur-sm ${
              (bestseller && showBestsellerBadge) || product.featured
                ? "mt-8"
                : ""
            }`}
            initial={{ opacity: 0, x: -20, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Low Stock
          </motion.div>
        )}
        
        {/* Wishlist Heart Icon */}
        <motion.div
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center cursor-pointer z-10 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
          whileHover={{
            scale: 1.2,
            backgroundColor: "#fef2f2",
            rotate: 5,
            transition: { duration: 0.2 },
          }}
          whileTap={{
            scale: 0.9,
            transition: { duration: 0.1 },
          }}
          initial={{ opacity: 0, x: 20, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            whileHover={{
              color: "#ef4444",
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
        </motion.div>
      </div>
      
      {/* Product Details */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.15,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Product Name and Price */}
        <div className="flex justify-between items-center mb-2">
          <motion.h3
            className="font-semibold text-gray-800 text-base leading-tight group-hover:text-primary-600 transition-colors duration-300 truncate flex-1 mr-2"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            {product.name}
          </motion.h3>
          <motion.span
            className="font-semibold text-primary-600 text-base leading-tight whitespace-nowrap"
            key={selectedSize}
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {formatPrice(priceMap[selectedSize])}
          </motion.span>
        </div>
        
        {/* Rating and Reviews */}
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="text-sm"
                initial={{ opacity: 0, rotate: -10, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{
                  delay: 0.3 + i * 0.05,
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 10,
                  transition: { duration: 0.2 },
                }}
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">4.91</span>
          <span className="text-xs text-gray-500">
            {bestseller?.sales || "2k+ Reviews"}
          </span>
        </motion.div>
        
        {/* Stock Status */}
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.35,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${
              product.stock > 10
                ? "bg-green-500"
                : product.stock > 0
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
          <span className="text-xs text-gray-600">
            {product.stock > 10
              ? "In Stock"
              : product.stock > 0
              ? `Only ${product.stock} left`
              : "Out of Stock"}
          </span>
        </motion.div>
        
        {/* Size Selector */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.select
            value={selectedSize}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedSize(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
            whileFocus={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <option value="500gm">500gm</option>
            <option value="1kg">1000gm</option>
          </motion.select>
        </motion.div>
        
        {/* Add to Cart Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(e);
          }}
          disabled={product.stock === 0}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm uppercase tracking-wide ${
            product.stock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          whileHover={
            product.stock > 0
              ? {
                  scale: 1.03,
                  y: -3,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
                  transition: { duration: 0.2 },
                }
              : {}
          }
          whileTap={
            product.stock > 0
              ? {
                  scale: 0.97,
                  y: 0,
                  transition: { duration: 0.1 },
                }
              : {}
          }
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.45,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
