const express = require('express');
const { paymentController } = require('../controllers/paymentController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { validatePayment } = require('../middlewares/validation');
const router = express.Router();

// Public routes (for processing payments)
router.post('/process', validatePayment, paymentController.processPayment);
router.post('/webhook', paymentController.handleWebhook);

// User routes (authenticated users can view their own payments)
router.get('/my-payments', authMiddleware, paymentController.getMyPayments);
router.get('/my-payments/:id', authMiddleware, paymentController.getMyPaymentById);

// Admin/Manager routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.getAllPayments);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.getPaymentById);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validatePayment, paymentController.updatePayment);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), paymentController.deletePayment);

// Payment status management
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.updatePaymentStatus);
router.patch('/:id/refund', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.processRefund);

// Payment statistics
router.get('/stats/overview', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.getPaymentStats);
router.get('/stats/daily', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.getDailyStats);
router.get('/stats/monthly', authMiddleware, roleMiddleware(['admin', 'manager']), paymentController.getMonthlyStats);

module.exports = router;
