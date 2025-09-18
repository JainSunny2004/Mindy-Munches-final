// Frontend utility functions for Razorpay integration
// Maintains consistency with existing Mindy Munchs architecture

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiatePayment = async ({
  orderData,
  razorpayOrderId,
  onSuccess,
  onFailure,
  onDismiss
}) => {
  try {
    // Ensure Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay payment gateway');
    }

    // Razorpay configuration options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: orderData.totalAmount * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      name: 'Mindy Munchs',
      description: `Order for ${orderData.items?.length || 0} items`,
      image: '/logo.png', // Your app logo
      order_id: razorpayOrderId, // Razorpay order_id from backend
      
      // Customer details
      prefill: {
        name: orderData.shippingAddress?.name || '',
        email: orderData.userEmail || '',
        contact: orderData.shippingAddress?.phone || ''
      },
      
      // Address details
      customer: {
        name: orderData.shippingAddress?.name || '',
        email: orderData.userEmail || '',
        contact: orderData.shippingAddress?.phone || ''
      },
      
      // Theme customization
      theme: {
        color: '#ff6b6b' // Mindy Munchs brand color
      },
      
      // Payment method configuration
      method: {
        netbanking: true,
        card: true,
        wallet: true,
        upi: true,
        paylater: true
      },
      
      // Success handler
      handler: function (response) {
        console.log('✅ Payment successful:', response);
        
        // Prepare success data
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderData: orderData
        };
        
        if (onSuccess) {
          onSuccess(paymentData);
        }
      },
      
      // Modal configuration
      modal: {
        ondismiss: function() {
          console.log('💸 Payment modal dismissed');
          if (onDismiss) {
            onDismiss();
          }
        },
        
        // Handle payment failures
        escape: true,
        animation: true
      },
      
      // Notes for internal reference
      notes: {
        order_type: 'food_products',
        customer_type: 'web_customer',
        platform: 'mindy_munchs_web'
      }
    };

    // Create Razorpay instance and open
    const rzp = new window.Razorpay(options);
    
    // Handle payment failures
    rzp.on('payment.failed', function (response) {
      console.error('❌ Payment failed:', response.error);
      
      const errorData = {
        error_code: response.error.code,
        error_description: response.error.description,
        error_source: response.error.source,
        error_step: response.error.step,
        error_reason: response.error.reason,
        order_id: response.error.metadata?.order_id,
        payment_id: response.error.metadata?.payment_id
      };
      
      if (onFailure) {
        onFailure(errorData);
      }
    });

    // Open payment modal
    rzp.open();
    
    return rzp;
    
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    if (onFailure) {
      onFailure({
        error_code: 'INITIALIZATION_ERROR',
        error_description: error.message,
        error_source: 'client',
        error_step: 'initialization'
      });
    }
    throw error;
  }
};

// Verify payment status (optional - mainly for debugging)
export const getPaymentStatus = (paymentId) => {
  // This would typically call your backend API
  return fetch(`${import.meta.env.VITE_API_URL}/payments/status/${paymentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .catch(error => {
    console.error('❌ Error fetching payment status:', error);
    throw error;
  });
};

// Format amount for display (₹1,234.56)
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Validate Razorpay configuration
export const validateRazorpayConfig = () => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    console.error('❌ VITE_RAZORPAY_KEY_ID not found in environment variables');
    return false;
  }
  
  if (!keyId.startsWith('rzp_')) {
    console.error('❌ Invalid Razorpay Key ID format');
    return false;
  }
  
  console.log('✅ Razorpay configuration validated');
  return true;
};

// Handle network errors gracefully
export const handlePaymentError = (error) => {
  let userMessage = 'Payment failed. Please try again.';
  
  switch (error.error_code) {
    case 'BAD_REQUEST_ERROR':
      userMessage = 'Invalid payment request. Please check your details.';
      break;
    case 'GATEWAY_ERROR':
      userMessage = 'Payment gateway error. Please try again in a few moments.';
      break;
    case 'NETWORK_ERROR':
      userMessage = 'Network error. Please check your internet connection.';
      break;
    case 'SERVER_ERROR':
      userMessage = 'Server error. Our team has been notified.';
      break;
    case 'INITIALIZATION_ERROR':
      userMessage = 'Failed to initialize payment. Please refresh and try again.';
      break;
    default:
      userMessage = error.error_description || 'Payment failed. Please try again.';
  }
  
  return {
    userMessage,
    technicalError: error
  };
};

// Create order data format for backend
export const prepareOrderData = (cartItems, shippingAddress, userEmail) => {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 500 ? 0 : 50; // Free delivery above ₹500
  const totalAmount = subtotal + deliveryFee;
  
  return {
    items: cartItems.map(item => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images?.[0]?.url || ''
    })),
    shippingAddress: {
      name: shippingAddress.name,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      phone: shippingAddress.phone
    },
    subtotal,
    deliveryFee,
    totalAmount,
    userEmail,
    paymentMethod: 'razorpay'
  };
};

// Retry payment with exponential backoff
export const retryPayment = async (paymentFunction, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await paymentFunction();
    } catch (error) {
      console.warn(`Payment attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default {
  loadRazorpayScript,
  initiatePayment,
  getPaymentStatus,
  formatAmount,
  validateRazorpayConfig,
  handlePaymentError,
  prepareOrderData,
  retryPayment
};
