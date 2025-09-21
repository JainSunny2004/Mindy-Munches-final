import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "../utils/priceUtils";

const OrderCard = ({ order, index }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplay = (order) => {
    const statusMap = {
      pending: { color: "text-yellow-600", text: "Pending" },
      confirmed: { color: "text-blue-600", text: "Confirmed" },
      processing: { color: "text-purple-600", text: "Processing" },
      shipped: { color: "text-indigo-600", text: "Shipped" },
      delivered: { color: "text-green-600", text: "Delivered" },
      cancelled: { color: "text-red-600", text: "Cancelled" },
    };
    return statusMap[order.orderStatus] || statusMap.pending;
  };

  const getDeliveryStatus = (order) => {
    if (order.orderStatus === "delivered") {
      return `Delivered on ${formatDate(order.updatedAt)}`;
    }
    if (order.estimatedDelivery) {
      return `Expected delivery: ${formatDate(order.estimatedDelivery)}`;
    }
    return "Delivery date will be updated soon";
  };

  const statusDisplay = getStatusDisplay(order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Order Header */}
      <div className="p-4 border-b border-neutral-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-neutral-800">
              Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-neutral-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${statusDisplay.color}`}>
              {statusDisplay.text}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Payment: {order.paymentStatus}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-neutral-600">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
            <span className="font-semibold text-primary-600 ml-1">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            {expanded ? "Hide Details" : "View Details"}
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              className="w-4 h-4"
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
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Order Items */}
              <div>
                <h4 className="font-medium text-neutral-800 mb-3">
                  Order Items
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="font-medium text-neutral-800 text-sm">
                          {item.name}
                        </h5>
                        <p className="text-xs text-neutral-600">
                          Qty: {item.quantity} × {formatPrice(item.price)} ={" "}
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span>{formatPrice(order.shippingCost)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-neutral-800 border-t border-neutral-200 pt-1">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-neutral-100 pt-3">
                <h4 className="font-medium text-neutral-800 mb-2">
                  Shipping Address
                </h4>
                <div className="text-sm text-neutral-600">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t border-neutral-100 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {getDeliveryStatus(order)}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-neutral-600 mt-1">
                        Tracking:{" "}
                        <span className="font-mono font-medium">
                          {order.trackingNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderCard;
