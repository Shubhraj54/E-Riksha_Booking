const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../config');
const { sendResponse, sendError } = require('../utils/response');

// Register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 422, errors.array());
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 409, 'Email already registered');
    const hashed = await bcrypt.hash(password, config.security.bcryptRounds);
    const user = new User({ name, email, password: hashed });
    await user.save();
    return sendResponse(res, 201, null, 'Signup successful');
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 401, 'Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, 401, 'Invalid credentials');
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    return sendResponse(res, 200, { token, user: user.toPublicJSON() }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 404, 'User not found');
    return sendResponse(res, 200, user.toPublicJSON());
  } catch (err) {
    next(err);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!user) return sendError(res, 404, 'User not found');
    return sendResponse(res, 200, user.toPublicJSON(), 'Profile updated');
  } catch (err) {
    next(err);
  }
};

// Change Password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 404, 'User not found');
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return sendError(res, 401, 'Old password incorrect');
    user.password = await bcrypt.hash(newPassword, config.security.bcryptRounds);
    await user.save();
    return sendResponse(res, 200, null, 'Password changed');
  } catch (err) {
    next(err);
  }
};

// Logout (stateless, just a placeholder)
exports.logout = async (req, res) => {
  return sendResponse(res, 200, null, 'Logged out');
}; 