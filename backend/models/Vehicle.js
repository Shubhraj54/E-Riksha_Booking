const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['auto-rickshaw', 'e-rickshaw', 'cargo-rickshaw', 'passenger-rickshaw']
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: new Date().getFullYear() + 1
  },
  color: {
    type: String,
    required: true
  },
  capacity: {
    passengers: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    luggage: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  features: [{
    type: String,
    enum: [
      'AC', 'GPS', 'Music System', 'USB Charging', 
      'Safety Belt', 'First Aid Kit', 'Fire Extinguisher',
      'Wheelchair Accessible', 'Child Seat', 'WiFi'
    ]
  }],
  specifications: {
    engine: String,
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
      default: 'Petrol'
    },
    mileage: Number,
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      default: 'Manual'
    }
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: true,
      min: 0
    },
    dailyRate: {
      type: Number,
      required: true,
      min: 0
    },
    weeklyRate: {
      type: Number,
      min: 0
    },
    monthlyRate: {
      type: Number,
      min: 0
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'out-of-service'],
    default: 'available'
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: {
    registration: {
      number: String,
      expiryDate: Date,
      documentUrl: String
    },
    insurance: {
      number: String,
      expiryDate: Date,
      documentUrl: String
    },
    permit: {
      number: String,
      expiryDate: Date,
      documentUrl: String
    },
    fitness: {
      number: String,
      expiryDate: Date,
      documentUrl: String
    }
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    serviceHistory: [{
      date: Date,
      type: String,
      description: String,
      cost: Number,
      serviceCenter: String
    }]
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ 'location.city': 1 });
vehicleSchema.index({ isActive: 1 });

// Virtual for vehicle availability
vehicleSchema.virtual('isAvailable').get(function() {
  return this.status === 'available' && this.isActive;
});

// Method to get vehicle summary
vehicleSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    registrationNumber: this.registrationNumber,
    status: this.status,
    hourlyRate: this.pricing.hourlyRate,
    dailyRate: this.pricing.dailyRate,
    location: this.location,
    images: this.images.filter(img => img.isPrimary || this.images.length === 1)
  };
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
