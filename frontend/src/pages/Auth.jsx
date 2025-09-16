/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'
import { getUserRole } from '../utils/adminUsers'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get return URL from location state - DEFAULT TO DASHBOARD
  const from = location.state?.from || '/dashboard'
  const message = location.state?.message
  const productName = location.state?.productName

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  setIsLoading(true)
  const apiUrl = import.meta.env.VITE_API_URL

  try {
    if (isLogin) {
      // Real API login call
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      console.log('Login response:', data) // Debug

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token)
        console.log('Token saved:', localStorage.getItem('token')) // Debug
        
        // Store user data in auth store
        login(data.data.user)
        
        // Navigate to dashboard
        navigate(from, { replace: true })
        
        // Show success notification
        setTimeout(() => {
          const notification = document.createElement('div')
          notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
          notification.textContent = message && productName 
            ? `Welcome back! You can now add ${productName} to your cart.` 
            : 'Welcome back! Check out your dashboard.'
          document.body.appendChild(notification)
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
          }, 4000)
        }, 100)
      } else {
        throw new Error('Invalid response format')
      }
    } else {
      // Real API register call
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      console.log('Register response:', data) // Debug

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      if (data.success && data.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token)
        console.log('Token saved:', localStorage.getItem('token')) // Debug
        
        // Store user data in auth store
        login(data.data.user)
        
        // Navigate to dashboard
        navigate('/dashboard', { replace: true })
        
        // Show welcome message
        setTimeout(() => {
          const notification = document.createElement('div')
          notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
          notification.textContent = `Welcome to Mindy Munchs, ${formData.name}! Explore your dashboard.`
          document.body.appendChild(notification)
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
          }, 4000)
        }, 100)
      } else {
        throw new Error('Invalid response format')
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    setErrors({ general: error.message || 'Authentication failed. Please try again.' })
  } finally {
    setIsLoading(false)
  }
}
// New function to handle forgot password
const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setErrors({});

    try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert("Failed to send password reset email. Please try again.");
    } finally {
        setIsLoading(false);
        setForgotPasswordModalOpen(false);
    }
};

  const switchMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  // Demo account options
  const demoAccounts = [
    { 
      email: 'user@demo.com', 
      password: 'demo123', 
      role: 'user', 
      name: 'Demo User',
      description: 'Regular customer account'
    },
    { 
      email: 'admin@demo.com', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Demo Admin',
      description: 'Administrator account (pre-configured)'
    }
  ]

  const loginWithDemo = async (account) => {
  setIsLoading(true)
  const apiUrl = import.meta.env.VITE_API_URL

  try {
    // Use real demo login API
    const response = await fetch(`${apiUrl}/auth/demo-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: account.role // 'user' or 'admin'
      })
    })

    const data = await response.json()
    console.log('Demo login response:', data) // Debug

    if (!response.ok) {
      throw new Error(data.message || 'Demo login failed')
    }

    if (data.success && data.data.token) {
      // Store token in localStorage
      localStorage.setItem('token', data.data.token)
      console.log('Demo token saved:', localStorage.getItem('token')) // Debug
      
      // Store user data in auth store
      login(data.data.user)
      
      console.log('Demo login redirecting to:', from)
      
      // Navigate to dashboard or previous page
      navigate(from, { replace: true })
      
      // Show success message
      setTimeout(() => {
        const notification = document.createElement('div')
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm'
        notification.textContent = message && productName 
          ? `Welcome back! You can now add ${productName} to your cart.` 
          : `Welcome back, ${data.data.user.name}! Check out your dashboard.`
        document.body.appendChild(notification)
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 4000)
      }, 100)
    } else {
      throw new Error('Invalid demo response format')
    }
  } catch (error) {
    console.error('Demo login error:', error)
    setErrors({ general: error.message || 'Demo login failed. Please try again.' })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-heading text-2xl font-bold text-neutral-800">
                Mindy Munchs
              </span>
            </Link>
            
            <h1 className="text-3xl font-heading font-bold text-neutral-800 mb-2">
              {isLogin ? 'Welcome back!' : 'Join Mindy Munchs'}
            </h1>
            <p className="text-neutral-600">
              {isLogin 
                ? 'Sign in to access your dashboard and continue shopping' 
                : 'Create your account and get your personal dashboard'
              }
            </p>
          </div>

          {/* Message from Product Add to Cart or Cart Access */}
          {message && (
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center gap-2 text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">{message}</p>
                  {productName && (
                    <p className="text-xs mt-1">Product: {productName}</p>
                  )}
                  <p className="text-xs mt-1 text-blue-600">
                    You'll be redirected to: {from === '/dashboard' ? 'Your Dashboard' : from}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Auth Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8"
            layout
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Name Field (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input-field ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : ''}`}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`input-field ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : ''}`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Info message for signup */}
                  {!isLogin && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 text-sm">
                        <span className="font-medium">ℹ️ Note:</span> New accounts get a personal dashboard to track orders and manage profile. 
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn-primary text-lg py-4 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    onClick={() => setForgotPasswordModalOpen(true)}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>

            {/* Switch Mode */}
            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
              <p className="text-neutral-600 mb-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={switchMode}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isLogin ? 'Create new account' : 'Sign in instead'}
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <p className="text-sm text-neutral-600 text-center mb-4">
                Demo accounts for testing:
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => loginWithDemo(account)}
                    disabled={isLoading}
                    className="w-full text-left bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg p-3 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-neutral-800 text-sm">
                          {account.role === 'admin' ? '👑 Admin Demo' : '👤 User Demo'}
                        </div>
                        <div className="text-xs text-neutral-600 mt-1">
                          {account.description}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {account.email}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          → Goes to {from === '/dashboard' ? 'Dashboard' : from}
                        </div>
                      </div>
                      <div className="text-xs text-primary-600 font-medium">
                        Login
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              to="/" 
              className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotPasswordModalOpen && (
          <motion.div
           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setForgotPasswordModalOpen(false)}
          >
            <motion.div
             className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold font-heading mb-4 text-neutral-800">
                Forgot Password?
              </h2>
              <p className="text-neutral-600 mb-6 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                 <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setForgotPasswordModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Auth