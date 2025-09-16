/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminInviteModal from '../AdminInviteModal'
import useInviteStore from '../../store/inviteStore'
import useAuthStore from '../../store/authStore'

const AdminManagement = () => {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [invites, setInvites] = useState([])
  const { getAllInvites, cancelInvite } = useInviteStore()
  const { user } = useAuthStore()

  // Mock admin list - in real app this would come from API
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Demo Admin',
      email: 'admin@demo.com',
      role: 'admin',
      createdAt: '2023-01-15',
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: user?.name || 'Current Admin',
      email: user?.email || 'current@admin.com',
      role: 'admin',
      createdAt: '2023-06-20',
      lastActive: 'Now',
      status: 'active'
    }
  ])

  useEffect(() => {
    setInvites(getAllInvites())
  }, [getAllInvites])

  const handleInviteSuccess = (invite) => {
    setInvites(getAllInvites()) // Refresh invites list
    
    // Mock email sending notification
    alert(`Invitation sent successfully! 
    
Email: ${invite.email}
Token: ${invite.token}

In a real application, this would send an email with the invitation link:
${window.location.origin}/admin/invite/${invite.token}`)
  }

  const handleCancelInvite = (inviteId) => {
    if (window.confirm('Are you sure you want to cancel this invitation?')) {
      cancelInvite(inviteId)
      setInvites(getAllInvites())
    }
  }

  const getInviteStatus = (invite) => {
    if (invite.status === 'accepted') return { label: 'Accepted', color: 'bg-green-100 text-green-800' }
    if (new Date(invite.expiresAt) < new Date()) return { label: 'Expired', color: 'bg-red-100 text-red-800' }
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
  }

  const copyInviteLink = (token) => {
    const inviteUrl = `${window.location.origin}/admin/invite/${token}`
    navigator.clipboard.writeText(inviteUrl).then(() => {
      alert('Invite link copied to clipboard!')
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-800">Admin Management</h2>
          <p className="text-neutral-600">Manage administrators and invitations</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span>👑</span>
          Invite New Admin
        </button>
      </div>

      {/* Current Admins */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4">
          Current Administrators
        </h3>
        
        <div className="space-y-4">
          {admins.map((admin, index) => (
            <motion.div
              key={admin.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {admin.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">
                    {admin.name}
                    {admin.email === user?.email && (
                      <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-neutral-600">{admin.email}</p>
                  <p className="text-xs text-neutral-500">Last active: {admin.lastActive}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Active
                </span>
                <span className="text-xs text-neutral-500">
                  Since {admin.createdAt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4">
          Pending Invitations ({invites.length})
        </h3>
        
        {invites.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📧</div>
            <p className="text-neutral-600">No pending invitations</p>
            <p className="text-sm text-neutral-500 mt-1">
              Click "Invite New Admin" to send an invitation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {invites.map((invite, index) => {
                const status = getInviteStatus(invite)
                return (
                  <motion.div
                    key={invite.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-neutral-800">{invite.email}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="text-sm text-neutral-600 space-y-1">
                        <p>Invited by: {invite.invitedBy}</p>
                        <p>Created: {new Date(invite.createdAt).toLocaleDateString()}</p>
                        <p>Expires: {new Date(invite.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {invite.status === 'pending' && new Date(invite.expiresAt) > new Date() && (
                        <>
                          <button
                            onClick={() => copyInviteLink(invite.token)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Copy invite link"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCancelInvite(invite.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel invitation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Security Information</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Invitation links expire after 7 days for security</p>
              <p>• Only existing administrators can invite new admins</p>
              <p>• Invited users must set up their own secure passwords</p>
              <p>• Admin accounts cannot be created through regular signup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AdminInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={handleInviteSuccess}
      />
    </div>
  )
}

export default AdminManagement
