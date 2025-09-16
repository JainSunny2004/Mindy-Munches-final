import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; // <-- Added for API calls
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

    if (
      orderData.phone &&
      !/^\d{10}$/.test(orderData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (orderData.email && !/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (orderData.address.pincode && !/^\d{6}$/.test(orderData.address.pincode)) {
      newErrors["address.pincode"] = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRazorpayPayment = async () => {
    try {
      // Step 1: Create order on backend
      const { data: order } = await axios.post("/api/payment/create-order", {
        amount: total / 100, // send rupees
      });

      // Step 2: Setup Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Mindy Munchs",
        description: `Order for ${getItemCount()} items`,
        image: "/Mindy Munchs_Logo-01.png",
        order_id: order.id, // use backend order id
        handler: async function (response) {
          // Step 3: Verify payment with backend
          await axios.post("/api/payment/verify-payment", {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          return response;
        },
        prefill: {
          name: orderData.name,
          email: orderData.email,
          contact: orderData.phone,
        },
        notes: {
          address: `${orderData.address.street}, ${orderData.address.city}, ${orderData.address.state} - ${orderData.address.pincode}`,
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      return new Promise((resolve, reject) => {
        rzp.on("payment.failed", function (response) {
          reject(new Error(response.error.description));
        });
        rzp.open();
      });
    } catch (err) {
      throw new Error(err.message || "Payment initialization failed");
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      let paymentResponse = null;

      if (orderData.paymentMethod === "razorpay") {
        paymentResponse = await handleRazorpayPayment();
        console.log("Payment completed:", paymentResponse);
      }

      const newOrderId = `ORD${Date.now()}`;
      setOrderId(newOrderId);

      const orderPayload = {
        orderId: newOrderId,
        user: {
          id: user?.id,
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
        },
        items,
        address: orderData.address,
        pricing: { subtotal, shipping, tax, total },
        paymentMethod: orderData.paymentMethod,
        paymentDetails: paymentResponse,
        timestamp: new Date().toISOString(),
      };

      // Save order to backend
      await axios.post("/api/orders", orderPayload);

      clearCart();
      setShowSuccess(true);
    } catch (error) {
      console.error("Order placement failed:", error);
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

  if (!isAuthenticated || items.length === 0) return null;

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
          {/* Form */}
          <div className="lg:col-span-2">
            {/* keep your existing form UI (same as before)... */}
            {/* ... */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* same summary UI */}
            {/* ... */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                isProcessing
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              {isProcessing
                ? "Processing..."
                : `Place Order - ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;