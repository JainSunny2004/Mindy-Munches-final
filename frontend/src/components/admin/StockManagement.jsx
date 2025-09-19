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

  // ✅ UPDATED: Ultra mobile-friendly product tile
  const renderProductTile = (product, showUpdateButton = true) => {
    const status = getStockStatus(product.stock);

    return (
      <div
        key={product._id}
        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
      >
        {/* Mobile-first layout */}
        <div className="flex items-start space-x-3 mb-3">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {product.name}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">{product.category}</p>
            <p className="text-xs font-medium text-gray-900 mt-0.5">
              {formatPrice(product.price)}
            </p>
          </div>
          {/* Stock number on the right */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Stock</p>
            <p
              className={`text-lg font-bold ${
                product.stock === 0
                  ? "text-red-600"
                  : product.stock < 50
                  ? "text-red-600"
                  : product.stock < 100
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {product.stock}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
          >
            {status.icon} {status.label}
          </span>

          {showUpdateButton && (
            <button
              onClick={() => openUpdateModal(product)}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-xs font-medium"
            >
              Update
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
          <p className="font-semibold text-sm">Error loading stock data</p>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={fetchStockData}
            className="mt-2 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Ultra compact toast for mobile */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-2 left-2 right-2 z-50 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            <span className="text-sm">
              {toast.type === "success"
                ? "✅"
                : toast.type === "error"
                ? "❌"
                : "⚠️"}
            </span>
            <span className="font-medium text-xs flex-1">{toast.message}</span>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="text-white hover:text-gray-200 text-sm"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 space-y-4">
        {/* ✅ Ultra compact header */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">Monitor and update inventory</p>
          </div>

          {/* Restock Button */}
          {stockData?.lowStock > 0 && (
            <button
              onClick={handleBulkRestock}
              disabled={restocking}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-sm"
            >
              {restocking ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Restocking...
                </>
              ) : (
                <>📦 Restock ({stockData.lowStock})</>
              )}
            </button>
          )}
        </div>

        {/* ✅ Ultra compact stats - 2x2 grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: "Total",
              value: stockData?.totalProducts || 0,
              color: "text-gray-900",
              bgColor: "bg-blue-100",
              icon: "📦",
            },
            {
              label: "Out",
              value: stockData?.outOfStock || 0,
              color: "text-red-600",
              bgColor: "bg-red-100",
              icon: "📭",
            },
            {
              label: "Low",
              value: stockData?.lowStock || 0,
              color: "text-yellow-600",
              bgColor: "bg-yellow-100",
              icon: "⚠️",
            },
            {
              label: "Good",
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
              className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 text-xs font-medium truncate">
                    {stat.label}
                  </p>
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-1`}
                >
                  <span className="text-sm">{stat.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ Ultra compact tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", count: null },
              { id: "low-stock", label: "Low", count: stockData?.lowStock },
              {
                id: "out-of-stock",
                label: "Out",
                count: stockData?.outOfStock,
              },
              {
                id: "well-stocked",
                label: "Good",
                count: stockData?.wellStocked,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap flex-1 ${
                  activeTab === tab.id
                    ? "border-b-2 border-orange-500 bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-1 bg-gray-200 text-gray-600 px-1 py-0.5 rounded text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-3">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-4"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Stock Overview
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    You have {stockData?.totalProducts || 0} products.
                    {stockData?.lowStock > 0 && (
                      <span className="block mt-1 text-yellow-600">
                        ⚠️ {stockData.lowStock} need restocking
                      </span>
                    )}
                    {stockData?.outOfStock > 0 && (
                      <span className="block mt-1 text-red-600">
                        🚨 {stockData.outOfStock} out of stock
                      </span>
                    )}
                    {stockData?.wellStocked > 0 && (
                      <span className="block mt-1 text-green-600">
                        ✅ {stockData.wellStocked} well stocked
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
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Low Stock Products
                    </h3>
                    {stockData?.lowStockProducts?.length > 0 ? (
                      <div className="space-y-2">
                        {stockData.lowStockProducts.map((product) =>
                          renderProductTile(product)
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <div className="text-2xl mb-1">✅</div>
                        <p className="text-xs">No low stock products!</p>
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
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Out of Stock Products
                    </h3>
                    {stockData?.outOfStockProducts?.length > 0 ? (
                      <div className="space-y-2">
                        {stockData.outOfStockProducts.map((product) =>
                          renderProductTile(product)
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <div className="text-2xl mb-1">📦</div>
                        <p className="text-xs">No out of stock products!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "well-stocked" && (
                <motion.div
                  key="well-stocked"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Well Stocked Products
                    </h3>
                    {stockData?.wellStockedProducts?.length > 0 ? (
                      <div className="space-y-2">
                        {stockData.wellStockedProducts.map((product) =>
                          renderProductTile(product)
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <div className="text-2xl mb-1">📦</div>
                        <p className="text-xs">No well stocked products!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Last Updated */}
        {stockData?.lastUpdated && (
          <div className="text-center text-xs text-gray-500">
            Updated: {new Date(stockData.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>

      {/* ✅ Ultra compact modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg w-full max-w-sm p-4 shadow-xl"
            >
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Update Stock
              </h3>

              {selectedProduct && (
                <div className="space-y-3">
                  {/* Product Info */}
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    {selectedProduct.images?.[0] && (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-8 h-8 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Current: {selectedProduct.stock} units
                      </p>
                    </div>
                  </div>

                  {/* Stock Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newStockValue}
                      onChange={(e) => setNewStockValue(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Enter quantity"
                      autoFocus
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => setNewStockValue("0")}
                      className="px-2 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs"
                    >
                      0
                    </button>
                    <button
                      onClick={() => setNewStockValue("50")}
                      className="px-2 py-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-xs"
                    >
                      50
                    </button>
                    <button
                      onClick={() => setNewStockValue("100")}
                      className="px-2 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs"
                    >
                      100
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={closeUpdateModal}
                      disabled={modalLoading}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModalStockUpdate}
                      disabled={modalLoading || newStockValue === ""}
                      className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors text-sm"
                    >
                      {modalLoading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockManagement;
