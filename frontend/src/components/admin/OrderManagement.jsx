import { useState, useEffect } from 'react'
//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock orders data
    setOrders([
      {
        id: 1001,
        customerName: 'John Doe',
        email: 'john@example.com',
        items: [
          { name: 'Sweet Tomato Makhana', quantity: 2, price: 21700 },
          { name: 'Peri Peri Makhana', quantity: 1, price: 48900 }
        ],
        total: 92300,
        status: 'pending',
        orderDate: '2024-01-15T10:30:00Z',
        shippingAddress: '123 Main St, Mumbai, MH 400001'
      },
      {
        id: 1002,
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        items: [
          { name: 'Sattu Original', quantity: 3, price: 79900 }
        ],
        total: 239700,
        status: 'completed',
        orderDate: '2024-01-14T14:20:00Z',
        shippingAddress: '456 Oak Ave, Delhi, DL 110001'
      }
    ])
    setLoading(false)
  }, [])

  const formatPrice = (price) => `₹${(price / 100).toLocaleString('en-IN')}`
  
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-neutral-800">Order Management</h2>
        <p className="text-neutral-600">Track and manage customer orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="border border-neutral-200 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-neutral-800">Order #{order.id}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-neutral-600 space-y-1">
                      <p><strong>Customer:</strong> {order.customerName} ({order.email})</p>
                      <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                      <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-neutral-700 mb-1">Items:</p>
                      <div className="text-xs text-neutral-600">
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.name} (x{item.quantity})
                            {idx < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-sm border border-neutral-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderManagement
