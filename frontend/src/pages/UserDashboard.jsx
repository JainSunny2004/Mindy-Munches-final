import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import { useOrders } from '../hooks/useOrders'
import OrderCard from '../components/OrderCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { currentOrders, completedOrders, loading, error, refetch } = useOrders()
  const [activeTab, setActiveTab] = useState('current')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', {
        state: {
          from: '/dashboard',
          message: 'Please login to view your dashboard'
        }
      })
    }
  }, [isAuthenticated, navigate])

  // Set default tab based on orders availability
  useEffect(() => {
    if (currentOrders.length === 0 && completedOrders.length > 0) {
      setActiveTab('completed')
    }
  }, [currentOrders.length, completedOrders.length])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader text="Loading your orders..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load orders: {error}</p>
          <button onClick={refetch} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalOrders = currentOrders.length + completedOrders.length
  const displayOrders = activeTab === 'current' ? currentOrders : completedOrders

  const tabConfig = [
    {
      id: 'current',
      label: 'Current Orders',
      count: currentOrders.length,
      orders: currentOrders
    },
    {
      id: 'completed',
      label: 'Order History',
      count: completedOrders.length,
      orders: completedOrders
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage your orders and account settings
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="bg-primary-50 rounded-lg px-4 py-3 text-center">
                <div className="text-2xl font-bold text-primary-600">{totalOrders}</div>
                <div className="text-sm text-neutral-600">Total Orders</div>
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-3 text-center">
                <div className="text-2xl font-bold text-green-600">{completedOrders.length}</div>
                <div className="text-sm text-neutral-600">Completed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {totalOrders === 0 ? (
          // Empty State
          <EmptyState
            icon="📦"
            title="No orders yet"
            description="You haven't placed any orders. Start shopping to see your orders here!"
            action={
              <Link to="/products" className="btn-primary">
                Start Shopping
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-neutral-200 p-1 shadow-sm"
            >
              <nav className="flex space-x-1" role="tablist">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    <span>{tab.label}</span>
                    <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Tab Header with Refresh Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800">
                    {activeTab === 'current' ? 'Current Orders' : 'Order History'}
                  </h2>
                  <p className="text-neutral-600 mt-1">
                    {activeTab === 'current' 
                      ? 'Track your ongoing orders and deliveries'
                      : 'View your completed and cancelled orders'
                    }
                  </p>
                </div>
                
                <button
                  onClick={refetch}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {/* Orders Display */}
              {displayOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                    {activeTab === 'current' ? (
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {activeTab === 'current' ? 'No current orders' : 'No order history'}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {activeTab === 'current' 
                      ? 'You don\'t have any orders in progress right now.'
                      : 'You don\'t have any completed orders yet.'
                    }
                  </p>
                  {activeTab === 'current' && (
                    <Link to="/products" className="btn-primary">
                      Start Shopping
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayOrders.map((order, index) => (
                    <OrderCard key={order._id} order={order} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        {totalOrders > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white rounded-lg border border-neutral-200 p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/products"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div>
                  <p className="font-medium text-neutral-800">Continue Shopping</p>
                  <p className="text-sm text-neutral-600">Browse our products</p>
                </div>
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-neutral-800">Need Help?</p>
                  <p className="text-sm text-neutral-600">Contact support</p>
                </div>
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="font-medium text-neutral-800">Refresh Page</p>
                  <p className="text-sm text-neutral-600">Get latest updates</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
