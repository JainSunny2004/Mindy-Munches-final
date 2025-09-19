import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import {
  getStockStats,
  updateProductStock,
  restockLowItems,
} from "../../utils/adminApi";

const StockManagement = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restocking, setRestocking] = useState(false);
  const [updating, setUpdating] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const { token } = useAuthStore();

  // ✅ Toast notification function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Fetch stock data using proper API
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStockStats(token);
      setStockData(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open update modal
  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setNewStockValue(product.stock.toString());
    setShowUpdateModal(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedProduct(null);
    setNewStockValue("");
    setModalLoading(false);
  };

  // ✅ Handle modal stock update - NO ALERT
  const handleModalStockUpdate = async () => {
    if (!selectedProduct || newStockValue === "") return;

    const newStock = parseInt(newStockValue);
    if (isNaN(newStock) || newStock < 0) {
      showToast("Please enter a valid stock number (0 or greater)", "error");
      return;
    }

    try {
      setModalLoading(true);

      await updateProductStock(selectedProduct._id, newStock, "set", token);

      // Refresh stock data
      await fetchStockData();

      // ✅ Using toast instead of alert
      showToast(`Stock updated: ${selectedProduct.name} → ${newStock} units`);
      closeUpdateModal();
    } catch (error) {
      console.error("Error updating stock:", error);
      showToast(`Failed to update stock: ${error.message}`, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ Handle bulk restock - NO ALERT
  const handleBulkRestock = async () => {
    if (!stockData?.lowStock || stockData.lowStock === 0) {
      showToast("No low stock items to restock!", "warning");
      return;
    }

    if (
      !window.confirm(
        `Restock all ${stockData.lowStock} low stock items to 100 units each?`
      )
    ) {
      return;
    }

    try {
      setRestocking(true);

      const response = await restockLowItems(100, token);

      // ✅ Using toast instead of alert
      showToast(
        `Successfully restocked ${response.data.modifiedCount} products to 100 units each!`
      );

      // Refresh stock data
      await fetchStockData();
    } catch (error) {
      console.error("Error restocking:", error);
      showToast(`Failed to restock: ${error.message}`, "error");
    } finally {
      setRestocking(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStockData();
    }
  }, [token]);

  // ✅ UPDATED: Three-tier stock status system
  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-800",
        icon: "❌",
      };
    if (stock < 50)
      return {
        label: "Critical Stock",
        color: "bg-red-100 text-red-800",
        icon: "🚨",
      };
    if (stock < 100)
      return {
        label: "Medium Stock",
        color: "bg-yellow-100 text-yellow-800",
        icon: "⚠️",
      };
    return {
      label: "Well Stocked",
      color: "bg-green-100 text-green-800",
      icon: "✅",
    };
  };

  const formatPrice = (price) => {
    return price ? `₹${(price / 100).toLocaleString("en-IN")}` : "₹0";
  };

  // ✅ UPDATED: Render product tile with correct three-tier colors
  const renderProductTile = (product, showUpdateButton = true) => {
    const status = getStockStatus(product.stock);

    return (
      <div
        key={product._id}
        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center space-x-4">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg border"
            />
          )}
          <div>
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600">{product.category}</p>
            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color} mt-1`}
            >
              {status.icon} {product.stock} in stock
            </span>
          </div>
        </div>

        {showUpdateButton && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Stock</p>
              {/* ✅ FIXED: Three-tier color system for stock numbers */}
              <p
                className={`text-2xl font-bold ${
                  product.stock === 0
                    ? "text-red-600" // 0 = Red
                    : product.stock < 50 // 1-49 = Red
                    ? "text-red-600"
                    : product.stock < 100 // 50-99 = Yellow
                    ? "text-yellow-600"
                    : "text-green-600" // 100+ = Green
                }`}
              >
                {product.stock}
              </p>
            </div>
            <button
              onClick={() => openUpdateModal(product)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              📝 Update Stock
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading stock data</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchStockData}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          <span className="text-lg">
            {toast.type === "success"
              ? "✅"
              : toast.type === "error"
              ? "❌"
              : "⚠️"}
          </span>
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() =>
              setToast({ show: false, message: "", type: "success" })
            }
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
          <p className="text-gray-600 mt-1">
            Monitor and update inventory levels
          </p>
        </div>

        {/* Restock Button */}
        {stockData?.lowStock > 0 && (
          <button
            onClick={handleBulkRestock}
            disabled={restocking}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {restocking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Restocking...
              </>
            ) : (
              <>📦 Restock Low Items ({stockData.lowStock})</>
            )}
          </button>
        )}
      </div>

      {/* Stock Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Products",
            value: stockData?.totalProducts || 0,
            color: "text-gray-900",
            bgColor: "bg-blue-100",
            icon: "📦",
          },
          {
            label: "Out of Stock",
            value: stockData?.outOfStock || 0,
            color: "text-red-600",
            bgColor: "bg-red-100",
            icon: "📭",
          },
          {
            label: "Low Stock",
            value: stockData?.lowStock || 0,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
            icon: "⚠️",
          },
          {
            label: "Well Stocked",
            value: stockData?.wellStocked || 0,
            color: "text-green-600",
            bgColor: "bg-green-100",
            icon: "✅",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: "overview", label: "Overview", count: null },
            { id: "low-stock", label: "Low Stock", count: stockData?.lowStock },
            {
              id: "out-of-stock",
              label: "Out of Stock",
              count: stockData?.outOfStock,
            },
            {
              id: "well-stocked",
              label: "Well Stocked",
              count: stockData?.wellStocked,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-orange-500 bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Stock Overview
                </h3>
                <p className="text-gray-600">
                  You have {stockData?.totalProducts || 0} active products in
                  your inventory.
                  {stockData?.lowStock > 0 && (
                    <span className="block mt-2 text-yellow-600">
                      ⚠️ {stockData.lowStock} products need restocking
                    </span>
                  )}
                  {stockData?.outOfStock > 0 && (
                    <span className="block mt-1 text-red-600">
                      🚨 {stockData.outOfStock} products are out of stock
                    </span>
                  )}
                  {stockData?.wellStocked > 0 && (
                    <span className="block mt-1 text-green-600">
                      ✅ {stockData.wellStocked} products are well stocked
                    </span>
                  )}
                </p>
              </motion.div>
            )}

            {activeTab === "low-stock" && (
              <motion.div
                key="low-stock"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Low Stock Products
                  </h3>
                  {stockData?.lowStockProducts?.length > 0 ? (
                    <div className="space-y-3">
                      {stockData.lowStockProducts.map((product) =>
                        renderProductTile(product)
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">✅</div>
                      <p>No low stock products!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "out-of-stock" && (
              <motion.div
                key="out-of-stock"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Out of Stock Products
                  </h3>
                  {stockData?.outOfStockProducts?.length > 0 ? (
                    <div className="space-y-3">
                      {stockData.outOfStockProducts.map((product) =>
                        renderProductTile(product)
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📦</div>
                      <p>No out of stock products!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ✅ FIXED: Well Stocked Tab with proper product mapping */}
            {activeTab === "well-stocked" && (
              <motion.div
                key="well-stocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Well Stocked Products
                  </h3>
                  {stockData?.wellStockedProducts?.length > 0 ? (
                    <div className="space-y-3">
                      {stockData.wellStockedProducts.map((product) =>
                        renderProductTile(product)
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📦</div>
                      <p>No well stocked products found!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Stock
            </h3>

            {selectedProduct && (
              <div className="space-y-4">
                {/* Product Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {selectedProduct.images?.[0] && (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.category}
                    </p>
                    <p className="text-sm text-orange-600">
                      Current: {selectedProduct.stock} units
                    </p>
                  </div>
                </div>

                {/* Stock Input */}
                <div>
                  <label
                    htmlFor="stock-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Stock Quantity
                  </label>
                  <input
                    id="stock-input"
                    type="number"
                    min="0"
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter stock quantity"
                    autoFocus
                  />
                </div>

                {/* ✅ FIXED: Quick Actions with updated preset */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewStockValue("0")}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    Set to 0
                  </button>
                  <button
                    onClick={() => setNewStockValue("50")}
                    className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    Set to 50
                  </button>
                  <button
                    onClick={() => setNewStockValue("100")}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    Set to 100
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeUpdateModal}
                    disabled={modalLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalStockUpdate}
                    disabled={modalLoading || newStockValue === ""}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {modalLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Stock"
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Last Updated */}
      {stockData?.lastUpdated && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {new Date(stockData.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default StockManagement;
