//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const ProcessStep = ({ step, title, description, icon, index }) => {
  return (
    <motion.div
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {step}
        </div>
        
        {/* Connecting Line (except for last step) */}
        {index < 2 && (
          <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent -translate-y-1/2"></div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default ProcessStep
