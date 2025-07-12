const Joi = require('joi');
const { errorResponse } = require('../utils/response');

// Validation schemas
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s-]+$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s-]+$/).optional(),
  role: Joi.string().valid('user', 'admin', 'manager', 'driver').default('user'),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active')
});

const vehicleSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  type: Joi.string().valid('auto', 'e-rickshaw', 'cycle-rickshaw').required(),
  registrationNumber: Joi.string().required(),
  model: Joi.string().optional(),
  year: Joi.number().integer().min(2000).max(new Date().getFullYear()).optional(),
  capacity: Joi.number().integer().min(1).max(10).optional(),
  ratePerHour: Joi.number().positive().required(),
  ratePerDay: Joi.number().positive().optional(),
  status: Joi.string().valid('available', 'booked', 'maintenance', 'out-of-service').default('available'),
  location: Joi.string().optional(),
  features: Joi.array().items(Joi.string()).optional(),
  description: Joi.string().max(500).optional()
});

const bookingSchema = Joi.object({
  userId: Joi.string().required(),
  vehicleId: Joi.string().required(),
  driverId: Joi.string().optional(),
  pickupLocation: Joi.string().required(),
  dropLocation: Joi.string().required(),
  pickupDate: Joi.date().greater('now').required(),
  returnDate: Joi.date().greater(Joi.ref('pickupDate')).required(),
  totalAmount: Joi.number().positive().required(),
  status: Joi.string().valid('pending', 'confirmed', 'in-progress', 'completed', 'cancelled').default('pending'),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded').default('pending'),
  specialRequests: Joi.string().max(500).optional()
});

const paymentSchema = Joi.object({
  bookingId: Joi.string().required(),
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('INR'),
  paymentMethod: Joi.string().valid('cash', 'card', 'upi', 'wallet').required(),
  status: Joi.string().valid('pending', 'success', 'failed', 'refunded').default('pending'),
  transactionId: Joi.string().optional(),
  description: Joi.string().max(200).optional()
});

const driverSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s-]+$/).required(),
  licenseNumber: Joi.string().required(),
  licenseExpiry: Joi.date().greater('now').required(),
  vehicleType: Joi.array().items(Joi.string().valid('auto', 'e-rickshaw', 'cycle-rickshaw')).required(),
  experience: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
  address: Joi.string().required(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^\+?[\d\s-]+$/).required(),
    relationship: Joi.string().required()
  }).required()
});

// Validation middleware functions
const validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

const validateVehicle = (req, res, next) => {
  const { error } = vehicleSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

const validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

const validatePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

const validateDriver = (req, res, next) => {
  const { error } = driverSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, 'Validation Error', error.details[0].message);
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateUser,
  validateVehicle,
  validateBooking,
  validatePayment,
  validateDriver
}; 