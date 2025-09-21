import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import { formatPrice } from "../../utils/priceUtils";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { token, isAuthenticated } = useAuthStore();

  // ✅ Available filter options based on your Order model
  const statusOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    { value: "pending", label: "Pending", count: orders.filter((o) => o.status === "pending").length },
    { value: "confirmed", label: "Confirmed", count: orders.filter((o) => o.status === "confirmed").length },
    { value: "processing", label: "Processing", count: orders.filter((o) => o.status === "processing").length },
    { value: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
    { value: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
    { value: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
  ];

  const paymentOptions = [
    { value: "all", label: "All Payments" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
  ];

  // ✅ Helper function to format address
  const formatAddress = (address) => {
    if (!address) return "No address provided";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode || address.pincode,
    ].filter(Boolean);
    return parts.join(", ") || "Incomplete address";
  };


  // ✅ Fetch orders with filters
  const fetchAllOrders = async (status = "all", paymentStatus = "all") => {
    if (!isAuthenticated || !token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ Build query parameters
      const queryParams = new URLSearchParams();
      if (status !== "all") queryParams.append("status", status);
      if (paymentStatus !== "all") queryParams.append("paymentStatus", paymentStatus);

      const queryString = queryParams.toString();
      const url = `${import.meta.env.VITE_API_URL}/orders/admin/all${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("🚀 Fetching filtered orders:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch orders: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("📦 Raw API response:", data);

      // ✅ Handle different API response structures
      let ordersArray = [];

      if (Array.isArray(data)) {
        ordersArray = data;
      } else if (Array.isArray(data.orders)) {
        ordersArray = data.orders;
      } else if (data.success && Array.isArray(data.data?.orders)) {
        ordersArray = data.data.orders;
      } else if (data.data && Array.isArray(data.data.orders)) {
        ordersArray = data.data.orders;
      } else if (Array.isArray(data.data)) {
        ordersArray = data.data;
      } else {
        console.warn("⚠️ Unexpected API response structure:", data);
        ordersArray = [];
      }

      // ✅ Transform data
      const transformedOrders = ordersArray.map((order) => ({
        id: order._id || order.id,
        orderNumber: order.orderNumber || order._id || "N/A",
        customerName: order.shippingAddress?.name || order.user?.name || "Unknown Customer",
        email: order.shippingAddress?.email || order.user?.email || "No email",
        items: (order.items || []).map((item) => ({
          name: item.name || item.title || "Unknown Product",
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        total: order.totalAmount || order.total || 0,
        status: order.orderStatus || order.status || "pending",
        paymentStatus: order.paymentStatus || "pending",
        orderDate: order.createdAt || order.orderDate || new Date().toISOString(),
        shippingAddress: formatAddress(order.shippingAddress),
        phone: order.shippingAddress?.phone || order.phone || "No phone",
        paymentMethod: order.paymentMethod || "unknown",
      }));

      console.log("✅ Transformed orders:", transformedOrders);
      setOrders(transformedOrders);
    } catch (error) {
      console.error("❌ Error fetching admin orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load and when filters change
  useEffect(() => {
    fetchAllOrders(statusFilter, paymentFilter);
  }, [token, isAuthenticated, statusFilter, paymentFilter]);

  // ✅ Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update: ${response.status} - ${errorData}`);
      }

      // ✅ Update local state on success
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert(`Failed to update order status: ${error.message}`);
    }
  };

  // ✅ Status color helpers
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      refunded: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // ✅ Filter orders by search term (client-side)
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      order.phone.includes(searchTerm)
    );
  });

  // ✅ Quick stats based on filtered results
  const stats = {
    total: filteredOrders.length,
    completed: filteredOrders.filter((o) => ["delivered", "completed"].includes(o.status)).length,
    pending: filteredOrders.filter((o) => ["pending", "confirmed"].includes(o.status)).length,
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading orders</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
      </div>

      {/* ✅ Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">Total Orders: {stats.total}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">Completed: {stats.completed}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">Pending: {stats.pending}</p>
          </div>
        </div>
      </div>

      {/* ✅ Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order number, customer name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === option.value
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label} {option.count > 0 && statusFilter !== "all" && `(${option.count})`}
              </button>
            ))}
          </div>

          {/* Payment Status Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 py-2">Payment Status:</span>
            {paymentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPaymentFilter(option.value)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  paymentFilter === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="text-gray-400 mb-4 text-4xl">📦</div>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                  ? "No orders match your current filters"
                  : "Orders will appear here once customers place them"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                      <span>
                        <strong>Customer:</strong> {order.customerName}
                      </span>
                      <span>
                        <strong>Email:</strong> {order.email}
                      </span>
                      <span>
                        <strong>Phone:</strong> {order.phone}
                      </span>
                      <span>
                        <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                      <span>
                        <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <strong className="text-sm text-gray-600">Shipping:</strong>
                      <span className="text-sm text-gray-600 ml-1">{order.shippingAddress}</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end gap-2">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        Order: {order.status.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderManagement;
