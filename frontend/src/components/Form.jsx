//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error, 
  placeholder,
  required = false,
  options = null,
  helpText = null
}) => {
  const inputClasses = `input-field ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : ''}`

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          required={required}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
        />
      )}
      
      {helpText && !error && (
        <p className="text-xs text-neutral-500">{helpText}</p>
      )}
      
      {error && (
        <motion.p 
          className="text-red-600 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
//eslint-disable-next-line no-unused-vars
const Form = ({ onSubmit, children, className = '', isLoading = false }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
}

Form.Field = FormField

export default Form
