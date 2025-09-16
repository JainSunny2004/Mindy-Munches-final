const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    // Total products count
    const totalProducts = await Product.countDocuments();

    // Low stock products count (adjust threshold as needed)
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });

    // Total orders count
    const totalOrders = await Order.countDocuments();

    // Pending orders count (e.g. status pending)

    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });

    // Total revenue (sum of all completed orders' totalPrice)
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }

    ]);
    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Total users count
    const totalUsers = await User.countDocuments();

    res.json({
      totalProducts,
      lowStock,
      totalOrders,
      pendingOrders,
      revenue,
      totalUsers,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { getDashboardStats };