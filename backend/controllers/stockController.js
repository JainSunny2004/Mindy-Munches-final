const Product = require("../models/Product");

// Get comprehensive stock statistics and analysis
const getStockStats = async (req, res) => {
  try {
    console.log("📊 Fetching stock statistics...");

    // 🔍 Comprehensive stock analysis using aggregation pipeline
    const stockStats = await Product.aggregate([
      {
        $facet: {
          // Total products count
          totalProducts: [{ $match: { isActive: true } }, { $count: "count" }],

          // Out of stock products (stock = 0)
          outOfStock: [
            {
              $match: {
                isActive: true,
                $or: [{ stock: { $eq: 0 } }, { stock: { $exists: false } }],
              },
            },
            { $count: "count" },
          ],

          // Low stock products (1-99 units)
          lowStock: [
            {
              $match: {
                isActive: true,
                stock: { $gte: 1, $lt: 100 },
              },
            },
            { $count: "count" },
          ],

          // Well stocked products (100+ units)
          wellStocked: [
            {
              $match: {
                isActive: true,
                stock: { $gte: 100 },
              },
            },
            { $count: "count" },
          ],

          // Well stocked products data (100+ units)
          wellStockedProducts: [
            {
              $match: {
                isActive: true,
                stock: { $gte: 100 },
              },
            },
            {
              $project: {
                name: 1,
                stock: 1,
                price: 1,
                category: 1,
                images: 1,
                createdAt: 1,
              },
            },
            { $sort: { stock: -1 } }, // Sort by highest stock first
            { $limit: 20 },
          ],

          // Low stock products data (1-99 units)
          lowStockProducts: [
            {
              $match: {
                isActive: true,
                stock: { $gte: 1, $lt: 100 },
              },
            },
            {
              $project: {
                name: 1,
                stock: 1,
                price: 1,
                category: 1,
                images: 1,
                createdAt: 1,
              },
            },
            { $sort: { stock: 1 } }, // Sort by lowest stock first
            { $limit: 20 },
          ],

          // Get out of stock products
          outOfStockProducts: [
            {
              $match: {
                isActive: true,
                $or: [{ stock: { $eq: 0 } }, { stock: { $exists: false } }],
              },
            },
            {
              $project: {
                name: 1,
                stock: 1,
                price: 1,
                category: 1,
                images: 1,
                createdAt: 1,
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
          ],
        },
      },
    ]);

    // Extract results
    const results = stockStats[0];

    const stats = {
      totalProducts: results.totalProducts[0]?.count || 0,
      outOfStock: results.outOfStock[0]?.count || 0,
      lowStock: results.lowStock[0]?.count || 0,
      wellStocked: results.wellStocked[0]?.count || 0,
      lowStockProducts: results.lowStockProducts || [],
      outOfStockProducts: results.outOfStockProducts || [],
      wellStockedProducts: results.wellStockedProducts || [],
      lastUpdated: new Date().toISOString(),
    };

    console.log(" Stock statistics calculated:", {
      totalProducts: stats.totalProducts,
      outOfStock: stats.outOfStock,
      lowStock: stats.lowStock,
      wellStocked: stats.wellStocked,
    });

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(" Error calculating stock stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock statistics",
      error: error.message,
    });
  }
};

// Update product stock level
const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock, operation = "set" } = req.body; // operation: 'set', 'add', 'subtract'

    console.log(
      ` Updating stock for product ${productId}: ${operation} ${stock}`
    );

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Add input validation
    const stockValue = parseInt(stock);
    if (isNaN(stockValue) || stockValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock value must be a non-negative number",
      });
    }

    let newStock;
    switch (operation) {
      case "add":
        newStock = (product.stock || 0) + stockValue;
        break;
      case "subtract":
        newStock = Math.max(0, (product.stock || 0) - stockValue);
        break;
      case "set":
      default:
        newStock = stockValue;
        break;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { stock: newStock },
      { new: true }
    ).select("name stock price category");

    console.log(
      ` Stock updated: ${product.name} - ${product.stock || 0} → ${newStock}`
    );

    res.json({
      success: true,
      data: updatedProduct,
      message: `Stock updated successfully`,
    });
  } catch (error) {
    console.error(" Error updating stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update stock",
      error: error.message,
    });
  }
};

// Bulk restock low items
const restockLowItems = async (req, res) => {
  try {
    const { restockLevel = 100 } = req.body; // Default restock to 100 items

    // Add input validation
    const restockValue = parseInt(restockLevel);
    if (isNaN(restockValue) || restockValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Restock level must be a positive number",
      });
    }

    console.log(` Restocking low items to level: ${restockValue}`);

    // Update all low stock items (1-99 units)
    const result = await Product.updateMany(
      {
        isActive: true,
        stock: { $gte: 1, $lt: 100 },
      },
      {
        $set: { stock: restockValue },
      }
    );

    console.log(` Restocked ${result.modifiedCount} products`);

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        restockLevel: restockValue,
      },
      message: `Successfully restocked ${result.modifiedCount} low stock items to ${restockValue} units each`,
    });
  } catch (error) {
    console.error(" Error restocking items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restock items",
      error: error.message,
    });
  }
};

module.exports = {
  getStockStats,
  updateStock,
  restockLowItems,
};
