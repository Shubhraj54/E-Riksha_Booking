const express = require('express');
const { driverController } = require('../controllers/driverController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { validateDriver } = require('../middlewares/validation');
const router = express.Router();

// Public routes (for viewing available drivers)
router.get('/available', driverController.getAvailableDrivers);

// Driver routes (drivers can view their own profile and assignments)
router.get('/profile/me', authMiddleware, roleMiddleware(['driver']), driverController.getMyProfile);
router.put('/profile/me', authMiddleware, roleMiddleware(['driver']), driverController.updateMyProfile);
router.get('/assignments/me', authMiddleware, roleMiddleware(['driver']), driverController.getMyAssignments);
router.get('/earnings/me', authMiddleware, roleMiddleware(['driver']), driverController.getMyEarnings);

// Admin/Manager routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.getAllDrivers);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.getDriverById);
router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), validateDriver, driverController.createDriver);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validateDriver, driverController.updateDriver);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), driverController.deleteDriver);

// Driver status and assignment management
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.updateDriverStatus);
router.patch('/:id/assign', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.assignDriver);
router.patch('/:id/unassign', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.unassignDriver);

// Driver performance and earnings
router.get('/:id/performance', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.getDriverPerformance);
router.get('/:id/earnings', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.getDriverEarnings);
router.post('/:id/earnings/payout', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.processPayout);

// Driver statistics
router.get('/stats/overview', authMiddleware, roleMiddleware(['admin', 'manager']), driverController.getDriverStats);

module.exports = router;
