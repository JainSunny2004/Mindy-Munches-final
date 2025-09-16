import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      loading: false,
      error: null,

      // Fetch cart from backend
      fetchCart: async () => {
        try {
          set({ loading: true, error: null })
          
          const token = localStorage.getItem('token')
          if (!token) {
            set({ items: [], loading: false })
            return
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) throw new Error('Failed to fetch cart')
          
          const data = await response.json()
          if (data.success) {
            set({ 
              items: data.data.cart.items || [],
              loading: false
            })
          }
        } catch (error) {
          console.error('Fetch cart error:', error)
          set({ error: error.message, loading: false })
        }
      },

      // Add item to cart via API
      addItem: async (product) => {
        try {
          set({ loading: true, error: null })
          
          const token = localStorage.getItem('token')
          if (!token) throw new Error('Please login to add items to cart')

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
            throw new Error(data.message || 'Failed to add item to cart')
          }

          if (data.success) {
            set({ 
              items: data.data.cart.items,
              loading: false
            })
            
            // Show success notification
            const notification = document.createElement("div")
            notification.className = "fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm"
            notification.textContent = `${product.name} added to cart!`
            document.body.appendChild(notification)
            
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification)
              }
            }, 3000)
          }
        } catch (error) {
          console.error('Add to cart error:', error)
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Remove item via API
      removeItem: async (productId) => {
        try {
          set({ loading: true, error: null })
          
          const token = localStorage.getItem('token')
          if (!token) throw new Error('Please login to remove items')

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to remove item')
          }

          if (data.success) {
            set({ 
              items: data.data.cart.items,
              loading: false
            })
          }
        } catch (error) {
          console.error('Remove item error:', error)
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Update quantity via API
      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return
        
        try {
          set({ loading: true, error: null })
          
          const token = localStorage.getItem('token')
          if (!token) throw new Error('Please login to update cart')

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/update/${productId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
          })

          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to update quantity')
          }

          if (data.success) {
            set({ 
              items: data.data.cart.items,
              loading: false
            })
          }
        } catch (error) {
          console.error('Update quantity error:', error)
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Clear cart via API
      clearCart: async () => {
        try {
          set({ loading: true, error: null })
          
          const token = localStorage.getItem('token')
          if (!token) throw new Error('Please login to clear cart')

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          const data = await response.json()
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to clear cart')
          }

          if (data.success) {
            set({ 
              items: [],
              loading: false
            })
          }
        } catch (error) {
          console.error('Clear cart error:', error)
          set({ error: error.message, loading: false })
          throw error
        }
      },

      // Helper functions
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      // Clear local cart (for logout)
      clearLocalCart: () => {
        set({ items: [], error: null })
      },

      // Check if user has items
      hasItems: () => {
        const { items } = get()
        return items.length > 0
      }

    }),
    {
      name: 'cart-storage',
      version: 1,
    }
  )
)

export default useCartStore
