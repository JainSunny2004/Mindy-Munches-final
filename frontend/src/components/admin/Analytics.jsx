//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const Analytics = () => {
  const stats = {
    totalRevenue: 125000,
    totalOrders: 47,
    averageOrder: 2659,
    conversionRate: 3.2
  }

  const formatPrice = (price) => `₹${(price / 100).toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-neutral-800">Analytics</h2>
        <p className="text-neutral-600">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: '💰', color: 'bg-green-500' },
          { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'bg-blue-500' },
          { label: 'Average Order', value: formatPrice(stats.averageOrder), icon: '📊', color: 'bg-purple-500' },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: '📈', color: 'bg-primary-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Coming Soon</h3>
        <p className="text-neutral-600">
          Advanced analytics including sales charts, customer insights, and performance metrics will be available in the next update.
        </p>
      </div>
    </div>
  )
}

export default Analytics
