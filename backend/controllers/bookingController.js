const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/response');

// Get all bookings
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, startDate, endDate } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: 'i' } },
        { 'pickupLocation.address': { $regex: search, $options: 'i' } },
        { 'dropLocation.address': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (startDate && endDate) {
      query['schedule.pickupDate'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name registrationNumber type')
      .populate('driver', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Booking.countDocuments(query);
    
    return sendResponse(res, 200, {
      bookings,
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

// Get booking by ID
exports.get = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name registrationNumber type images')
      .populate('driver', 'name email phone');
    
    if (!booking) return sendError(res, 404, 'Booking not found');
    return sendResponse(res, 200, booking);
  } catch (err) {
    next(err);
  }
};

// Create booking
exports.create = async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate, pickupLocation, dropLocation } = req.body;
    
    // Check if vehicle is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return sendError(res, 404, 'Vehicle not found');
    if (vehicle.status !== 'available') return sendError(res, 400, 'Vehicle is not available');
    
    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['confirmed', 'in-progress'] },
      isActive: true,
      $or: [
        {
          'schedule.pickupDate': { $lte: new Date(returnDate) },
          'schedule.returnDate': { $gte: new Date(pickupDate) }
        }
      ]
    });
    
    if (conflictingBooking) return sendError(res, 400, 'Vehicle is already booked for these dates');
    
    // Calculate pricing
    const duration = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = duration * vehicle.pricing.dailyRate;
    
    const bookingData = {
      ...req.body,
      customer: req.user.userId,
      pricing: {
        hourlyRate: vehicle.pricing.hourlyRate,
        dailyRate: vehicle.pricing.dailyRate,
        totalAmount,
        securityDeposit: vehicle.pricing.securityDeposit,
        finalAmount: totalAmount + vehicle.pricing.securityDeposit
      },
      schedule: {
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        duration: { days: duration }
      }
    };
    
    const booking = new Booking(bookingData);
    await booking.save();
    
    // Update vehicle status
    vehicle.status = 'booked';
    await vehicle.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name registrationNumber type');
    
    return sendResponse(res, 201, populatedBooking, 'Booking created successfully');
  } catch (err) {
    next(err);
  }
};

// Update booking
exports.update = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone')
     .populate('vehicle', 'name registrationNumber type')
     .populate('driver', 'name email phone');
    
    if (!booking) return sendError(res, 404, 'Booking not found');
    return sendResponse(res, 200, booking, 'Booking updated successfully');
  } catch (err) {
    next(err);
  }
};

// Delete booking
exports.remove = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!booking) return sendError(res, 404, 'Booking not found');
    
    // Update vehicle status back to available
    if (booking.vehicle) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'available' });
    }
    
    return sendResponse(res, 200, null, 'Booking deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Update booking status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return sendError(res, 404, 'Booking not found');
    
    booking.status = status;
    if (status === 'completed') {
      booking.schedule.actualReturnDate = new Date();
    }
    
    await booking.save();
    
    // Update vehicle status based on booking status
    if (booking.vehicle) {
      let vehicleStatus = 'available';
      if (['confirmed', 'in-progress'].includes(status)) {
        vehicleStatus = 'booked';
      }
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: vehicleStatus });
    }
    
    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name registrationNumber type')
      .populate('driver', 'name email phone');
    
    return sendResponse(res, 200, updatedBooking, 'Booking status updated successfully');
  } catch (err) {
    next(err);
  }
};

// Get user bookings
exports.userBookings = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const bookings = await Booking.find({ 
      customer: userId, 
      isActive: true 
    })
    .populate('vehicle', 'name registrationNumber type images')
    .populate('driver', 'name email phone')
    .sort({ createdAt: -1 });
    
    return sendResponse(res, 200, bookings);
  } catch (err) {
    next(err);
  }
};

// Get booking statistics (admin only)
exports.stats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments({ isActive: true });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed', isActive: true });
    const completedBookings = await Booking.countDocuments({ status: 'completed', isActive: true });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled', isActive: true });
    const pendingBookings = await Booking.countDocuments({ status: 'pending', isActive: true });
    
    // Revenue calculation
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed', isActive: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.finalAmount' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    const stats = {
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      totalRevenue,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      cancellationRate: totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0
    };
    
    return sendResponse(res, 200, stats);
  } catch (err) {
    next(err);
  }
};

// Cancel booking
exports.cancel = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return sendError(res, 404, 'Booking not found');
    if (booking.status === 'completed') return sendError(res, 400, 'Cannot cancel completed booking');
    
    booking.status = 'cancelled';
    booking.cancellation = {
      reason,
      cancelledBy: req.user.role === 'admin' ? 'admin' : 'customer',
      cancelledAt: new Date()
    };
    
    await booking.save();
    
    // Update vehicle status back to available
    if (booking.vehicle) {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'available' });
    }
    
    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name registrationNumber type')
      .populate('driver', 'name email phone');
    
    return sendResponse(res, 200, updatedBooking, 'Booking cancelled successfully');
  } catch (err) {
    next(err);
  }
}; 