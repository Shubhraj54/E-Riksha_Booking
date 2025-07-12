const express = require('express');
const { vehicleController } = require('../controllers/vehicleController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { validateVehicle } = require('../middlewares/validation');
const router = express.Router();

// Public routes (for browsing vehicles)
router.get('/', vehicleController.getAllVehicles);
router.get('/available', vehicleController.getAvailableVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Admin/Manager routes
router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), validateVehicle, vehicleController.createVehicle);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validateVehicle, vehicleController.updateVehicle);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), vehicleController.deleteVehicle);

// Vehicle status management
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'manager']), vehicleController.updateVehicleStatus);
router.patch('/:id/maintenance', authMiddleware, roleMiddleware(['admin', 'manager']), vehicleController.updateMaintenanceStatus);

// Vehicle statistics
router.get('/stats/overview', authMiddleware, roleMiddleware(['admin', 'manager']), vehicleController.getVehicleStats);

module.exports = router;
