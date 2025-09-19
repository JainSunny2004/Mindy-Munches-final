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
    const admins = await User.find({ role: 'admin' })
      .select('name email createdAt lastLogin');
    
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    
    // Protect certain admins from being demoted
    const protectedEmails = ['mindymunchs@gmail.com', 'sunnyjainpvt1401@gmail.com'];
    const targetUser = await User.findById(id);
    
    if (protectedEmails.includes(targetUser.email)) {
      return res.status(403).json({ 
        success: false, 
        message: 'This admin cannot be demoted' 
      });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { role: 'user' },
      { new: true }
    ).select('name email role');
    
    res.json({ success: true, data: user, message: 'Admin demoted to user' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchUsers,
  getAllAdmins,
  promoteUser,
  demoteAdmin
};
