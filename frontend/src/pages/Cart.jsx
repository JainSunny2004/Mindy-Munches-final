import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import EmptyState from "../components/EmptyState";

const Cart = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    fetchCart,
    loading,
  } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdating, setIsUpdating] = useState({});

  // Fetch cart data when component mounts (allow for guests)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const formatPrice = (price) => {
    return `₹ ${(price).toLocaleString("en-IN")}`;
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setIsUpdating((prev) => ({ ...prev, [productId]: true }));
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Update quantity failed:", error);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      try {
        setIsUpdating((prev) => ({ ...prev, [productId]: true }));
        await removeItem(productId);
      } catch (error) {
        console.error("Remove item failed:", error);
      } finally {
        setIsUpdating((prev) => ({ ...prev, [productId]: false }));
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
        // Show notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
        notification.textContent = "Cart cleared successfully!";
        document.body.appendChild(notification);
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      } catch (error) {
        console.error("Clear cart failed:", error);
      }
    }
  };

  // Handle checkout button click: require login to proceed
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: "/checkout",
          message: "Please login to proceed to checkout",
        },
      });
      return;
    }
    navigate("/checkout");
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 500 ? 0 : 50; // Free shipping above ₹50000
  const total = subtotal + shipping ;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            {getItemCount() > 0
              ? `${getItemCount()} ${
                  getItemCount() === 1 ? "item" : "items"
                } in your cart`
              : "Your cart is empty"}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <EmptyState
              title="Your cart is empty"
              description="Start adding some delicious traditional products to your cart!"
              actionText="Browse Products"
              actionLink="/products"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Cart Items
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-neutral-200">
                  {items.map((item) => (
                    <div
                      key={item.product._id || item.product.id}
                      className="p-6"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.product.images?.[0]?.url ||
                              item.product.images?.[0] ||
                              "/placeholder-image.jpg"
                            }
                            alt={item.product.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-neutral-900">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-neutral-600 capitalize">
                                {item.product.category}
                              </p>
                              <p className="text-sm text-neutral-500 mt-1">
                                {item.product.description}
                              </p>
                            </div>
                          </div>

                          {/* Quantity and Price Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product._id || item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  isUpdating[
                                    item.product._id || item.product.id
                                  ] || item.quantity <= 1
                                }
                                className="p-1 rounded-full hover:bg-neutral-100 disabled:opacity-50"
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

                              <span className="text-lg font-medium px-3 py-1 bg-neutral-100 rounded-lg min-w-[3rem] text-center">
                                {isUpdating[item.product._id || item.product.id]
                                  ? "..."
                                  : item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.product._id || item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  isUpdating[
                                    item.product._id || item.product.id
                                  ]
                                }
                                className="p-1 rounded-full hover:bg-neutral-100 disabled:opacity-50"
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

                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-semibold text-neutral-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveItem(
                                    item.product._id || item.product.id
                                  )
                                }
                                disabled={
                                  isUpdating[
                                    item.product._id || item.product.id
                                  ]
                                }
                                className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Order Summary
                </h2>

                {/* Customer Info */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h3 className="font-medium text-neutral-900 mb-2">
                    Deliver to:
                  </h3>
                  <p className="text-sm font-medium text-neutral-900">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-neutral-600">{user?.email || "-"}</p>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>


                  <hr className="my-3" />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                {subtotal < 500 && (
                  <div className="mb-6 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      Add {formatPrice(500 - subtotal)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 mb-4"
                  disabled={loading || items.length === 0}
                  onClick={handleCheckoutClick}
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Continue Shopping
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
