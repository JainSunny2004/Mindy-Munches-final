import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    category: 'superfoods',
    subcategory: '',
    images: [{ url: '', alt: '', isPrimary: true }],
    stock: '',
    sku: '',
    weight: { value: '', unit: 'g' },
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sugar: ''
    },
    tags: [],
    isActive: true,
    isFeatured: false,
    isOrganic: false,
    isBestseller: false,
    origin: 'India'
  })

  // Category options matching the model enum
  const categoryOptions = [
    { value: 'superfoods', label: 'Superfoods' },
    { value: 'grains', label: 'Grains' },
    { value: 'spices', label: 'Spices' },
    { value: 'oils', label: 'Oils' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'beverages', label: 'Beverages' }
  ]

  const weightUnits = ['g', 'kg', 'ml', 'l']

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${apiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      // Handle different response structures
      let productsArray = []
      if (data.success && data.data && Array.isArray(data.data.products)) {
        productsArray = data.data.products
      } else if (data && Array.isArray(data.products)) {
        productsArray = data.products
      } else if (Array.isArray(data)) {
        productsArray = data
      }

      setProducts(productsArray)
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      // Handle nested object updates (e.g., weight.value, nutritionalInfo.calories)
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleImageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', isPrimary: false }]
    }))
  }

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    setFormData(prev => ({ ...prev, tags }))
  }

  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData(prev => ({ ...prev, sku: `${prefix}${random}` }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const apiUrl = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login to manage products')
      return
    }

    // Prepare product data
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || null,
      stock: parseInt(formData.stock, 10) || 0,
      weight: {
        value: parseFloat(formData.weight.value) || null,
        unit: formData.weight.unit
      },
      nutritionalInfo: Object.keys(formData.nutritionalInfo).reduce((acc, key) => {
        const value = parseFloat(formData.nutritionalInfo[key])
        if (!isNaN(value)) acc[key] = value
        return acc
      }, {}),
      // Ensure at least one image exists and filter out empty URLs
      images: formData.images.filter(img => img.url.trim()).length > 0 
        ? formData.images.filter(img => img.url.trim())
        : [{ url: '/placeholder-image.jpg', alt: formData.name, isPrimary: true }]
    }

    try {
      let response
      if (editingProduct) {
        response = await fetch(`${apiUrl}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        })
      } else {
        response = await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${editingProduct ? 'update' : 'add'} product`)
      }

      const result = await response.json()
      const savedProduct = result.data?.product || result

      setProducts(prev => {
        if (editingProduct) {
          return prev.map(p => p._id === editingProduct._id ? savedProduct : p)
        } else {
          return [...prev, savedProduct]
        }
      })

      resetForm()
      alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`)
    } catch (error) {
      console.error(error)
      alert(error.message || 'Error saving product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category || 'superfoods',
      subcategory: product.subcategory || '',
      images: product.images && product.images.length > 0 
        ? product.images 
        : [{ url: '', alt: '', isPrimary: true }],
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      weight: {
        value: product.weight?.value?.toString() || '',
        unit: product.weight?.unit || 'g'
      },
      nutritionalInfo: {
        calories: product.nutritionalInfo?.calories?.toString() || '',
        protein: product.nutritionalInfo?.protein?.toString() || '',
        carbs: product.nutritionalInfo?.carbs?.toString() || '',
        fat: product.nutritionalInfo?.fat?.toString() || '',
        fiber: product.nutritionalInfo?.fiber?.toString() || '',
        sugar: product.nutritionalInfo?.sugar?.toString() || ''
      },
      tags: product.tags || [],
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured || product.featured || false,
      isOrganic: product.isOrganic || false,
      origin: product.origin || 'India',
      isBestseller: product.isBestseller || false, // <-- Add this line
      origin: product.origin || 'India'
    })
    setShowAddModal(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    const apiUrl = import.meta.env.VITE_API_URL
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login to delete products')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete product')
      }

      setProducts(prev => prev.filter(p => p._id !== productId))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error(error)
      alert(error.message || 'Error deleting product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      category: 'superfoods',
      subcategory: '',
      images: [{ url: '', alt: '', isPrimary: true }],
      stock: '',
      sku: '',
      weight: { value: '', unit: 'g' },
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sugar: ''
      },
      tags: [],
      isActive: true,
      isFeatured: false,
      isOrganic: false,
      origin: 'India'
    })
    setEditingProduct(null)
    setShowAddModal(false)
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
        <p className="text-gray-600">Manage your product inventory</p>
      </div>

      {/* Search and Add Button */}
      <div className="mb-6 flex gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-gray-400">Try adjusting your search or add a new product.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                          src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                          alt={product.images?.[0]?.alt || product.name}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {product.name}
                            {(product.isFeatured || product.featured) && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Featured
                              </span>
                            )}
                            {product.isOrganic && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                🌿 Organic
                              </span>
                            )}
                            {product.isBestseller && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                🔥 Best Seller
                              </span>
                            )}

                          </div>
                          <div className="text-sm text-gray-500">{product.shortDescription || product.description?.substring(0, 50) + '...'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {product.category}
                      {product.subcategory && <div className="text-xs text-gray-500">{product.subcategory}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
                      )}
                      {product.discountPercentage > 0 && (
                        <div className="text-xs text-green-600">{product.discountPercentage}% off</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                      {product.weight?.value && (
                        <div className="text-xs text-gray-500">{product.weight.value}{product.weight.unit}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {!product.isActive ? 'Inactive' : product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.ratings?.average ? (
                        <div>
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{product.ratings.average.toFixed(1)}</span>
                          </div>
                          <div className="text-xs text-gray-500">({product.ratings.count} reviews)</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No ratings</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-orange-600 hover:text-orange-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU * 
                      <button
                        type="button"
                        onClick={generateSKU}
                        className="ml-2 text-xs text-orange-600 hover:text-orange-800"
                      >
                        Generate
                      </button>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                      placeholder="Enter or generate SKU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={2000}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Brief description for product cards"
                  />
                </div>

                {/* Pricing and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight/Volume
                    </label>
                    <input
                      type="number"
                      name="weight.value"
                      value={formData.weight.value}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="weight.unit"
                      value={formData.weight.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {weightUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-3 border rounded-lg">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Alt text"
                        value={image.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={image.isPrimary}
                            onChange={(e) => {
                              // Ensure only one primary image
                              setFormData(prev => ({
                                ...prev,
                                images: prev.images.map((img, i) => ({
                                  ...img,
                                  isPrimary: i === index ? e.target.checked : false
                                }))
                              }))
                            }}
                            className="mr-2"
                          />
                          Primary
                        </label>
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-orange-600 hover:text-orange-800 text-sm"
                  >
                    + Add Another Image
                  </button>
                </div>

                {/* Nutritional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nutritional Information (per 100g)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(formData.nutritionalInfo).map(key => (
                      <div key={key}>
                        <label className="block text-xs text-gray-600 mb-1 capitalize">
                          {key}
                        </label>
                        <input
                          type="number"
                          name={`nutritionalInfo.${key}`}
                          value={formData.nutritionalInfo[key]}
                          onChange={handleInputChange}
                          min="0"
                          step="0.1"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags and Origin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="organic, healthy, protein-rich"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Featured
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isOrganic"
                      checked={formData.isOrganic}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Organic
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBestseller"
                      checked={formData.isBestseller}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Best Seller
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
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

export default ProductManagement
