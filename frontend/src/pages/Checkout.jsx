import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import CheckoutSuccess from "../components/CheckoutSuccess";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, getItemCount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [orderData, setOrderData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    paymentMethod: "razorpay",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: "/checkout",
          message: "Please login to proceed with checkout",
        },
      });
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !showSuccess) {
      navigate("/cart");
    }
  }, [items.length, navigate, showSuccess]);

  const formatPrice = (price) => {
    return `₹ ${(price / 100).toLocaleString("en-IN")}`;
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 50000 ? 0 : 5000; // Free shipping above ₹500
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setOrderData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!orderData.name.trim()) newErrors.name = "Name is required";
    if (!orderData.email.trim()) newErrors.email = "Email is required";
    if (!orderData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!orderData.address.street.trim())
      newErrors["address.street"] = "Street address is required";
    if (!orderData.address.city.trim())
      newErrors["address.city"] = "City is required";
    if (!orderData.address.state.trim())
      newErrors["address.state"] = "State is required";
    if (!orderData.address.pincode.trim())
      newErrors["address.pincode"] = "Pincode is required";

    // Phone validation
    if (
      orderData.phone &&
      !/^\d{10}$/.test(orderData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Email validation
    if (orderData.email && !/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Pincode validation
    if (
      orderData.address.pincode &&
      !/^\d{6}$/.test(orderData.address.pincode)
    ) {
      newErrors["address.pincode"] = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add this function to your Checkout.jsx component
const handleRazorpayPayment = (razorpayOrderId) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RIgXHSN9Xwq7U9',
      amount: total * 100, // Convert to paise
      currency: 'INR',
      name: 'Mindy Munchs',
      description: 'Order Payment',
      order_id: razorpayOrderId,
      handler: function (response) {
        console.log('Razorpay payment successful:', response);
        resolve(response);
      },
      prefill: {
        name: orderData.name,
        email: orderData.email,
        contact: orderData.phone
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function() {
          reject(new Error('Payment cancelled by user'));
        }
      }
    };

    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      reject(new Error('Razorpay SDK not loaded'));
    }
  });
};

  const handlePlaceOrder = async () => {
  if (!validateForm()) return;
  
  setIsProcessing(true);
  
  try {
    // Step 1: Create Razorpay order
    const orderResponse = await fetch('/api/payment/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
      },
      body: JSON.stringify({
        amount: total,
        currency: 'INR',
        orderData: {
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone
        }
      })
    });

    if (!orderResponse.ok) throw new Error('Failed to create order');
    
    const { id: razorpayOrderId } = await orderResponse.json();

    // Step 2: Handle Razorpay payment
    const paymentResponse = await handleRazorpayPayment(razorpayOrderId);

    // Step 3: Verify payment and create order
    const verifyResponse = await fetch('/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isAuthenticated && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
      },
      body: JSON.stringify({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        orderDetails: {
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          items: items,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          totalAmount: total
        }
      })
    });

    const result = await verifyResponse.json();
    
    if (result.success) {
      clearCart();
      setOrderId(result.orderNumber);
      setShowSuccess(true);
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    console.error('Order placement failed:', error);
    alert(`Order failed: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

  if (showSuccess) {
    return (
      <CheckoutSuccess orderId={orderId} orderData={orderData} total={total} />
    );
  }

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-800">Checkout</h1>
          <p className="text-neutral-600 mt-1">Complete your order</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
            >
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={orderData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.name ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.phone ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orderData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email ? "border-red-500" : "border-neutral-300"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={orderData.address.street}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors["address.street"]
                          ? "border-red-500"
                          : "border-neutral-300"
                      }`}
                      placeholder="Enter your street address"
                    />
                    {errors["address.street"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["address.street"]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="address.landmark"
                      value={orderData.address.landmark}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={orderData.address.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors["address.city"]
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="City"
                      />
                      {errors["address.city"] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors["address.city"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={orderData.address.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors["address.state"]
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="State"
                      />
                      {errors["address.state"] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors["address.state"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={orderData.address.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors["address.pincode"]
                            ? "border-red-500"
                            : "border-neutral-300"
                        }`}
                        placeholder="Pincode"
                      />
                      {errors["address.pincode"] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors["address.pincode"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                  Payment Method
                </h2>
                <div className="border border-neutral-200 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={orderData.paymentMethod === "razorpay"}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <span className="ml-3 font-medium">Pay with Razorpay</span>
                  </label>
                  <p className="text-sm text-neutral-600 mt-2 ml-6">
                    Secure payment via UPI, Cards, NetBanking & Wallets
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-neutral-800">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    Subtotal ({getItemCount()} items)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax (18% GST)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-neutral-800">
                      Total
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isProcessing
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - ${formatPrice(total)}`
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
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
                      d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
