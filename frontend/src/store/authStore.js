import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (userData) => {
        const user = userData.user || userData;
        const token = userData.token || null;
        set({
          user: user,
          token: token,
          isAuthenticated: true,
          isLoading: false,
        });
        if (token) {
          localStorage.setItem("token", token);
        }
      },

      logout: () => {
        // Clear cart when logging out
        try {
          // Import cart store and clear it
          import("./cartStore").then(({ default: useCartStore }) => {
            useCartStore.getState().clearCartOnLogout();
          });
        } catch (error) {
          console.warn("Could not clear cart on logout:", error);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },

      isUser: () => {
        const { user } = get();
        return user?.role === "user";
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // ✅ ADD THIS NEW FUNCTION RIGHT HERE:
      initializeAuth: () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && get().user) {
          set({ token: storedToken });
        }
      },

      // Check if user has permission for a specific action
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;

        // Admin has all permissions
        if (user.role === "admin") return true;

        // Define user permissions
        const userPermissions = [
          "view_products",
          "manage_cart",
          "place_orders",
        ];
        return userPermissions.includes(permission);
      },
    }),
    {
      name: "auth-storage",
      version: 1,
    }
  )
);

export default useAuthStore;
