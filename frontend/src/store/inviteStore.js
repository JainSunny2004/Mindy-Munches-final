import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useInviteStore = create(
  persist(
    (set, get) => ({
      invites: [], // Store pending invites
      
      // Create a new admin invite (only admins can do this)
      createInvite: (email, invitedBy) => {
        const invite = {
          id: Date.now(),
          email: email.toLowerCase(),
          token: generateInviteToken(),
          invitedBy,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          status: 'pending', // pending, accepted, expired
          type: 'admin'
        }
        
        set(state => ({
          invites: [...state.invites, invite]
        }))
        
        return invite
      },
      
      // Get invite by token
      getInviteByToken: (token) => {
        const { invites } = get()
        return invites.find(invite => 
          invite.token === token && 
          invite.status === 'pending' &&
          new Date(invite.expiresAt) > new Date()
        )
      },
      
      // Accept an invite (used during signup)
      acceptInvite: (token) => {
        set(state => ({
          invites: state.invites.map(invite =>
            invite.token === token 
              ? { ...invite, status: 'accepted', acceptedAt: new Date().toISOString() }
              : invite
          )
        }))
      },
      
      // Get all invites (for admin dashboard)
      getAllInvites: () => {
        return get().invites
      },
      
      // Cancel/delete an invite
      cancelInvite: (inviteId) => {
        set(state => ({
          invites: state.invites.filter(invite => invite.id !== inviteId)
        }))
      },
      
      // Check if email already has pending invite
      hasPendingInvite: (email) => {
        const { invites } = get()
        return invites.some(invite => 
          invite.email === email.toLowerCase() && 
          invite.status === 'pending' &&
          new Date(invite.expiresAt) > new Date()
        )
      }
    }),
    {
      name: 'invite-storage',
      version: 1,
    }
  )
)

// Generate random invite token
function generateInviteToken() {
  return 'invite_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export default useInviteStore
