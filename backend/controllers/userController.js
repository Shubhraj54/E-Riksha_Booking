const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/response');

// Get all users (admin only)
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    return sendResponse(res, 200, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
exports.get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return sendError(res, 404, 'User not found');
    return sendResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

// Create user (admin only)
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return sendResponse(res, 201, user.toPublicJSON(), 'User created successfully');
  } catch (err) {
    if (err.code === 11000) return sendError(res, 409, 'Email already exists');
    next(err);
  }
};

// Update user
exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    delete updates.password; // Password should be changed via separate endpoint
    
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return sendError(res, 404, 'User not found');
    return sendResponse(res, 200, user, 'User updated successfully');
  } catch (err) {
    next(err);
  }
};

// Delete user (admin only)
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!user) return sendError(res, 404, 'User not found');
    return sendResponse(res, 200, null, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Get user statistics (admin only)
exports.stats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const activeUsers = await User.countDocuments({ isActive: true, lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const adminUsers = await User.countDocuments({ role: 'admin', isActive: true });
    const driverUsers = await User.countDocuments({ role: 'driver', isActive: true });
    
    const stats = {
      totalUsers,
      activeUsers,
      adminUsers,
      driverUsers,
      regularUsers: totalUsers - adminUsers - driverUsers
    };
    
    return sendResponse(res, 200, stats);
  } catch (err) {
    next(err);
  }
}; 