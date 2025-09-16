/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const AdminOverview = ({ stats, loading, error }) => {
  // Destructure stats with fallback defaults
  const {
    totalProducts = 0,
    lowStock = 0,
    totalOrders = 0,
    revenue = 0,
    totalUsers = 0,
    pendingOrders = 0,
  } = stats || {}

  const formatCurrency = (amount) => {
    // Assuming amount is in paise, convert to rupees
    return `₹${amount.toLocaleString('en-IN')}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-neutral-500 text-lg">Loading dashboard stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const statsCards = [
    { title: 'Total Products', value: totalProducts, icon: '📦', color: 'bg-blue-500', link: '/admin/products' },
    { title: 'Low Stock Items', value: lowStock, icon: '⚠️', color: 'bg-yellow-500', link: '/admin/stock' },
    { title: 'Total Orders', value: totalOrders, icon: '🛒', color: 'bg-green-500', link: '/admin/orders' },
    { title: 'Revenue', value: formatCurrency(revenue), icon: '💰', color: 'bg-primary-500', link: '/admin/analytics' },
    { title: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-purple-500', link: '/admin/users' },
    { title: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-red-500', link: '/admin/orders' }
  ]

  const quickActions = [
    { title: 'Add New Product', description: 'Add a new product to your inventory', icon: '➕', link: '/admin/products', color: 'bg-primary-50 text-primary-700 border-primary-200' },
    { title: 'Manage Stock', description: 'Update stock levels and inventory', icon: '📋', link: '/admin/stock', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { title: 'Invite Admin', description: 'Invite a new administrator', icon: '👑', link: '/admin/admins', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'View Analytics', description: 'Check sales and performance metrics', icon: '📈', link: '/admin/analytics', color: 'bg-green-50 text-green-700 border-green-200' }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-heading font-bold mb-2">
          Welcome to Admin Dashboard! 👋
        </h2>
        <p className="text-primary-100">
          Manage your Mindy Munchs store efficiently. Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={card.link} className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-neutral-800">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-200`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={action.link} className="block">
                <div className={`p-4 rounded-lg border-2 ${action.color} hover:shadow-sm transition-all duration-200`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                      <p className="text-xs opacity-75">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'New order received', time: '2 minutes ago', icon: '🛒', color: 'text-green-600' },
            { action: 'Product stock low: Sweet Tomato Makhana', time: '1 hour ago', icon: '⚠️', color: 'text-yellow-600' },
            { action: 'New user registered', time: '3 hours ago', icon: '👤', color: 'text-blue-600' },
            { action: 'Product added: New Sattu Variety', time: '1 day ago', icon: '📦', color: 'text-primary-600' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
              <span className="text-lg">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{activity.action}</p>
                <p className="text-xs text-neutral-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdminOverview
