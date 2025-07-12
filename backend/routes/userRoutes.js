const express = require('express');
const { userController } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { validateUser } = require('../middlewares/validation');
const router = express.Router();

// Admin only routes
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), userController.getUserById);
router.post('/', authMiddleware, roleMiddleware(['admin']), validateUser, userController.createUser);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validateUser, userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

// User profile routes (user can access their own profile)
router.get('/profile/me', authMiddleware, userController.getMyProfile);
router.put('/profile/me', authMiddleware, userController.updateMyProfile);

module.exports = router;
