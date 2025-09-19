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

export const getAnalytics = async (token) => {
  if (!token) throw new Error('Auth token is required');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/analytics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to fetch analytics';
    throw new Error(errorMessage);
  }

  return response.json();
};

// Get stock statistics from backend
export const getStockStats = async (token) => {
  if (!token) throw new Error('Auth token is required');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stock/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to fetch stock statistics';
    throw new Error(errorMessage);
  }

  return response.json();
};

// Update product stock
export const updateProductStock = async (productId, stock, operation = 'set', token) => {
  if (!token) throw new Error('Auth token is required');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stock/${productId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stock, operation })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to update stock';
    throw new Error(errorMessage);
  }

  return response.json();
};

// Restock low items
export const restockLowItems = async (restockLevel = 10, token) => {
  if (!token) throw new Error('Auth token is required');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stock/restock-low`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ restockLevel })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to restock items';
    throw new Error(errorMessage);
  }

  return response.json();
};