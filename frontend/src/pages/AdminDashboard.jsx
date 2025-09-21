import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { getDashboardStats } from "../utils/adminApi";
import useAuthStore from "../store/authStore";

// Admin Dashboard Components
import AdminOverview from "../components/admin/AdminOverview";
import ProductManagement from "../components/admin/ProductManagement";
import StockManagement from "../components/admin/StockManagement";
import AdminManagement from "../components/admin/AdminManagement";
import OrderManagement from "../components/admin/OrderManagement";
import Analytics from "../components/admin/Analytics";

const AdminDashboard = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname.split("/admin/")[1] || "overview";
    setActiveTab(path);
  }, [location]);

  // Fetch admin dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (error) {
        setStatsError(error.message || "Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };
    // Only fetch stats if we are on the overview page
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      fetchStats();
    }
  }, [location.pathname]);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊", path: "/admin" },
    { id: "products", label: "Products", icon: "📦", path: "/admin/products" },
    { id: "stock", label: "Stock", icon: "📋", path: "/admin/stock" },
    { id: "orders", label: "Orders", icon: "🛒", path: "/admin/orders" },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📈",
      path: "/admin/analytics",
    },
    { id: "admins", label: "Admins", icon: "👥", path: "/admin/admins" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-neutral-200 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
        >
          {/* Sidebar Header */}
          <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Admin Info */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">{user?.name}</p>
                <p className="text-sm text-neutral-500">{user?.email}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 mt-1">
                  👑 Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-neutral-200">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 rounded-lg transition-colors"
            >
              <span className="text-lg">🏠</span>
              <span className="font-medium">Back to Website</span>
            </Link>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-neutral-600 hover:text-neutral-800"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            <Routes>
              {/* Pass the stats, loading, and error states as props to AdminOverview */}
              <Route
                path="/"
                element={
                  <AdminOverview
                    stats={stats}
                    loading={loadingStats}
                    error={statsError}
                  />
                }
              />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/stock" element={<StockManagement />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admins" element={<AdminManagement />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
