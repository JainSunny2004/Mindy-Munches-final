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

export const searchUsers = async (searchTerm, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/search?q=${searchTerm}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const getAllAdmins = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/admins`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const promoteUser = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/promote`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const demoteAdmin = async (userId, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/demote`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

