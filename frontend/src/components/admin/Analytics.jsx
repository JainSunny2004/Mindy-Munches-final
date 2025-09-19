import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/analytics`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data.data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;
  const formatPercentage = (rate) => `${rate.toFixed(1)}%`;

  // ✅ DYNAMIC STATS using real data
  const stats = [
    {
      label: "Total Revenue",
      value: analyticsData ? formatPrice(analyticsData.totalRevenue) : "₹0",
      bgColor: "bg-green-100",
      icon: "💰",
    },
    {
      label: "Total Orders",
      value: analyticsData?.totalOrders || 0,
      bgColor: "bg-blue-100",
      icon: "🛍️",
    },
    {
      label: "Average Order",
      value: analyticsData
        ? formatPrice(analyticsData.averageOrderValue)
        : "₹0",
      bgColor: "bg-purple-100",
      icon: "📊",
    },
    {
      label: "Customer Satisfaction Rate", // ✅ CHANGED: was 'Conversion Rate'
      value: analyticsData
        ? formatPercentage(analyticsData.customerSatisfactionRate)
        : "0%", // ✅ CHANGED
      subtitle: "Users who became customers", // ✅ NEW: Added helpful subtitle
      bgColor: "bg-orange-100", // ✅ CHANGED: Orange for satisfaction
      icon: "😊", // ✅ CHANGED: Smile icon for satisfaction
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error loading analytics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600 mt-1">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Coming Soon
        </h3>
        <p className="text-blue-700">
          Advanced analytics including sales charts, customer insights, and
          performance metrics will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
