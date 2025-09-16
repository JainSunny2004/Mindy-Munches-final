//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const EmptyState = ({ 
  icon = "📦", 
  title = "Nothing here yet", 
  description = "Items will appear here when available.",
  action = null 
}) => {
  return (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
