const express = require('express');
const { bookingController } = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { validateBooking } = require('../middlewares/validation');
const router = express.Router();

// Public routes (for creating bookings)
router.post('/', validateBooking, bookingController.createBooking);

// User routes (authenticated users can view their own bookings)
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.get('/my-bookings/:id', authMiddleware, bookingController.getMyBookingById);
router.put('/my-bookings/:id/cancel', authMiddleware, bookingController.cancelMyBooking);

// Admin/Manager routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.getAllBookings);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.getBookingById);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validateBooking, bookingController.updateBooking);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), bookingController.deleteBooking);

// Booking status management
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.updateBookingStatus);
router.patch('/:id/assign-driver', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.assignDriver);

// Booking statistics
router.get('/stats/overview', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.getBookingStats);
router.get('/stats/daily', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.getDailyStats);
router.get('/stats/monthly', authMiddleware, roleMiddleware(['admin', 'manager']), bookingController.getMonthlyStats);

module.exports = router;
