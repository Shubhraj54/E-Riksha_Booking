const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmark: String
  },
  dropLocation: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmark: String
  },
  schedule: {
    pickupDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    },
    pickupTime: String,
    returnTime: String,
    duration: {
      hours: Number,
      days: Number
    }
  },
  pricing: {
    hourlyRate: Number,
    dailyRate: Number,
    totalAmount: {
      type: Number,
      required: true
    },
    securityDeposit: Number,
    discount: {
      amount: {
        type: Number,
        default: 0
      },
      reason: String
    },
    finalAmount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['online', 'cash', 'card', 'upi'],
      default: 'online'
    },
    transactionId: String,
    paymentDate: Date,
    amount: Number
  },
  specialRequests: [String],
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', 'system'],
      default: 'customer'
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'completed'],
      default: 'pending'
    }
  },
  ratings: {
    vehicle: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      date: Date
    },
    driver: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      date: Date
    },
    service: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      date: Date
    }
  },
  documents: {
    rentalAgreement: String,
    insurance: String,
    receipt: String
  },
  notes: {
    customer: String,
    admin: String,
    driver: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ vehicle: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'schedule.pickupDate': 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ isActive: 1 });

// Pre-save middleware to generate booking number
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of bookings for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    this.bookingNumber = `ER${year}${month}${day}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (this.schedule.pickupDate && this.schedule.returnDate) {
    const diffTime = Math.abs(this.schedule.returnDate - this.schedule.pickupDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return { days: diffDays, hours: diffHours };
  }
  return { days: 0, hours: 0 };
});

// Method to get booking summary
bookingSchema.methods.getSummary = function() {
  return {
    id: this._id,
    bookingNumber: this.bookingNumber,
    customer: this.customer,
    vehicle: this.vehicle,
    pickupLocation: this.pickupLocation,
    dropLocation: this.dropLocation,
    schedule: this.schedule,
    pricing: this.pricing,
    status: this.status,
    payment: this.payment,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Booking', bookingSchema);
