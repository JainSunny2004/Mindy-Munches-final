import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import useInviteStore from '../store/inviteStore'
import useAuthStore from '../store/authStore'

const AdminInvite = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { getInviteByToken, acceptInvite } = useInviteStore()
  const { login } = useAuthStore()

  useEffect(() => {
    // Check if invite token is valid
    const foundInvite = getInviteByToken(token)
    setInvite(foundInvite)
    setLoading(false)
  }, [token, getInviteByToken])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Accept the invite
      acceptInvite(token)

      // Create admin user account
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: invite.email,
        role: 'admin',
        createdViaInvite: true,
        invitedBy: invite.invitedBy
      }

      // Auto-login the new admin
      login(userData)
      
      // Redirect to admin dashboard
      navigate('/admin', { 
        state: { 
          welcomeMessage: `Welcome aboard, ${formData.name}! Your admin account has been set up successfully.` 
        }
      })

    } catch {
      setErrors({ general: 'Failed to set up your account. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying invitation...</p>
        </div>
      </div>
    )
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-2">
            Invalid Invitation
          </h1>
          <p className="text-neutral-600 mb-6">
            This invitation link is invalid, expired, or has already been used.
          </p>
          <div className="space-y-3">
            <Link to="/auth" className="btn-primary w-full block text-center">
              Go to Login
            </Link>
            <Link to="/" className="btn-secondary w-full block text-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
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
              Admin Invitation
            </h1>
            <p className="text-neutral-600">
              You've been invited to join as an administrator
            </p>
          </div>

          {/* Invite Info */}
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">👑</span>
              </div>
              <div>
                <p className="font-medium text-blue-800">
                  Admin Invitation for {invite.email}
                </p>
                <p className="text-sm text-blue-600">
                  Invited by: {invite.invitedBy}
                </p>
                <p className="text-xs text-blue-500">
                  Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Setup Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-neutral-800 text-center mb-6">
                Set up your admin account
              </h2>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Name Field */}
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

              {/* Email Field (readonly) */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={invite.email}
                  className="input-field bg-neutral-100 cursor-not-allowed"
                  readOnly
                />
                <p className="text-xs text-neutral-500 mt-1">
                  This email is associated with your invitation
                </p>
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
                  placeholder="Create a secure password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary text-lg py-4 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up account...
                  </div>
                ) : (
                  'Create Admin Account'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-600">
                By creating an account, you'll have full administrative access to manage products, users, and orders.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminInvite
