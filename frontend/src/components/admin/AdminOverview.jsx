import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AdminOverview = ({ stats, loading, error }) => {
  // ✅ Extract data from nested structure
  const statsData = stats?.data || {};
  
  const {
    totalProducts = 0,
    lowStock = 0,
    totalOrders = 0,
    revenue = 0,
    totalUsers = 0,
    pendingOrders = 0,
    completedOrders = 0
  } = statsData;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm mt-1">Error: {error}</p>
      </div>
    );
  }

  // Dashboard cards remain the same
  const dashboardCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: '📦',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/admin/products'
    },
    {
      title: 'Low Stock Items',
      value: lowStock,
      icon: '⚠️',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      link: '/admin/stock'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: '🛍️',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/admin/orders'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(revenue),
      subtitle: `From ${completedOrders} completed orders`,
      icon: '💰',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      link: '/admin/analytics'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: '👥',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/admin/users'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: '⏳',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/admin/orders'
    }
  ];

  // ✅ UPDATED: Quick Actions with requested changes
  const quickActions = [
    {
      title: 'Product Management', // ✅ CHANGED: "Add New Product" → "Product Management"
      description: 'Manage products, add new items, and update inventory',
      icon: '📦',
      link: '/admin/products',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Order Management', // ✅ CHANGED: "Manage Stock" → "Order Management"
      description: 'View orders, update status, and track shipments',
      icon: '🛍️',
      link: '/admin/orders',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Admin Management', // ✅ NEW: Added "Admin Management" (instead of "Invite Admin")
      description: 'Manage administrators and user roles',
      icon: '👑',
      link: '/admin/admins',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          Welcome to Admin Dashboard! 👋
        </h1>
        <p className="text-gray-300">
          Manage your Mindy Munchs store efficiently. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <Link to={card.link} className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className={`text-xl ${card.iconColor}`}>{card.icon}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ✅ UPDATED: Quick Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* ✅ CHANGED: grid-cols-2 → grid-cols-3 */}
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`${action.bgColor} rounded-lg p-4 transition-colors border border-gray-200`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      {statsData.lastUpdated && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {new Date(statsData.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
