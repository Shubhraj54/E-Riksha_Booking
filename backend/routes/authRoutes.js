const express = require('express');
const { authController } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validation');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Public routes
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
