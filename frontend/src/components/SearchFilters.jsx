import { useState, useEffect } from 'react'
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'

const SearchFilters = ({ 
  products, 
  onFilteredProducts, 
  searchTerm, 
  setSearchTerm,
  selectedCategory, 
  setSelectedCategory,
  sortBy, 
  setSortBy,
  showFilters, 
  setShowFilters 
}) => {
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const categories = ['All', 'Makhana', 'Sattu']
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest First' }
  ]

  // Calculate price range based on products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      setPriceRange([minPrice, maxPrice])
    }
  }, [products])

  // Apply all filters
  useEffect(() => {
    let filtered = [...products]

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(product => (product.rating || 5) >= selectedRating)
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0)
    }

    // Featured filter
    if (featuredOnly) {
      filtered = filtered.filter(product => product.featured)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 5) - (a.rating || 5)
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        case 'newest':
          return (b.id || 0) - (a.id || 0)
        default:
          return 0
      }
    })

    onFilteredProducts(filtered)
  }, [
    products, 
    searchTerm, 
    selectedCategory, 
    priceRange, 
    selectedRating, 
    inStockOnly, 
    featuredOnly, 
    sortBy, 
    onFilteredProducts
  ])

  const formatPrice = (price) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSortBy('name')
    setPriceRange([0, 50000])
    setSelectedRating(0)
    setInStockOnly(false)
    setFeaturedOnly(false)
  }

  const hasActiveFilters = searchTerm || 
                          selectedCategory !== 'All' || 
                          sortBy !== 'name' || 
                          priceRange[0] !== 0 || 
                          priceRange[1] !== 50000 || 
                          selectedRating > 0 || 
                          inStockOnly || 
                          featuredOnly

  return (
    <div className="bg-white border-b border-neutral-100 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        {/* Filter Toggle Bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-primary-50 border-primary-300 text-primary-700' 
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <span className="font-medium">Advanced Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Sort */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-neutral-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-neutral-100"
            >
              <div className="py-6 space-y-6">
                {/* Search Bar */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Search Products
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="Search by name, category, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none bg-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>-</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange, parseInt(e.target.value)])}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Minimum Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                          className={`text-lg transition-colors ${
                            rating <= selectedRating ? 'text-yellow-400' : 'text-neutral-300 hover:text-yellow-300'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">
                      {selectedRating > 0 ? `${selectedRating}+ stars` : 'All ratings'}
                    </span>
                  </div>

                  {/* Additional Filters */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-neutral-700">
                      Additional Filters
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">In stock only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={featuredOnly}
                          onChange={(e) => setFeaturedOnly(e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">Featured products only</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sort Options (Mobile) */}
                <div className="sm:hidden space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-sm text-neutral-600">Active filters:</span>
                    {searchTerm && (
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Search: "{searchTerm}"
                        <button onClick={() => setSearchTerm('')} className="hover:text-primary-900 ml-1">×</button>
                      </span>
                    )}
                    {selectedCategory !== 'All' && (
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory('All')} className="hover:text-primary-900 ml-1">×</button>
                      </span>
                    )}
                    {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {formatPrice(priceRange)} - {formatPrice(priceRange[1])}
                        <button onClick={() => setPriceRange([0, 50000])} className="hover:text-primary-900 ml-1">×</button>
                      </span>
                    )}
                    {selectedRating > 0 && (
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {selectedRating}+ stars
                        <button onClick={() => setSelectedRating(0)} className="hover:text-primary-900 ml-1">×</button>
                      </span>
                    )}
                    {inStockOnly && (
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        In stock only
                        <button onClick={() => setInStockOnly(false)} className="hover:text-primary-900 ml-1">×</button>
                      </span>
                    )}
                    {featuredOnly && (
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Featured only
                        <button onClick={() => setFeaturedOnly(false)} className="hover:text-primary-900 ml-1">×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SearchFilters
