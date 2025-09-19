// controllers/adminController.js
const User = require('../models/User');

// Search users by email/name
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      role: 'user', // Only non-admin users
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).select('name email createdAt lastLogin');
    
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email createdAt lastLogin');
    
    // ✅ CUSTOM SORTING ON BACKEND
    const sortedAdmins = admins.sort((a, b) => {
      const superAdminEmails = ['mindymunchs@gmail.com', 'sunnyjainpvt1401@gmail.com'];
      
      // Super admins first
      const aIsSuper = superAdminEmails.includes(a.email);
      const bIsSuper = superAdminEmails.includes(b.email);
      
      if (aIsSuper && !bIsSuper) return -1;
      if (!aIsSuper && bIsSuper) return 1;
      
      // If both super admins, maintain specific order
      if (aIsSuper && bIsSuper) {
        return superAdminEmails.indexOf(a.email) - superAdminEmails.indexOf(b.email);
      }
      
      // Others by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json({
      success: true,
      data: sortedAdmins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
};

// Promote user to admin
const promoteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('name email role');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user, message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Demote admin to user (with protection)
const demoteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 🛡️ TRIPLE LAYER PROTECTION
    
    // Layer 1: Environment Variable Protection (Most Secure)
    const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    
    // Layer 2: Hardcoded Protection (Backup)
    const hardcodedProtectedEmails = ['mindymunchs@gmail.com', 'sunnyjainpvt1401@gmail.com'];
    
    // Layer 3: Combined Protection Array
    const protectedEmails = [...new Set([...superAdminEmails, ...hardcodedProtectedEmails])];
    
    console.log('🛡️ Protected admin emails:', protectedEmails);
    
    const targetUser = await User.findById(id);
    
    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // 🚨 CRITICAL CHECK: Is target user protected?
    if (protectedEmails.includes(targetUser.email)) {
      console.log(`🚨 PROTECTION TRIGGERED: Attempt to demote protected admin ${targetUser.email}`);
      return res.status(403).json({ 
        success: false, 
        message: `${targetUser.name || targetUser.email} is a super administrator and cannot be demoted. This action has been logged.` 
      });
    }
    
    // 🔒 ADDITIONAL CHECK: Is requesting user trying to demote another protected admin?
    const requestingUser = await User.findById(req.user._id);
    if (protectedEmails.includes(requestingUser.email) && protectedEmails.includes(targetUser.email)) {
      console.log(`🚨 SUPER ADMIN PROTECTION: ${requestingUser.email} attempted to demote ${targetUser.email}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Super administrators cannot demote other super administrators.' 
      });
    }
    
    // ✅ Proceed with normal demotion
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: 'user' },
      { new: true }
    ).select('name email role');
    
    console.log(`✅ Admin demoted: ${updatedUser.email} by ${requestingUser.email}`);
    
    res.json({
      success: true,
      data: updatedUser,
      message: 'Admin successfully demoted to user'
    });
    
  } catch (error) {
    console.error('❌ Error in demoteAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to demote admin',
      error: error.message
    });
  }
};

module.exports = {
  searchUsers,
  getAllAdmins,
  promoteUser,
  demoteAdmin
};
