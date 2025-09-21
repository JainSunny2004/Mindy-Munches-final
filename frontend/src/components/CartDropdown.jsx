import { Link, useNavigate } from "react-router-dom";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { formatPrice } from "../utils/priceUtils";

const CartDropdown = ({ isOpen, onClose, isMobile = false }) => {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleRemoveItem = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(productId);
  };

  const handleUpdateQuantity = (productId, quantity, e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(productId, quantity);
  };

  // Updated: Handle checkout with login check
  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Show notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-20 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm";
      notification.textContent = "Please login to place your order";
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 4000);

      navigate("/auth", {
        state: {
          from: "/checkout",
          message: "Please login to place your order",
        },
      });
      onClose();
      return;
    }

    // User is authenticated, proceed to checkout
    navigate("/checkout");
    onClose();
  };

  const desktopVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  };

  const mobileVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  const dropdownVariants = isMobile ? mobileVariants : desktopVariants;
  const dropdownClasses = isMobile
    ? "fixed right-2 top-16 left-2 sm:right-4 sm:left-auto sm:w-80 bg-white rounded-xl shadow-xl border border-neutral-200 z-[60] max-h-[70vh] overflow-hidden"
    : "absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-neutral-200 z-50 max-h-96 overflow-hidden";

  if (items.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={dropdownClasses}
            onMouseLeave={!isMobile ? onClose : undefined}
          >
            <div className="p-6 text-center">
              {isMobile && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-neutral-100"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="text-4xl mb-3">🛒</div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                Add some delicious products to get started!
              </p>
              {/* Updated: Show shopping link for everyone */}
              <Link
                to="/products"
                className="btn-primary w-full"
                onClick={onClose}
              >
                Start Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={dropdownClasses}
          onMouseLeave={!isMobile ? onClose : undefined}
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-100 bg-neutral-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to="/cart"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  onClick={onClose}
                >
                  View All
                </Link>
                {isMobile && (
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors ml-2 p-1 rounded-full hover:bg-neutral-200"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div
            className={`${
              isMobile ? "max-h-48" : "max-h-60"
            } overflow-y-auto bg-white`}
          >
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <Link
                      to={`/products/${item.id}`}
                      onClick={onClose}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.id}`}
                        onClick={onClose}
                        className="block"
                      >
                        <h4 className="font-medium text-neutral-800 text-sm line-clamp-1 hover:text-primary-600 transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.category}
                      </p>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-300 rounded text-xs bg-white">
                          <button
                            onClick={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity - 1,
                                e
                              )
                            }
                            className="p-1 hover:bg-neutral-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <svg
                              className="w-3 h-3"
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
                          <span className="px-2 py-1 min-w-[24px] text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity + 1,
                                e
                              )
                            }
                            className="p-1 hover:bg-neutral-100 transition-colors"
                          >
                            <svg
                              className="w-3 h-3"
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

                        <div className="text-right">
                          <div className="font-semibold text-neutral-800 text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <button
                            onClick={(e) => handleRemoveItem(item.id, e)}
                            className="text-xs text-red-500 hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 bg-primary-50 border-t border-primary-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-neutral-700">Subtotal</span>
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(getTotal())}
              </span>
            </div>

            {/* Authentication Notice */}
            {!isAuthenticated && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium">
                    Login required to place order
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Link
                to="/cart"
                className="w-full btn-secondary text-sm py-2 block text-center"
                onClick={onClose}
              >
                View Full Cart
              </Link>
              <button
                onClick={handleProceedToCheckout}
                className={`w-full text-sm py-2 rounded-lg font-semibold transition-colors ${
                  !isAuthenticated
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                }`}
              >
                {!isAuthenticated
                  ? "Proceed to Checkout"
                  : "Proceed to Checkout"}
              </button>
            </div>

            <p className="text-xs text-neutral-500 text-center mt-2">
              Free shipping on orders above ₹500
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;
