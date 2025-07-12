const Vehicle = require('../models/Vehicle');
const { sendResponse, sendError } = require('../utils/response');

// Get all vehicles
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, type, status, city } = req.query;
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    
    const vehicles = await Vehicle.find(query)
      .populate('assignedDriver', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Vehicle.countDocuments(query);
    
    return sendResponse(res, 200, {
      vehicles,
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

// Get vehicle by ID
exports.get = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('assignedDriver', 'name email phone');
    if (!vehicle) return sendError(res, 404, 'Vehicle not found');
    return sendResponse(res, 200, vehicle);
  } catch (err) {
    next(err);
  }
};

// Create vehicle (admin only)
exports.create = async (req, res, next) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    return sendResponse(res, 201, vehicle, 'Vehicle created successfully');
  } catch (err) {
    if (err.code === 11000) return sendError(res, 409, 'Registration number already exists');
    next(err);
  }
};

// Update vehicle
exports.update = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('assignedDriver', 'name email phone');
    
    if (!vehicle) return sendError(res, 404, 'Vehicle not found');
    return sendResponse(res, 200, vehicle, 'Vehicle updated successfully');
  } catch (err) {
    if (err.code === 11000) return sendError(res, 409, 'Registration number already exists');
    next(err);
  }
};

// Delete vehicle (admin only)
exports.remove = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!vehicle) return sendError(res, 404, 'Vehicle not found');
    return sendResponse(res, 200, null, 'Vehicle deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Get available vehicles
exports.available = async (req, res, next) => {
  try {
    const { type, city, pickupDate, returnDate } = req.query;
    const query = { 
      isActive: true, 
      status: 'available' 
    };
    
    if (type) query.type = type;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    
    // Check availability for specific dates
    if (pickupDate && returnDate) {
      query.$and = [
        { status: 'available' },
        {
          $or: [
            { 'maintenance.nextService': { $gt: new Date(returnDate) } },
            { 'maintenance.nextService': { $exists: false } }
          ]
        }
      ];
    }
    
    const vehicles = await Vehicle.find(query)
      .populate('assignedDriver', 'name email phone')
      .sort({ createdAt: -1 });
    
    return sendResponse(res, 200, vehicles);
  } catch (err) {
    next(err);
  }
};

// Get vehicle statistics (admin only)
exports.stats = async (req, res, next) => {
  try {
    const totalVehicles = await Vehicle.countDocuments({ isActive: true });
    const availableVehicles = await Vehicle.countDocuments({ isActive: true, status: 'available' });
    const bookedVehicles = await Vehicle.countDocuments({ isActive: true, status: 'booked' });
    const maintenanceVehicles = await Vehicle.countDocuments({ isActive: true, status: 'maintenance' });
    const outOfServiceVehicles = await Vehicle.countDocuments({ isActive: true, status: 'out-of-service' });
    
    // Vehicle types breakdown
    const typeStats = await Vehicle.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalVehicles,
      availableVehicles,
      bookedVehicles,
      maintenanceVehicles,
      outOfServiceVehicles,
      typeBreakdown: typeStats,
      utilizationRate: totalVehicles > 0 ? ((totalVehicles - availableVehicles) / totalVehicles) * 100 : 0
    };
    
    return sendResponse(res, 200, stats);
  } catch (err) {
    next(err);
  }
};

// Upload vehicle image
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No image file provided');
    
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return sendError(res, 404, 'Vehicle not found');
    
    const imageUrl = `/uploads/vehicles/${req.file.filename}`;
    
    // Add image to vehicle
    vehicle.images.push({
      url: imageUrl,
      caption: req.body.caption || 'Vehicle image',
      isPrimary: vehicle.images.length === 0 // First image is primary
    });
    
    await vehicle.save();
    return sendResponse(res, 200, { imageUrl }, 'Image uploaded successfully');
  } catch (err) {
    next(err);
  }
}; 