import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      loading: false,
      error: null,
      isGuest: false, // Track if user is in guest mode

      // Fetch cart from backend (authenticated users only)
      fetchCart: async () => {
        try {
          set({ loading: true, error: null })

          const token = localStorage.getItem('token')
          if (!token) {
            // For guests, keep existing local cart
            set({ loading: false, isGuest: true })
            return
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            console.warn('Failed to fetch cart from backend, using local cart')
            set({ loading: false, isGuest: true })
            return
          }

          const data = await response.json()
          if (data.success) {
            set({ 
              items: data.data.cart.items || [],
              loading: false,
              isGuest: false
            })
          }
        } catch (error) {
          console.error('Fetch cart error:', error)
          set({ error: error.message, loading: false, isGuest: true })
        }
      },

      // Helper method to add item locally
      addItemLocally: (product) => {
        const { items } = get()
        const existingItem = items.find(item => 
          (item._id || item.id) === (product._id || product.id)
        )

        let newItems
        if (existingItem) {
          newItems = items.map(item =>
            (item._id || item.id) === (product._id || product.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          const cartItem = {
            _id: product._id || product.id,
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images[0]) || '',
            category: product.category,
            quantity: 1
          }
          newItems = [...items, cartItem]
        }

        set({ 
          items: newItems,
          loading: false,
          isGuest: true,
          error: null
        })

        // Show success notification
        get().showSuccessNotification(product.name)
      },

      // Show success notification
      showSuccessNotification: (productName) => {
        const notification = document.createElement("div")
        notification.className = "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm"
        notification.textContent = `${productName} added to cart!`
        document.body.appendChild(notification)

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 3000)
      },

      // Add item to cart (supports both guest and authenticated users)
      addItem: async (product) => {
        try {
          set({ loading: true, error: null })

          const token = localStorage.getItem('token')

          // For guest users - store locally
          if (!token) {
            get().addItemLocally(product)
            return
          }

          // For authenticated users - try backend first
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                productId: product._id || product.id,
                quantity: 1
              })
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.message || 'Backend cart failed')
            }

            if (data.success) {
              set({ 
                items: data.data.cart.items,
                loading: false,
                isGuest: false
              })

              get().showSuccessNotification(product.name)
              return
            }
          } catch (apiError) {
            console.warn('Backend cart failed, using local cart:', apiError.message)
            // Fall back to local storage
            get().addItemLocally(product)
            return
          }

        } catch (error) {
          console.error('Add to cart error:', error)
          // Fallback to local storage if everything fails
          get().addItemLocally(product)
        }
      },

      // Remove item (supports both guest and authenticated users)
      removeItem: async (productId) => {
        try {
          set({ loading: true, error: null })

          const token = localStorage.getItem('token')
          const { isGuest } = get()

          // For guest users or when API is unavailable - remove locally
          if (!token || isGuest) {
            const { items } = get()
            const newItems = items.filter(item => 
              (item._id || item.id) !== productId
            )
            set({ 
              items: newItems,
              loading: false
            })
            return
          }

          // For authenticated users - try backend first
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/remove/${productId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (!response.ok) {
              throw new Error('Backend remove failed')
            }

            const data = await response.json()

            if (data.success) {
              set({ 
                items: data.data.cart.items,
                loading: false
              })
              return
            }
          } catch (apiError) {
            console.warn('Backend remove failed, using local removal:', apiError.message)
          }

          // Fallback to local removal
          const { items } = get()
          const newItems = items.filter(item => 
            (item._id || item.id) !== productId
          )
          set({ 
            items: newItems,
            loading: false,
            isGuest: true
          })

        } catch (error) {
          console.error('Remove item error:', error)
          // Final fallback to local removal
          const { items } = get()
          const newItems = items.filter(item => 
            (item._id || item.id) !== productId
          )
          set({ 
            items: newItems,
            loading: false,
            isGuest: true,
            error: null
          })
        }
      },

      // Update quantity (supports both guest and authenticated users)
      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return

        try {
          set({ loading: true, error: null })

          const token = localStorage.getItem('token')
          const { isGuest } = get()

          // For guest users or when API is unavailable - update locally
          if (!token || isGuest) {
            const { items } = get()
            const newItems = items.map(item =>
              (item._id || item.id) === productId
                ? { ...item, quantity }
                : item
            )
            set({ 
              items: newItems,
              loading: false
            })
            return
          }

          // For authenticated users - try backend first
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/update/${productId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ quantity })
            })

            if (!response.ok) {
              throw new Error('Backend update failed')
            }

            const data = await response.json()

            if (data.success) {
              set({ 
                items: data.data.cart.items,
                loading: false
              })
              return
            }
          } catch (apiError) {
            console.warn('Backend update failed, using local update:', apiError.message)
          }

          // Fallback to local update
          const { items } = get()
          const newItems = items.map(item =>
            (item._id || item.id) === productId
              ? { ...item, quantity }
              : item
          )
          set({ 
            items: newItems,
            loading: false,
            isGuest: true
          })

        } catch (error) {
          console.error('Update quantity error:', error)
          // Final fallback to local update
          const { items } = get()
          const newItems = items.map(item =>
            (item._id || item.id) === productId
              ? { ...item, quantity }
              : item
          )
          set({ 
            items: newItems,
            loading: false,
            isGuest: true,
            error: null
          })
        }
      },

      // Clear cart (supports both guest and authenticated users)
      clearCart: async () => {
        try {
          set({ loading: true, error: null })

          const token = localStorage.getItem('token')
          const { isGuest } = get()

          // For guest users or when API is unavailable - clear locally
          if (!token || isGuest) {
            set({ 
              items: [],
              loading: false
            })
            return
          }

          // For authenticated users - try backend first
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/clear`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (!response.ok) {
              throw new Error('Backend clear failed')
            }

            const data = await response.json()

            if (data.success) {
              set({ 
                items: [],
                loading: false
              })
              return
            }
          } catch (apiError) {
            console.warn('Backend clear failed, using local clear:', apiError.message)
          }

          // Fallback to local clear
          set({ 
            items: [],
            loading: false,
            isGuest: true
          })

        } catch (error) {
          console.error('Clear cart error:', error)
          // Final fallback to local clear
          set({ 
            items: [],
            loading: false,
            isGuest: true,
            error: null
          })
        }
      },

      // Sync local cart to backend when user logs in
      syncCartToBackend: async () => {
        const token = localStorage.getItem('token')
        const { items, isGuest } = get()

        if (!token || !isGuest || !items.length) {
          return
        }

        try {
          set({ loading: true })

          // Add each local item to backend cart
          for (const item of items) {
            try {
              await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  productId: item._id || item.id,
                  quantity: item.quantity
                })
              })
            } catch (itemError) {
              console.warn(`Failed to sync item ${item.name}:`, itemError)
            }
          }

          // Fetch updated cart from backend
          await get().fetchCart()
        } catch (error) {
          console.error('Cart sync error:', error)
          set({ loading: false })
        }
      },

      // Helper functions
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
          return total + (price * item.quantity)
        }, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      // Clear local cart (for logout)
      clearLocalCart: () => {
        set({ items: [], error: null, isGuest: false })
      },

      // Check if user has items
      hasItems: () => {
        const { items } = get()
        return items.length > 0
      },

      // Get guest status
      isGuestMode: () => {
        const { isGuest } = get()
        return isGuest
      },

      // Force local mode (useful for development/testing)
      forceLocalMode: () => {
        set({ isGuest: true })
      }

    }),
    {
      name: 'cart-storage',
      version: 2, // Increment version to handle schema changes
    }
  )
)

export default useCartStore