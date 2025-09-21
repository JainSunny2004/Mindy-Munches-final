import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../../utils/priceUtils";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    originalPrice: "",
    category: "superfoods",
    images: [{ url: "", alt: "", isPrimary: true }],
    stock: "",
    sku: "",
    weight: { value: "", unit: "g" },
    nutritionalInfo: {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      sugar: "",
    },
    tags: [],
    tagsInput: "",
    isActive: true,
    isFeatured: false,
    isOrganic: false,
    isBestseller: false,
    origin: "India",
  });

  // Category options matching the model enum
  const categoryOptions = [
    { value: "makhana", label: "Makhana" },
    { value: "sattu", label: "Sattu" },
  ];

  const weightUnits = ["g", "kg", "ml", "l"];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle different response structures
      let productsArray = [];
      if (data.success && data.data && Array.isArray(data.data.products)) {
        productsArray = data.data.products;
      } else if (data && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (Array.isArray(data)) {
        productsArray = data;
      }

      setProducts(productsArray);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested object updates (e.g., weight.value, nutritionalInfo.calories)
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      ),
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", alt: "", isPrimary: false }],
    }));
  };

  const removeImageField = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // FIXED VERSION - Allows comma input and properly processes tags
  const handleTagsChange = (e) => {
    const inputValue = e.target.value;

    // Split by comma, trim each tag, and filter out empty strings
    const tags = inputValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setFormData((prev) => ({
      ...prev,
      tags,
      // Store the raw input value for display purposes
      tagsInput: inputValue,
    }));
  };

  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData((prev) => ({ ...prev, sku: `${prefix}${random}` }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to manage products");
      return;
    }

    // Prepare product data
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || null,
      stock: parseInt(formData.stock, 10) || 0,
      weight: {
        value: parseFloat(formData.weight.value) || null,
        unit: formData.weight.unit,
      },
      nutritionalInfo: Object.keys(formData.nutritionalInfo).reduce(
        (acc, key) => {
          const value = parseFloat(formData.nutritionalInfo[key]);
          if (!isNaN(value)) acc[key] = value;
          return acc;
        },
        {}
      ),
      // Ensure at least one image exists and filter out empty URLs
      images:
        formData.images.filter((img) => img.url.trim()).length > 0
          ? formData.images.filter((img) => img.url.trim())
          : [
              {
                url: "/placeholder-image.jpg",
                alt: formData.name,
                isPrimary: true,
              },
            ],
    };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`${apiUrl}/products/${editingProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch(`${apiUrl}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${editingProduct ? "update" : "add"} product`
        );
      }

      const result = await response.json();
      const savedProduct = result.data?.product || result;

      setProducts((prev) => {
        if (editingProduct) {
          return prev.map((p) =>
            p._id === editingProduct._id ? savedProduct : p
          );
        } else {
          return [...prev, savedProduct];
        }
      });

      resetForm();
      alert(`Product ${editingProduct ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(error);
      alert(error.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category || "makhana",
      images:
        product.images && product.images.length > 0
          ? product.images
          : [{ url: "", alt: "", isPrimary: true }],
      stock: product.stock?.toString() || "",
      sku: product.sku || "",
      weight: {
        value: product.weight?.value?.toString() || "",
        unit: product.weight?.unit || "g",
      },
      nutritionalInfo: {
        calories: product.nutritionalInfo?.calories?.toString() || "",
        protein: product.nutritionalInfo?.protein?.toString() || "",
        carbs: product.nutritionalInfo?.carbs?.toString() || "",
        fat: product.nutritionalInfo?.fat?.toString() || "",
        fiber: product.nutritionalInfo?.fiber?.toString() || "",
        sugar: product.nutritionalInfo?.sugar?.toString() || "",
      },
      tags: product.tags || [],
      tagsInput: product.tags ? product.tags.join(", ") : "", // Add this line
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured || product.featured || false,
      isOrganic: product.isOrganic || false,
      origin: product.origin || "India",
      isBestseller: product.isBestseller || false,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to delete products");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error deleting product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      originalPrice: "",
      category: "makhana",
      images: [{ url: "", alt: "", isPrimary: true }],
      stock: "",
      sku: "",
      weight: { value: "", unit: "g" },
      nutritionalInfo: {
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
      },
      tags: [],
      tagsInput: "",
      isActive: true,
      isFeatured: false,
      isOrganic: false,
      origin: "India",
      isBestseller: false,
    });
    setEditingProduct(null);
    setShowAddModal(false);
  };

  // New function to handle product detail view
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>

        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center md:justify-start gap-2"
          >
            <span className="text-xl">+</span>
            Add Product
          </button>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 md:p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found.
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or add a new product.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <>
          {/* Mobile: Product Cards */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={
                          product.images?.[0]?.url || "/placeholder-image.jpg"
                        }
                        alt={product.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(product.isFeatured || product.featured) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Featured
                              </span>
                            )}
                            {product.isOrganic && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🌿 Organic
                              </span>
                            )}
                            {product.isBestseller && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                🔥 Best Seller
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {product.shortDescription ||
                              product.description?.substring(0, 80) + "..."}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${
                              !product.isActive
                                ? "bg-red-100 text-red-800"
                                : product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {!product.isActive
                              ? "Inactive"
                              : product.stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>SKU: {product.sku}</span>
                        <span>Stock: {product.stock}</span>
                        <span>{product.category}</span>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: Table View */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={
                              product.images?.[0]?.url ||
                              "/placeholder-image.jpg"
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {product.name}
                            {(product.isFeatured || product.featured) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Featured
                              </span>
                            )}
                            {product.isOrganic && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🌿 Organic
                              </span>
                            )}
                            {product.isBestseller && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                🔥 Best Seller
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.shortDescription ||
                              product.description?.substring(0, 50) + "..."}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.price)}
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock}
                        {product.weight?.value && (
                          <div className="text-xs text-gray-500">
                            {product.weight.value} {product.weight.unit}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          !product.isActive
                            ? "bg-red-100 text-red-800"
                            : product.stock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {!product.isActive
                          ? "Inactive"
                          : product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-orange-600 hover:text-orange-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Product Images */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Images
                    </h3>
                    <div className="space-y-4">
                      {selectedProduct.images?.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url || "/placeholder-image.jpg"}
                            alt={image.alt || selectedProduct.name}
                            className="w-full h-48 md:h-64 object-cover rounded-lg"
                          />
                          {image.isPrimary && (
                            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          {selectedProduct.name}
                        </h3>
                        {(selectedProduct.isFeatured ||
                          selectedProduct.featured) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ Featured
                          </span>
                        )}
                        {selectedProduct.isOrganic && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🌿 Organic
                          </span>
                        )}
                        {selectedProduct.isBestseller && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            🔥 Best Seller
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(selectedProduct.price)}
                        </span>
                        {selectedProduct.originalPrice &&
                          selectedProduct.originalPrice >
                            selectedProduct.price && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(selectedProduct.originalPrice)}
                            </span>
                          )}
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            !selectedProduct.isActive
                              ? "bg-red-100 text-red-800"
                              : selectedProduct.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {!selectedProduct.isActive
                            ? "Inactive"
                            : selectedProduct.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {selectedProduct.shortDescription}
                      </p>

                      {selectedProduct.description && (
                        <p className="text-gray-700 mb-4">
                          {selectedProduct.description}
                        </p>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">SKU:</span>
                        <p className="text-gray-600">{selectedProduct.sku}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Category:
                        </span>
                        <p className="text-gray-600">
                          {selectedProduct.category}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Stock:
                        </span>
                        <p className="text-gray-600">{selectedProduct.stock}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Origin:
                        </span>
                        <p className="text-gray-600">
                          {selectedProduct.origin || "India"}
                        </p>
                      </div>
                      {selectedProduct.weight?.value && (
                        <div>
                          <span className="font-medium text-gray-900">
                            Weight:
                          </span>
                          <p className="text-gray-600">
                            {selectedProduct.weight.value}{" "}
                            {selectedProduct.weight.unit}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {selectedProduct.tags?.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-900 block mb-2">
                          Tags:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nutritional Information */}
                    {selectedProduct.nutritionalInfo &&
                      Object.keys(selectedProduct.nutritionalInfo).length >
                        0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            Nutritional Information (per 100g)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {Object.entries(
                              selectedProduct.nutritionalInfo
                            ).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 p-2 rounded">
                                <span className="font-medium text-gray-900 capitalize block">
                                  {key}:
                                </span>
                                <span className="text-gray-600">{value}g</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      closeDetailModal();
                      handleEdit(selectedProduct);
                    }}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this product?"
                        )
                      ) {
                        handleDelete(selectedProduct._id);
                        closeDetailModal();
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Product
                  </button>
                  <button
                    onClick={closeDetailModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal - Your existing modal code remains the same */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Product SKU"
                      />
                      <button
                        type="button"
                        onClick={generateSKU}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight Value
                    </label>
                    <input
                      type="number"
                      name="weight.value"
                      value={formData.weight.value}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight Unit
                    </label>
                    <select
                      name="weight.unit"
                      value={formData.weight.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {weightUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Brief product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Detailed product description..."
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="mb-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={image.url}
                            onChange={(e) =>
                              handleImageChange(index, "url", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Alt text"
                            value={image.alt}
                            onChange={(e) =>
                              handleImageChange(index, "alt", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={image.isPrimary}
                            onChange={(e) =>
                              handleImageChange(
                                index,
                                "isPrimary",
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Primary Image
                          </span>
                        </label>
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                  >
                    + Add Another Image
                  </button>
                </div>

                {/* Nutritional Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Nutritional Information (per 100g)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(formData.nutritionalInfo).map((nutrient) => (
                      <div key={nutrient}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {nutrient}
                        </label>
                        <input
                          type="number"
                          name={`nutritionalInfo.${nutrient}`}
                          value={formData.nutritionalInfo[nutrient]}
                          onChange={handleInputChange}
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tagsInput || formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="organic, healthy, gluten-free, vegan"
                  />
                  {/* Show processed tags preview */}
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Flags */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Product Flags
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Featured
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isOrganic"
                        checked={formData.isOrganic}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Organic
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isBestseller"
                        checked={formData.isBestseller}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Bestseller
                      </span>
                    </label>
                  </div>
                </div>

                {/* Origin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="India"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 mt-6 md:mt-8">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full md:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
