import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Loader from './Loader'
//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, user, isLoading, hasPermission } = useAuthStore()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader text="Checking authentication..." />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole) {
    if (!user || user.role !== requiredRole) {
      // Show unauthorized message for wrong role
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-2">
              Access Denied
            </h1>
            <p className="text-neutral-600 mb-6">
              You don't have permission to access this page. 
              {requiredRole === 'admin' && (
                <span className="block mt-2">
                  Only administrators can access the admin dashboard.
                </span>
              )}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.history.back()}
                className="btn-secondary w-full"
              >
                Go Back
              </button>
              <Navigate to="/" replace />
            </div>
          </motion.div>
        </div>
      )
    }
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
