const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendResponse, sendError } = require('../utils/response');
const paymentService = require('../services/paymentService');

// Get all payments
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, startDate, endDate } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const payments = await Payment.find(query)
      .populate('customer', 'name email phone')
      .populate('booking', 'bookingNumber vehicle')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Payment.countDocuments(query);
    
    return sendResponse(res, 200, {
      payments,
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

// Get payment by ID
exports.get = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('booking', 'bookingNumber vehicle pickupLocation dropLocation');
    
    if (!payment) return sendError(res, 404, 'Payment not found');
    return sendResponse(res, 200, payment);
  } catch (err) {
    next(err);
  }
};

// Create payment
exports.create = async (req, res, next) => {
  try {
    const { bookingId, amount, method } = req.body;
    
    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) return sendError(res, 404, 'Booking not found');
    if (booking.customer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return sendError(res, 403, 'Access denied');
    }
    
    // Check if payment already exists for this booking
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) return sendError(res, 409, 'Payment already exists for this booking');
    
    const paymentData = {
      ...req.body,
      customer: req.user.userId,
      booking: bookingId,
      amount: amount || booking.pricing.finalAmount,
      status: 'pending'
    };
    
    const payment = new Payment(paymentData);
    await payment.save();
    
    const populatedPayment = await Payment.findById(payment._id)
      .populate('customer', 'name email phone')
      .populate('booking', 'bookingNumber vehicle');
    
    return sendResponse(res, 201, populatedPayment, 'Payment created successfully');
  } catch (err) {
    next(err);
  }
};

// Update payment
exports.update = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone')
     .populate('booking', 'bookingNumber vehicle');
    
    if (!payment) return sendError(res, 404, 'Payment not found');
    return sendResponse(res, 200, payment, 'Payment updated successfully');
  } catch (err) {
    next(err);
  }
};

// Process payment
exports.process = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) return sendError(res, 404, 'Payment not found');
    if (payment.status !== 'pending') return sendError(res, 400, 'Payment is not pending');
    
    // Process payment through payment service
    const result = await paymentService.processPayment({
      amount: payment.amount,
      currency: 'INR',
      method: paymentMethod,
      description: `Payment for booking ${payment.booking}`,
      customerEmail: req.user.email
    });
    
    if (result.status === 'success') {
      payment.status = 'success';
      payment.transactionId = result.transactionId;
      payment.paymentDate = new Date();
      payment.method = paymentMethod;
      
      // Update booking status
      if (payment.booking) {
        await Booking.findByIdAndUpdate(payment.booking, { 
          status: 'confirmed',
          'payment.status': 'paid',
          'payment.transactionId': result.transactionId
        });
      }
    } else {
      payment.status = 'failed';
    }
    
    await payment.save();
    
    const updatedPayment = await Payment.findById(payment._id)
      .populate('customer', 'name email phone')
      .populate('booking', 'bookingNumber vehicle');
    
    return sendResponse(res, 200, updatedPayment, `Payment ${payment.status}`);
  } catch (err) {
    next(err);
  }
};

// Refund payment
exports.refund = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) return sendError(res, 404, 'Payment not found');
    if (payment.status !== 'success') return sendError(res, 400, 'Payment is not successful');
    
    // Process refund through payment service
    const result = await paymentService.refundPayment(payment.transactionId, reason);
    
    if (result.status === 'refunded') {
      payment.status = 'refunded';
      payment.refund = {
        reason,
        refundedAt: new Date(),
        refundAmount: payment.amount
      };
      
      // Update booking status if it exists
      if (payment.booking) {
        await Booking.findByIdAndUpdate(payment.booking, { 
          'payment.status': 'refunded'
        });
      }
    }
    
    await payment.save();
    
    const updatedPayment = await Payment.findById(payment._id)
      .populate('customer', 'name email phone')
      .populate('booking', 'bookingNumber vehicle');
    
    return sendResponse(res, 200, updatedPayment, 'Payment refunded successfully');
  } catch (err) {
    next(err);
  }
};

// Get payment statistics (admin only)
exports.stats = async (req, res, next) => {
  try {
    const totalPayments = await Payment.countDocuments({ isActive: true });
    const successfulPayments = await Payment.countDocuments({ status: 'success', isActive: true });
    const pendingPayments = await Payment.countDocuments({ status: 'pending', isActive: true });
    const failedPayments = await Payment.countDocuments({ status: 'failed', isActive: true });
    const refundedPayments = await Payment.countDocuments({ status: 'refunded', isActive: true });
    
    // Revenue calculation
    const revenueData = await Payment.aggregate([
      { $match: { status: 'success', isActive: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    
    const refundData = await Payment.aggregate([
      { $match: { status: 'refunded', isActive: true } },
      { $group: { _id: null, totalRefunds: { $sum: '$amount' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const totalRefunds = refundData.length > 0 ? refundData[0].totalRefunds : 0;
    const netRevenue = totalRevenue - totalRefunds;
    
    const stats = {
      totalPayments,
      successfulPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalRevenue,
      totalRefunds,
      netRevenue,
      successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0
    };
    
    return sendResponse(res, 200, stats);
  } catch (err) {
    next(err);
  }
};

// Get user payments
exports.userPayments = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const payments = await Payment.find({ 
      customer: userId, 
      isActive: true 
    })
    .populate('booking', 'bookingNumber vehicle pickupLocation dropLocation')
    .sort({ createdAt: -1 });
    
    return sendResponse(res, 200, payments);
  } catch (err) {
    next(err);
  }
}; 