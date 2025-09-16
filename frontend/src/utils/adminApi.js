// Fetch admin dashboard overview stats from backend API
export const getDashboardStats = async (token) => {
  if (!token) throw new Error('Auth token is required')

  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/overview-stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || 'Failed to fetch dashboard stats'
    throw new Error(errorMessage)
  }

  const data = await response.json()
  return data
}
