//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
    >
      {/* Stars */}
      <div className="flex text-yellow-400 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="text-lg">⭐</span>
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-neutral-700 mb-6 leading-relaxed italic">
        "{testimonial.quote}"
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-4">
          <span className="text-primary-600 font-semibold text-lg">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-neutral-800">{testimonial.name}</h4>
          <p className="text-sm text-neutral-500">{testimonial.location}</p>
          {testimonial.verified && (
            <div className="flex items-center mt-1">
              <span className="text-green-500 text-xs mr-1">✓</span>
              <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard