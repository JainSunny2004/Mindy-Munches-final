import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (userData) => {
        set({ 
          user: userData, 
          isAuthenticated: true,
          isLoading: false 
        })
      },
      
      logout: () => {
        // Clear cart when logging out
        try {
          // Import cart store and clear it
          import('./cartStore').then(({ default: useCartStore }) => {
            useCartStore.getState().clearCartOnLogout()
          })
        } catch (error) {
          console.warn('Could not clear cart on logout:', error)
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      },
      
      updateUser: (userData) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },
      
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
      
      isUser: () => {
        const { user } = get()
        return user?.role === 'user'
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      // Check if user has permission for a specific action
      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        
        // Admin has all permissions
        if (user.role === 'admin') return true
        
        // Define user permissions
        const userPermissions = ['view_products', 'manage_cart', 'place_orders']
        return userPermissions.includes(permission)
      }
    }),
    {
      name: 'auth-storage',
      version: 1,
    }
  )
)

export default useAuthStore