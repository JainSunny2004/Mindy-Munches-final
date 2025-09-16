// Predefined admin accounts - managed by developers only
export const ADMIN_EMAILS = [
  'admin@mindymunchs.com',
  'admin@demo.com',
  'developer@mindymunchs.com',
  'superadmin@mindymunchs.com'
]

// Function to check if an email is an admin
export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

// Function to get user role based on email
export const getUserRole = (email) => {
  return isAdminEmail(email) ? 'admin' : 'user'
}

// For future: Admin creation function (only accessible by existing admins)
export const createAdminAccount = (email, currentUserRole) => {
  if (currentUserRole !== 'admin') {
    throw new Error('Only administrators can create admin accounts')
  }
  
  if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
    ADMIN_EMAILS.push(email.toLowerCase())
  }
  
  return true
}
