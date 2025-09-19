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

  // 🛡️ SUPER ADMIN PROTECTION SYSTEM
  const SUPER_ADMIN_EMAILS = [
    'mindymunchs@gmail.com',
    'sunnyjainpvt1401@gmail.com'
  ];

  // Protected admin emails (cannot be demoted)
  const protectedEmails = [
    ...SUPER_ADMIN_EMAILS,
    user?.email // Current user's email
  ];

  // 🛡️ Helper functions
  const isSuperAdmin = (email) => SUPER_ADMIN_EMAILS.includes(email);
  const isProtectedAdmin = (email) => protectedEmails.includes(email);

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
      alert(`✅ ${userName} has been promoted to admin successfully!`);
      await fetchAdmins();
      
      // Remove from search results
      setSearchResults(prev => prev.filter(user => user._id !== userId));
      
    } catch (error) {
      console.error('Failed to promote user:', error);
      setError(error.message || 'Failed to promote user');
      alert(`❌ Failed to promote user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ Enhanced demote admin with super admin protection
  const demoteAdmin = async (adminId, adminName, adminEmail) => {
    
    // 🛡️ SUPER ADMIN PROTECTION CHECK
    if (isSuperAdmin(adminEmail)) {
      alert(`🛡️ ${adminName} is a Super Administrator and cannot be demoted.\n\n⚠️ Super Admins are permanently protected:\n• mindymunchs@gmail.com\n• sunnyjainpvt1401@gmail.com\n\nThis action has been logged for security purposes.`);
      return;
    }

    // 🔒 REGULAR PROTECTION CHECK
    if (isProtectedAdmin(adminEmail)) {
      alert(`🔒 ${adminName} is protected and cannot be demoted.`);
      return;
    }

    // 🚨 Double confirmation for admin demotion
    const confirmMessage = `⚠️ ADMIN DEMOTION WARNING\n\nYou are about to remove ${adminName} (${adminEmail}) as administrator.\n\nThis will:\n• Revoke all admin privileges\n• Remove access to admin dashboard\n• Convert account to regular user\n\nThis action cannot be undone easily.\n\nProceed with demotion?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Final confirmation
    if (!window.confirm(`🔴 FINAL CONFIRMATION\n\nDemote ${adminName} to regular user?`)) {
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
      alert(`✅ ${adminName} has been demoted to user successfully!`);
      await fetchAdmins();
      
    } catch (error) {
      console.error('Failed to demote admin:', error);
      setError(error.message || 'Failed to demote admin');
      
      // Enhanced error handling
      if (error.message.includes('super administrator') || error.message.includes('protected')) {
        alert('🛡️ This admin is protected and cannot be demoted.');
      } else {
        alert(`❌ Failed to demote admin: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Search users when search term changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage user roles and administrator permissions</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">⚠️ Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* User Search Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">🔍 Promote User to Admin</h3>
        
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
          <button
            onClick={searchUsers}
            disabled={searchLoading || !searchTerm.trim()}
            className="w-full sm:w-auto px-4 md:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-3 sm:space-y-0"
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-xs md:text-sm">
                      {searchUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{searchUser.name}</p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">{searchUser.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(searchUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => promoteUser(searchUser._id, searchUser.name, searchUser.email)}
                  disabled={loading}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                >
                  {loading ? 'Processing...' : '👑 Make Admin'}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {searchTerm && !searchLoading && searchResults.length === 0 && (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <div className="text-3xl md:text-4xl mb-2">🔍</div>
              <p className="text-sm md:text-base">No users found matching "{searchTerm}"</p>
              <p className="text-xs md:text-sm mt-1">Try searching by email or name</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Admins Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">👥 Current Administrators</h3>
        
        {loading && admins.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <div className="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Loading administrators...</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Total administrators: {admins.length}
            </p>
            
            {admins.map((admin) => {
              const isSuper = isSuperAdmin(admin.email);
              const isProtected = isProtectedAdmin(admin.email);
              const isCurrentUser = admin.email === user?.email;
              
              return (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors space-y-3 md:space-y-0"
                >
                  <div className="flex items-start md:items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-semibold text-xs md:text-sm">
                        {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm md:text-base">{admin.name}</p>
                        
                        {isCurrentUser && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                        
                        {/* 🛡️ SUPER ADMIN BADGE */}
                        {isSuper && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                            🛡️ Super Admin
                          </span>
                        )}
                        
                        {/* 🔒 PROTECTED BADGE (for non-super protected admins) */}
                        {isProtected && !isSuper && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                            🔒 Protected
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 break-all">{admin.email}</p>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 mt-1">
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
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full text-center">
                      ✅ Active Admin
                    </span>
                    
                    {/* 🚫 NO REMOVE BUTTON FOR PROTECTED ADMINS */}
                    {!isProtected && (
                      <button
                        onClick={() => demoteAdmin(admin._id, admin.name, admin.email)}
                        disabled={loading}
                        className="px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
                      >
                        {loading ? 'Processing...' : '❌ Remove Admin'}
                      </button>
                    )}
                    
                    {/* 🛡️ PROTECTION INDICATOR */}
                    {isProtected && (
                      <span className="px-3 md:px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs md:text-sm cursor-not-allowed text-center">
                        {isSuper ? '🛡️ Super Admin' : '🔒 Protected'}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {admins.length === 0 && !loading && (
              <div className="text-center py-6 md:py-8 text-gray-500">
                <div className="text-3xl md:text-4xl mb-2">👥</div>
                <p className="text-sm md:text-base">No administrators found</p>
                <p className="text-xs md:text-sm mt-1">Promote users to create administrators</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🛡️ Enhanced Security Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <h4 className="flex items-center text-blue-800 font-semibold mb-2 text-sm md:text-base">
          <span className="mr-2">🛡️</span>
          Security Information
        </h4>
        <ul className="text-blue-700 text-xs md:text-sm space-y-1">
          <li>• <strong>Super Admins</strong> (mindymunchs@gmail.com & sunnyjainpvt1401@gmail.com) cannot be demoted</li>
          <li>• Protected admins cannot be demoted for security reasons</li>
          <li>• Only existing administrators can promote users</li>
          <li>• All role changes are logged and tracked</li>
          <li>• Users must have existing accounts to be promoted</li>
          <li>• Demoted admins will lose all admin privileges immediately</li>
          <li>• Super Admin protection requires code changes to modify</li>
        </ul>
      </div>

      {/* 🛡️ Super Admin Status Display */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4">
        <h4 className="flex items-center text-red-800 font-semibold mb-2 text-sm md:text-base">
          <span className="mr-2">⚠️</span>
          Super Administrator Protection
        </h4>
        <div className="text-red-700 text-xs md:text-sm">
          <p className="mb-2">The following accounts are permanently protected:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><code className="bg-red-100 px-2 py-1 rounded break-all">mindymunchs@gmail.com</code></li>
            <li><code className="bg-red-100 px-2 py-1 rounded break-all">sunnyjainpvt1401@gmail.com</code></li>
          </ul>
          <p className="mt-2 text-xs">These accounts cannot be demoted by any user, including each other.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
