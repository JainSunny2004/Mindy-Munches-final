import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchAllOrders = async () => {
      // ✅ Check admin authentication
      if (!isAuthenticated || !token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🚀 Fetching admin orders...");
        // ✅ Fetch ALL orders from admin endpoint
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/admin/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Admin orders API response status:", response.status);

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Failed to fetch orders: ${response.status} - ${errorData}`
          );
        }

        const data = await response.json();
        console.log("📦 Raw API response:", data);

        // ✅ Handle different API response structures
        let ordersArray = [];

        // ✅ FIXED CODE:
        if (Array.isArray(data)) {
          // Case 1: API returns array directly
          ordersArray = data;
          console.log("📋 Using direct array format");
        } else if (Array.isArray(data.orders)) {
          // Case 2: API returns {orders: [orders]}
          ordersArray = data.orders;
          console.log("📋 Using data.orders format");
        } else if (data.success && Array.isArray(data.data?.orders)) {
          // Case 3: API returns {success: true, data: {orders: [orders]}} ← YOUR API
          ordersArray = data.data.orders;
          console.log("📋 Using success.data.orders format");
        } else if (data.data && Array.isArray(data.data.orders)) {
          // Case 4: API returns {data: {orders: [orders]}}
          ordersArray = data.data.orders;
          console.log("📋 Using data.data.orders format");
        } else if (Array.isArray(data.data)) {
          // Case 5: API returns {data: [orders]} (fallback)
          ordersArray = data.data;
          console.log("📋 Using data.data format");
        } else {
          // Case 6: No orders or unexpected structure
          console.warn("⚠️ Unexpected API response structure:", data);
          ordersArray = [];
        }

        console.log(`📊 Processing ${ordersArray.length} orders`);

        // ✅ Only proceed if we have an array
        if (!Array.isArray(ordersArray)) {
          throw new Error(
            "Invalid response structure: orders data is not an array"
          );
        }

        // ✅ Transform backend data to match component format
        const transformedOrders = ordersArray.map((order) => ({
          id: order._id || order.id,
          orderNumber: order.orderNumber || order._id || "N/A",
          customerName:
            order.shippingAddress?.name ||
            order.user?.name ||
            "Unknown Customer",
          email:
            order.shippingAddress?.email || order.user?.email || "No email",
          items: (order.items || []).map((item) => ({
            name: item.name || item.title || "Unknown Product",
            quantity: item.quantity || 1,
            price: item.price || 0,
          })),
          total: order.totalAmount || order.total || 0,
          status: order.orderStatus || order.status || "pending",
          paymentStatus: order.paymentStatus || "pending",
          orderDate:
            order.createdAt || order.orderDate || new Date().toISOString(),
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

    fetchAllOrders();
  }, [token, isAuthenticated]);

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

  // ✅ Format price helper
  const formatPrice = (price) => {
    if (!price) return "₹0";
    return `₹${(price / 100).toLocaleString("en-IN")}`;
  };

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
          body: JSON.stringify({
            orderStatus: newStatus,
          }),
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

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading orders...
          </div>
          <div className="text-sm text-gray-500">
            Fetching all customer orders
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-800">
              Error Loading Orders
            </h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main component render
  return (
    <div className="space-y-6">
      {/* ✅ Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-600 mt-1">
          Track and manage all customer orders
        </p>
        <div className="flex items-center space-x-6 mt-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              Total Orders: {orders.length}
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-green-900">
              Completed:{" "}
              {
                orders.filter((o) =>
                  ["delivered", "completed"].includes(o.status)
                ).length
              }
            </span>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-yellow-900">
              Pending: {orders.filter((o) => o.status === "pending").length}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">
            Orders will appear here once customers place them
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* ✅ Order header */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Customer:</span>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {order.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {order.phone}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Payment:</span>{" "}
                      {order.paymentMethod?.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-3">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(order.total)}
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      Order: {order.status?.toUpperCase()}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus?.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Order items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Items Ordered:
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-gray-500 ml-2">
                          × {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ Shipping address */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Shipping Address:
                </h4>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-gray-700">{order.shippingAddress}</p>
                </div>
              </div>

              {/* ✅ Status update */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
