/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../utils/priceUtils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem, items } = useCartStore();
  const { isAuthenticated } = useAuthStore();

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        // Helper function to check if we're in Netlify environment
        const isNetlify = () => {
          return (
            window.location.hostname.includes("netlify.app") ||
            window.location.hostname.includes("netlify.com") ||
            import.meta.env.VITE_NETLIFY_DEPLOY === "true"
          );
        };

        let product,
          products = [];
        let response;

        try {
          // First, try to fetch from API
          if (import.meta.env.VITE_API_URL && !isNetlify()) {
            console.log("Attempting to fetch from API...");
            response = await fetch(
              `${import.meta.env.VITE_API_URL}/products/${id}`,
              {
                headers: { Accept: "application/json" },
              }
            );

            if (response.ok) {
              const apiResponse = await response.json();
              console.log("Product fetched from API:", apiResponse);

              // Handle API response structure properly
              if (
                apiResponse.success &&
                apiResponse.data &&
                apiResponse.data.product
              ) {
                product = apiResponse.data.product; // Extract product from nested structure
              } else if (apiResponse.data) {
                product = apiResponse.data;
              } else {
                product = apiResponse;
              }

              try {
                const allProductsRes = await fetch(
                  `${import.meta.env.VITE_API_URL}/products`,
                  {
                    headers: { Accept: "application/json" },
                  }
                );
                if (allProductsRes.ok) {
                  const allProducts = await allProductsRes.json();
                  products = allProducts.products || allProducts;
                }
              } catch (relatedError) {
                console.warn(
                  "Could not fetch related products from API:",
                  relatedError
                );
                products = [];
              }
            } else {
              throw new Error(`API failed with status ${response.status}`);
            }
          } else {
            throw new Error(
              "API not available or Netlify environment detected"
            );
          }
        } catch (apiError) {
          console.warn(
            "API failed, falling back to products.json:",
            apiError.message
          );

          // Fallback to products.json file
          try {
            response = await fetch("/data/products.json", {
              headers: { Accept: "application/json" },
            });

            if (response.ok) {
              const data = await response.json();
              products = data.products || data;
              product = products.find((p) => p.id === parseInt(id));
              console.log("Product fetched from products.json:", product);
            } else {
              throw new Error("products.json file not found");
            }
          } catch (publicError) {
            console.warn("products.json failed:", publicError.message);
            throw publicError;
          }
        }

        // Product not found
        if (!product) {
          console.error(`Product with ID ${id} not found`);
          navigate("/products");
          return;
        }

        setProduct(product);

        // Related products logic
        let related = [];
        if (products.length > 0) {
          related = products
            .filter(
              (p) => p.category === product.category && p.id !== product.id
            )
            .slice(0, 4);
        }
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error loading product:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  // Enhanced image handling with proper URL resolution
  const productImages = useMemo(() => {
    if (!product) return [];

    // Priority: images array > single image > empty array
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      // Filter and resolve image paths - handle both string and object formats
      return product.images
        .filter((img) => {
          if (typeof img === "string") {
            return img.trim() !== "";
          } else if (img && typeof img === "object" && img.url) {
            return typeof img.url === "string" && img.url.trim() !== "";
          }
          return false;
        })
        .map((img) => {
          if (typeof img === "string") {
            return resolveImageUrl(img);
          } else if (img && typeof img === "object" && img.url) {
            return resolveImageUrl(img.url);
          }
          return "";
        });
    } else if (
      product.image &&
      typeof product.image === "string" &&
      product.image.trim() !== ""
    ) {
      return [resolveImageUrl(product.image)];
    } else {
      return [];
    }

    return [];
  }, [product]);

  // Reset selected image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice) || !price) {
      console.log("Invalid price:", price, typeof price);
      return "Price not available";
    }
    return `₹ ${numPrice.toLocaleString("en-IN")}`; // Don't divide by 100 - MongoDB stores actual price
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      // Add the product with the specified quantity (not multiple times)
      addItem({
        ...product,
        quantity: quantity, // Pass the quantity to the cart store
      });

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
      notification.textContent = `${product.name} ${
        quantity > 1 ? `(${quantity})` : ""
      } added to cart!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };

  const isInCart = items.some((item) => item.id === product?.id);
  const cartQuantity =
    items.find((item) => item.id === product?.id)?.quantity || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Product not found
          </h1>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      
      {/* Breadcrumb */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              to="/products"
              className="text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Product Images */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
                {productImages.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${product.id}-${selectedImageIndex}`}
                      src={productImages[selectedImageIndex]}
                      alt={`${product.name} - View ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      onLoad={() =>
                        console.log(
                          "Image loaded:",
                          productImages[selectedImageIndex]
                        )
                      }
                      onError={(e) => {
                        console.error("Image failed to load:", e.target.src);
                        e.target.src =
                          "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Image+Not+Found";
                      }}
                    />
                  </AnimatePresence>
                ) : (
                  // Fallback when no images are available
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <div className="text-center text-neutral-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
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
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}

                {/* Image Navigation - Only show if multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? productImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-5 h-5"
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
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === productImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <svg
                        className="w-5 h-5"
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

                    {/* Image indicator dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            selectedImageIndex === index
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.featured && (
                    <span className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                  {product.stock <= 5 && (
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium block">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery - Only show if multiple images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-primary-500"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Thumbnail failed to load:",
                            e.target.src
                          );
                          e.target.src =
                            "https://via.placeholder.com/100x100/f3f4f6/9ca3af?text=404";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Product Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        ⭐
                      </span>
                    ))}
                    <span className="text-neutral-600 text-sm ml-2">
                      (24 reviews)
                    </span>
                  </div>
                </div>

                {/* Title and Price on same line */}
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-800 flex-1 mr-4">
                    {product.name}
                  </h1>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary-600">
                      {product?.price
                        ? formatPrice(product.price)
                        : "Price not available"}
                    </span>
                  </div>

                  {/* Original Price with strikethrough - around line 605 */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg text-neutral-500 line-through">
                      {formatPrice(product.price * 1.2)}
                    </span>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                      17% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 10
                      ? "bg-green-500"
                      : product.stock > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium">
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                    ? `Only ${product.stock} left`
                    : "Out of Stock"}
                </span>
                <span className="text-neutral-500 text-sm">
                  ({product.stock} available)
                </span>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🌱</div>
                  <span className="text-xs font-medium text-neutral-700">
                    100% Natural
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <span className="text-xs font-medium text-neutral-700">
                    High Protein
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🎨</div>
                  <span className="text-xs font-medium text-neutral-700">
                    DIY Customizable
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-neutral-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                      disabled={quantity <= 1}
                    >
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-2 hover:bg-neutral-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Cart Status */}
                {isInCart && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Already in cart ({cartQuantity} items)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 flex flex-col">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-colors duration-200 ${
                    product.stock === 0
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      : isAddingToCart
                      ? "bg-primary-400 text-white"
                      : "bg-primary-500 hover:bg-primary-600 text-white"
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding to Cart...
                    </div>
                  ) : product.stock === 0 ? (
                    "Out of Stock"
                  ) : (
                    `Add ${
                      quantity > 1 ? `${quantity} ` : ""
                    }to Cart - ${formatPrice(product.price * quantity)}`
                  )}
                </button>

                <button className="py-3 px-4 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-center gap-2">
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Share
                  </div>
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-neutral-800">
                  Delivery Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Free delivery on orders above ₹500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Delivery in 2-5 business days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="border-b border-neutral-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "description", label: "Description" },
                  { id: "ingredients", label: "Ingredients" },
                  { id: "nutrition", label: "Nutrition" },
                  { id: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                      Why Choose This Product?
                    </h3>
                    <ul className="space-y-2 text-neutral-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>
                          Made from premium quality traditional ingredients
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>
                          No artificial colors, flavors, or preservatives
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Rich in protein and essential nutrients</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Perfect for healthy snacking anytime</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-800">
                      Ingredients
                    </h3>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-700">
                        Premium quality{" "}
                        {product.category
                          ? product.category.toLowerCase()
                          : "ingredient"}
                        , natural spices, and traditional seasonings. No
                        artificial preservatives or additives.
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === "nutrition" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-800">
                      Nutrition Facts
                    </h3>
                    {product.nutritionalInfo ? (
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-neutral-700 mb-4">
                          Per 100g serving:
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {product.nutritionalInfo.calories && (
                            <div>
                              Energy: {product.nutritionalInfo.calories} kcal
                            </div>
                          )}
                          {product.nutritionalInfo.protein && (
                            <div>
                              Protein: {product.nutritionalInfo.protein}g
                            </div>
                          )}
                          {product.nutritionalInfo.carbs && (
                            <div>
                              Carbohydrates: {product.nutritionalInfo.carbs}g
                            </div>
                          )}
                          {product.nutritionalInfo.fat && (
                            <div>Fat: {product.nutritionalInfo.fat}g</div>
                          )}
                          {product.nutritionalInfo.fiber && (
                            <div>Fiber: {product.nutritionalInfo.fiber}g</div>
                          )}
                          {product.nutritionalInfo.sugar && (
                            <div>Sugar: {product.nutritionalInfo.sugar}g</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-neutral-600 text-center">
                          Nutritional information not available for this product
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-neutral-800">
                      Customer Reviews
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div
                          key={review}
                          className="border border-neutral-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-medium text-sm">
                                U{review}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-neutral-800">
                                Customer {review}
                              </div>
                              <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>⭐</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-neutral-600">
                            Great quality product! Really enjoying the taste and
                            freshness. Will definitely order again.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold text-neutral-800 mb-4">
                Related Products
              </h2>
              <p className="text-lg text-neutral-600">
                You might also like these {product.category} products
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
