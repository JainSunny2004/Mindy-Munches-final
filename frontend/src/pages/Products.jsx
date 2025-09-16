import { useState, useEffect } from "react";
//eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SearchFilters from "../components/SearchFilters";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import useCartStore from "../store/cartStore";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const { addItem } = useCartStore();

  useEffect(() => {
    const loadProducts = async () => {
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

        let response;

        try {
          // First, try to fetch from API
          if (import.meta.env.VITE_API_URL && !isNetlify()) {
            response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
              headers: { Accept: "application/json" },
              cache: "no-store",
            });

            if (!response.ok) {
              throw new Error(`API failed with status ${response.status}`);
            }
          } else {
            throw new Error(
              "API not available or Netlify environment detected"
            );
          }
        } catch (apiError) {
          console.warn(
            "API failed, falling back to public data:",
            apiError.message
          );

          // Fallback to public data files
          try {
            response = await fetch("/data/products.json", {
              headers: { Accept: "application/json" },
            });

            if (!response.ok) {
              throw new Error("Public data files not found");
            }
          } catch (publicError) {
            console.warn(
              "Public data failed, using imported data:",
              publicError.message
            );

            // Final fallback to imported JSON data
            const allProducts = productsData.products;
            setProducts(allProducts);
            setFilteredProducts(allProducts);
            return;
          }
        }

        // Parse the successful response
        // const data = await response.json()
        // const productsArray = data?.products || data || []
        // setProducts(productsArray)
        // setFilteredProducts(productsArray)
        const data = await response.json();
        let productsArray = [];

        // Handle different API response structures
        if (
          data &&
          data.success &&
          data.data &&
          Array.isArray(data.data.products)
        ) {
          // Backend API response: { success: true, data: { products: [...] } }
          productsArray = data.data.products;
        } else if (data && Array.isArray(data.products)) {
          // JSON file structure: { products: [...] }
          productsArray = data.products;
        } else if (Array.isArray(data)) {
          // Direct array response: [...]
          productsArray = data;
        } else {
          // Fallback to empty array
          console.warn("Unexpected data structure:", data);
          productsArray = [];
        }

        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error loading products:", error);

        // Ultimate fallback to imported data
        const allProducts = productsData.products;
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const formatPrice = (price) => {
    return `₹ ${(price).toLocaleString("en-IN")}`;
  };

  // Allow adding to cart without login check
  const handleAddToCart = (product) => {
    if (product.stock === 0) return;

    addItem(product);

    // Show success notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
    notification.textContent = `${product.name} added to cart!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-800 mb-6">
              Our Products
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Discover our range of traditional superfoods, carefully crafted
              for modern lifestyles. From protein-rich Makhana to versatile
              Sattu - find the perfect healthy snack.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-neutral-700 shadow-sm">
                🌱 100% Natural
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-neutral-700 shadow-sm">
                💪 High Protein
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-neutral-700 shadow-sm">
                🎨 Customizable
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Search & Filters */}
      <SearchFilters
        products={products}
        onFilteredProducts={setFilteredProducts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <Loader text="Loading products..." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No products found"
              description={
                searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "No products are available at the moment."
              }
              action={
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setSortBy("name");
                      setShowFilters(false);
                    }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                  <Link to="/" className="btn-primary">
                    Back to Home
                  </Link>
                </div>
              }
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <p className="text-neutral-600">
                    Showing{" "}
                    <span className="font-semibold">
                      {filteredProducts?.length || 0}
                    </span>{" "}
                    of {products?.length || 0} products
                  </p>
                  {/* Add array check before using .some() method */}
                  {Array.isArray(filteredProducts) &&
                    filteredProducts.some((p) => p.featured) && (
                      <div className="flex items-center gap-2 text-sm text-primary-600 mt-1">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        {filteredProducts.filter((p) => p.featured).length}{" "}
                        featured products
                      </div>
                    )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id ?? index}
                    product={product}
                    index={index}
                    viewMode="grid"
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Not sure which products are right? Our team can help find the
              perfect healthy snacks for your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-primary-600 font-medium px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Contact Us
              </Link>
              
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products;
