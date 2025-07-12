const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { sendResponse, sendError } = require('../utils/response');

// Get all drivers
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, city } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    
    const drivers = await Driver.find(query)
      .populate('assignedVehicle', 'name registrationNumber type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Driver.countDocuments(query);
    
    return sendResponse(res, 200, {
      drivers,
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

// Get driver by ID
exports.get = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('assignedVehicle', 'name registrationNumber type images');
    
    if (!driver) return sendError(res, 404, 'Driver not found');
    return sendResponse(res, 200, driver);
  } catch (err) {
    next(err);
  }
};

// Create driver
exports.create = async (req, res, next) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    
    const populatedDriver = await Driver.findById(driver._id)
      .populate('assignedVehicle', 'name registrationNumber type');
    
    return sendResponse(res, 201, populatedDriver, 'Driver created successfully');
  } catch (err) {
    if (err.code === 11000) return sendError(res, 409, 'Email or license number already exists');
    next(err);
  }
};

// Update driver
exports.update = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('assignedVehicle', 'name registrationNumber type');
    
    if (!driver) return sendError(res, 404, 'Driver not found');
    return sendResponse(res, 200, driver, 'Driver updated successfully');
  } catch (err) {
    if (err.code === 11000) return sendError(res, 409, 'Email or license number already exists');
    next(err);
  }
};

// Delete driver
exports.remove = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return sendError(res, 404, 'Driver not found');
    
    // Check if driver has active bookings
    const activeBookings = await Booking.findOne({
      driver: req.params.id,
      status: { $in: ['confirmed', 'in-progress'] },
      isActive: true
    });
    
    if (activeBookings) return sendError(res, 400, 'Cannot delete driver with active bookings');
    
    // Unassign vehicle if assigned
    if (driver.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { 
        assignedDriver: null,
        status: 'available'
      });
    }
    
    driver.isActive = false;
    await driver.save();
    
    return sendResponse(res, 200, null, 'Driver deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Assign driver to vehicle
exports.assign = async (req, res, next) => {
  try {
    const { vehicleId } = req.body;
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) return sendError(res, 404, 'Driver not found');
    if (!driver.isActive) return sendError(res, 400, 'Driver is not active');
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return sendError(res, 404, 'Vehicle not found');
    if (!vehicle.isActive) return sendError(res, 400, 'Vehicle is not active');
    
    // Unassign previous driver from this vehicle
    if (vehicle.assignedDriver) {
      await Driver.findByIdAndUpdate(vehicle.assignedDriver, { assignedVehicle: null });
    }
    
    // Unassign current driver from previous vehicle
    if (driver.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { assignedDriver: null });
    }
    
    // Assign driver to vehicle
    driver.assignedVehicle = vehicleId;
    vehicle.assignedDriver = req.params.id;
    
    await driver.save();
    await vehicle.save();
    
    const updatedDriver = await Driver.findById(driver._id)
      .populate('assignedVehicle', 'name registrationNumber type');
    
    return sendResponse(res, 200, updatedDriver, 'Driver assigned to vehicle successfully');
  } catch (err) {
    next(err);
  }
};

// Get driver statistics
exports.stats = async (req, res, next) => {
  try {
    const totalDrivers = await Driver.countDocuments({ isActive: true });
    const activeDrivers = await Driver.countDocuments({ status: 'active', isActive: true });
    const assignedDrivers = await Driver.countDocuments({ assignedVehicle: { $exists: true, $ne: null }, isActive: true });
    const availableDrivers = totalDrivers - assignedDrivers;
    
    // Driver performance stats
    const performanceStats = await Booking.aggregate([
      { $match: { driver: { $exists: true, $ne: null }, isActive: true } },
      { $group: { 
        _id: '$driver', 
        totalBookings: { $sum: 1 },
        completedBookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        totalEarnings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$pricing.finalAmount', 0] } }
      }},
      { $lookup: { from: 'drivers', localField: '_id', foreignField: '_id', as: 'driver' } },
      { $unwind: '$driver' },
      { $project: {
        driverName: '$driver.name',
        totalBookings: 1,
        completedBookings: 1,
        totalEarnings: 1,
        completionRate: { $multiply: [{ $divide: ['$completedBookings', '$totalBookings'] }, 100] }
      }}
    ]);
    
    const stats = {
      totalDrivers,
      activeDrivers,
      assignedDrivers,
      availableDrivers,
      performanceStats
    };
    
    return sendResponse(res, 200, stats);
  } catch (err) {
    next(err);
  }
};

// Get driver performance
exports.performance = async (req, res, next) => {
  try {
    const driverId = req.params.id;
    const driver = await Driver.findById(driverId);
    
    if (!driver) return sendError(res, 404, 'Driver not found');
    
    // Get driver's bookings
    const bookings = await Booking.find({ 
      driver: driverId, 
      isActive: true 
    }).populate('vehicle', 'name registrationNumber type');
    
    // Calculate performance metrics
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const totalEarnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.pricing?.finalAmount || 0), 0);
    
    // Monthly performance
    const monthlyStats = await Booking.aggregate([
      { $match: { driver: driverId, isActive: true } },
      { $group: {
        _id: { 
          year: { $year: '$createdAt' }, 
          month: { $month: '$createdAt' } 
        },
        bookings: { $sum: 1 },
        earnings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$pricing.finalAmount', 0] } }
      }},
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    const performance = {
      driver: {
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        status: driver.status,
        assignedVehicle: driver.assignedVehicle
      },
      metrics: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        totalEarnings,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
        cancellationRate: totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0
      },
      monthlyStats,
      recentBookings: bookings.slice(0, 10) // Last 10 bookings
    };
    
    return sendResponse(res, 200, performance);
  } catch (err) {
    next(err);
  }
}; 