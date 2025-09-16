/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const StockManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updateMode, setUpdateMode] = useState({})

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(data.data.products || [])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const updateStock = (productId, newStock) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, stock: newStock } : product
      )
    )
    setUpdateMode(prev => ({ ...prev, [productId]: false }))
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '❌' }
    if (stock <= 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' }
    if (stock <= 20) return { label: 'Medium Stock', color: 'bg-blue-100 text-blue-800', icon: '📦' }
    return { label: 'High Stock', color: 'bg-green-100 text-green-800', icon: '✅' }
  }

  const bulkUpdateStock = (action) => {
    const updates = {}
    
    if (action === 'restock-low') {
      products.forEach(product => {
        if (product.stock <= 5) {
          updates[product.id] = 50 // Restock to 50
        }
      })
    }
    
    if (Object.keys(updates).length > 0) {
      setProducts(prev =>
        prev.map(product =>
          updates[product.id] ? { ...product, stock: updates[product.id] } : product
        )
      )
      
      alert(`Updated stock for ${Object.keys(updates).length} products`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  const lowStockItems = products.filter(p => p.stock <= 5)
  const outOfStockItems = products.filter(p => p.stock === 0)

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800">Stock Management</h2>
          <p className="text-neutral-600">Monitor and update inventory levels</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => bulkUpdateStock('restock-low')}
            className="btn-primary text-sm"
            disabled={lowStockItems.length === 0}
          >
            🔄 Restock Low Items ({lowStockItems.length})
          </button>
        </div>
      </div>

      {/* Stock Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockItems.length > 0 && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold text-red-800 mb-2">
                ❌ Out of Stock ({outOfStockItems.length})
              </h3>
              <div className="space-y-1">
                {outOfStockItems.slice(0, 3).map(product => (
                  <p key={product.id} className="text-sm text-red-700">
                    • {product.name}
                  </p>
                ))}
                {outOfStockItems.length > 3 && (
                  <p className="text-sm text-red-600">
                    ... and {outOfStockItems.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {lowStockItems.length > 0 && (
            <motion.div
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Low Stock Alert ({lowStockItems.length})
              </h3>
              <div className="space-y-1">
                {lowStockItems.slice(0, 3).map(product => (
                  <p key={product.id} className="text-sm text-yellow-700">
                    • {product.name} ({product.stock} left)
                  </p>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-sm text-yellow-600">
                    ... and {lowStockItems.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left p-4 font-semibold text-neutral-800">Product</th>
                <th className="text-left p-4 font-semibold text-neutral-800">Category</th>
                <th className="text-left p-4 font-semibold text-neutral-800">Current Stock</th>
                <th className="text-left p-4 font-semibold text-neutral-800">Status</th>
                <th className="text-left p-4 font-semibold text-neutral-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product, index) => {
                const status = getStockStatus(product.stock)
                const isUpdating = updateMode[product.id]
                
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-neutral-25 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                        />
                        <div>
                          <p className="font-semibold text-neutral-800">{product.name}</p>
                          <p className="text-sm text-neutral-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                        {product.category}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      {isUpdating ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            defaultValue={product.stock}
                            className="w-20 px-2 py-1 border border-neutral-300 rounded text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateStock(product.id, parseInt(e.target.value))
                              } else if (e.key === 'Escape') {
                                setUpdateMode(prev => ({ ...prev, [product.id]: false }))
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.parentNode.querySelector('input')
                              updateStock(product.id, parseInt(input.value))
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-semibold ${
                            product.stock === 0 ? 'text-red-600' : 
                            product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {product.stock}
                          </span>
                          <span className="text-sm text-neutral-500">units</span>
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        <span className="mr-1">{status.icon}</span>
                        {status.label}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {!isUpdating ? (
                          <>
                            <button
                              onClick={() => setUpdateMode(prev => ({ ...prev, [product.id]: true }))}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Update Stock"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            {product.stock <= 5 && (
                              <button
                                onClick={() => updateStock(product.id, 50)}
                                className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-colors"
                              >
                                Quick Restock
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => setUpdateMode(prev => ({ ...prev, [product.id]: false }))}
                            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, color: 'bg-blue-500' },
          { label: 'Out of Stock', value: outOfStockItems.length, color: 'bg-red-500' },
          { label: 'Low Stock', value: lowStockItems.length, color: 'bg-yellow-500' },
          { label: 'Well Stocked', value: products.filter(p => p.stock > 20).length, color: 'bg-green-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-lg p-4 shadow-sm border border-neutral-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-lg">📊</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default StockManagement