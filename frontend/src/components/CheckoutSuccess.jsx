import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const CheckoutSuccess = ({ orderId, orderData, total }) => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  const formatPrice = (price) => {
    return `₹ ${(price / 100).toLocaleString('en-IN')}`
  }

  // Auto redirect to home after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleReturnHome = () => {
    navigate('/')
  }

  const handleViewOrders = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-neutral-600 mb-6">
            Your order has been placed successfully and is being processed.
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-neutral-50 rounded-lg p-6 mb-6 text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Order ID</p>
              <p className="font-semibold text-neutral-800">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Amount</p>
              <p className="font-semibold text-primary-600 text-lg">{formatPrice(total)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Delivery Address</p>
              <p className="font-medium text-neutral-800">
                {orderData.address.street}, {orderData.address.city}
                <br />
                {orderData.address.state} - {orderData.address.pincode}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Contact Information</p>
              <p className="font-medium text-neutral-800">
                {orderData.name}
                <br />
                {orderData.phone}
              </p>
            </div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-left mb-8"
        >
          <h3 className="font-semibold text-neutral-800 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              Order confirmation email sent to {orderData.email}
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              Your order will be packed and dispatched within 1-2 business days
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              Track your order status in your dashboard
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              Expected delivery in 3-7 business days
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleReturnHome}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleViewOrders}
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View My Orders
          </button>
        </motion.div>

        {/* Auto Redirect Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6 text-sm text-neutral-500"
        >
          Redirecting to home page in {countdown} seconds...
        </motion.div>

        {/* Customer Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-neutral-200"
        >
          <p className="text-sm text-neutral-600 mb-3">
            Need help with your order?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link 
              to="/contact" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
            </Link>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <a 
              href="mailto:support@mindymunchs.com" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Email: support@mindymunchs.com
            </a>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <a 
              href="tel:+919876543210" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Call: +91 98765 43210
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CheckoutSuccess
