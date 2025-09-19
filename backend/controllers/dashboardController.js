const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    // Total products count
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Low stock products count (adjust threshold as needed)
    const lowStock = await Product.countDocuments({
      stock: { $lte: 5 },
      isActive: true,
    });

    // Total orders count
    const totalOrders = await Order.countDocuments();

    // Pending orders count
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ["pending", "confirmed"] },
    });

    // ✅ FIXED: Total revenue calculation with proper order statuses
    const revenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ["delivered", "shipped", "processing"] },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          completedOrders: { $sum: 1 },
        },
      },
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const completedOrders =
      revenueData.length > 0 ? revenueData[0].completedOrders : 0;

    // Total users count (exclude admins)
    const totalUsers = await User.countDocuments({
      role: "user",
      isActive: true,
    });

    // ✅ FIXED: Proper response format
    res.json({
      success: true,
      data: {
        totalProducts,
        lowStock,
        totalOrders,
        pendingOrders,
        revenue,
        completedOrders,
        totalUsers,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// ✅ Complete getAnalytics function with Customer Satisfaction Rate
const getAnalytics = async (req, res) => {
  try {
    // Analytics aggregation pipeline
    const analyticsData = await Order.aggregate([
      {
        $facet: {
          // Revenue from completed orders
          revenue: [
            { 
              $match: { 
                orderStatus: { $in: ['delivered', 'shipped', 'processing'] },
                paymentStatus: 'paid' 
              } 
            },
            { 
              $group: { 
                _id: null, 
                totalRevenue: { $sum: '$totalAmount' },
                completedOrders: { $sum: 1 }
              } 
            }
          ],
          // All orders count
          totalOrders: [
            { $count: "total" }
          ],
          // Average order value
          averageOrder: [
            { 
              $match: { 
                orderStatus: { $in: ['delivered', 'shipped', 'processing'] },
                paymentStatus: 'paid' 
              } 
            },
            { 
              $group: { 
                _id: null, 
                averageOrderValue: { $avg: '$totalAmount' }
              } 
            }
          ]
        }
      }
    ]);

    // Extract results
    const results = analyticsData[0];
    const totalRevenue = results.revenue[0]?.totalRevenue || 0;
    const totalOrders = results.totalOrders[0]?.total || 0;
    const averageOrderValue = results.averageOrder[0]?.averageOrderValue || 0;
    
    // ✅ NEW: Calculate Customer Satisfaction Rate
    const totalUsers = await User.countDocuments({ role: 'user', isActive: true });

    // Count unique users who have placed orders
    const customersWithOrders = await Order.aggregate([
      {
        $match: { user: { $ne: null } } // Only orders with registered users
      },
      {
        $group: {
          _id: '$user' // Group by unique user
        }
      },
      {
        $count: 'uniqueCustomers'
      }
    ]);

    const uniqueCustomers = customersWithOrders[0]?.uniqueCustomers || 0;
    const customerSatisfactionRate = totalUsers > 0 ? (uniqueCustomers / totalUsers) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        customerSatisfactionRate, // ✅ NEW: Replaces conversionRate
        period: 'all-time',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};


module.exports = { getDashboardStats, getAnalytics };
