import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const AdminManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, user } = useAuthStore();

  // Protected admin emails (cannot be demoted)
  const protectedEmails = [
    'mindymunchs@gmail.com',
    'sunnyjain1401@gmail.com', // Your developer email
    user?.email // Current user's email
  ];

  // Fetch all current admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/admins`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data.data || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  // Search users by email/name
  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError('');
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/search?q=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Promote user to admin
  const promoteUser = async (userId, userName, userEmail) => {
    if (!window.confirm(`Are you sure you want to make ${userName} (${userEmail}) an admin?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/promote`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to promote user');
      }

      // Success - refresh both lists
      alert(`${userName} has been promoted to admin successfully!`);
      await fetchAdmins();
      
      // Remove from search results
      setSearchResults(prev => prev.filter(user => user._id !== userId));
      
    } catch (error) {
      console.error('Failed to promote user:', error);
      setError(error.message || 'Failed to promote user');
    } finally {
      setLoading(false);
    }
  };

  // Demote admin to user
  const demoteAdmin = async (adminId, adminName, adminEmail) => {
    if (protectedEmails.includes(adminEmail)) {
      alert(`${adminName} is protected and cannot be demoted.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${adminName} (${adminEmail}) as admin?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/${adminId}/demote`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to demote admin');
      }

      // Success - refresh admin list
      alert(`${adminName} has been demoted to user successfully!`);
      await fetchAdmins();
      
    } catch (error) {
      console.error('Failed to demote admin:', error);
      setError(error.message || 'Failed to demote admin');
    } finally {
      setLoading(false);
    }
  };

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Search users when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600 mt-1">Manage user roles and administrator permissions</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* User Search Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Promote User to Admin</h3>
        
        {/* Search Input */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={searchUsers}
            disabled={searchLoading || !searchTerm.trim()}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {searchLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          {searchResults.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              Found {searchResults.length} user(s)
            </p>
          )}
          
          <AnimatePresence>
            {searchResults.map((searchUser) => (
              <motion.div
                key={searchUser._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {searchUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{searchUser.name}</p>
                    <p className="text-sm text-gray-600">{searchUser.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(searchUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => promoteUser(searchUser._id, searchUser.name, searchUser.email)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : '👑 Make Admin'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {searchTerm && !searchLoading && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No users found matching "{searchTerm}"</p>
              <p className="text-sm mt-1">Try searching by email or name</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Admins Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Current Administrators</h3>
        
        {loading && admins.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-2">Loading administrators...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Total administrators: {admins.length}
            </p>
            
            {admins.map((admin) => {
              const isProtected = protectedEmails.includes(admin.email);
              const isCurrentUser = admin.email === user?.email;
              
              return (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">
                        {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{admin.name}</p>
                        {isCurrentUser && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                        {isProtected && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            🛡️ Protected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <p className="text-xs text-gray-500">
                        Admin since: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                      {admin.lastLogin && (
                        <p className="text-xs text-gray-500">
                          Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ✅ Active Admin
                    </span>
                    
                    {!isProtected && (
                      <button
                        onClick={() => demoteAdmin(admin._id, admin.name, admin.email)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {loading ? 'Processing...' : '❌ Remove Admin'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {admins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No administrators found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="flex items-center text-blue-800 font-semibold mb-2">
          <span className="mr-2">ℹ️</span>
          Security Information
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Protected admins cannot be demoted for security reasons</li>
          <li>• Only existing administrators can promote users</li>
          <li>• All role changes are logged and tracked</li>
          <li>• Users must have existing accounts to be promoted</li>
          <li>• Demoted admins will lose all admin privileges immediately</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminManagement;
