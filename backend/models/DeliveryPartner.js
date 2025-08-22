const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  documents: {
    collegeId: {
      url: { type: String, required: true },
      public_id: String,
      verified: { type: Boolean, default: false }
    },
    profilePhoto: {
      url: { type: String, required: true },
      public_id: String,
      verified: { type: Boolean, default: false }
    },
    aadhaarCard: {
      url: String,
      public_id: String,
      verified: { type: Boolean, default: false }
    },
    panCard: {
      url: String,
      public_id: String,
      verified: { type: Boolean, default: false }
    }
  },
  vehicleInfo: {
    type: {
      type: String,
      enum: ['bicycle', 'motorcycle', 'scooter', 'car'],
      required: [true, 'Please specify vehicle type']
    },
    registrationNumber: String,
    insuranceDocument: {
      url: String,
      public_id: String,
      expiryDate: Date
    },
    licenseDocument: {
      url: String,
      public_id: String,
      expiryDate: Date
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Please add emergency contact name']
    },
    relationship: {
      type: String,
      required: [true, 'Please specify relationship']
    },
    phone: {
      type: String,
      required: [true, 'Please add emergency contact phone']
    }
  },
  availability: {
    isOnline: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    lastLocationUpdate: Date,
    workingHours: {
      monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      saturday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
      sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } }
    }
  },
  performance: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    completedDeliveries: {
      type: Number,
      default: 0
    },
    cancelledDeliveries: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    onTimeDeliveries: {
      type: Number,
      default: 0
    },
    averageDeliveryTime: {
      type: Number,
      default: 0 // in minutes
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    thisMonthEarnings: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 100
    },
    onTimeRate: {
      type: Number,
      default: 100
    }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
    upiId: String
  },
  currentOrder: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    default: null
  },
  workingArea: {
    type: String,
    required: [true, 'Please specify working area/campus']
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  earnings: {
    today: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    allTime: { type: Number, default: 0 }
  },
  incentives: [{
    type: String,
    amount: Number,
    description: String,
    earnedAt: Date
  }],
  violations: [{
    type: {
      type: String,
      enum: ['late_delivery', 'order_damaged', 'inappropriate_behavior', 'fake_delivery']
    },
    description: String,
    reportedAt: Date,
    severity: {
      type: String,
      enum: ['minor', 'major', 'critical']
    },
    action: String
  }],
  reasonForRejection: String,
  rejectedAt: Date,
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
deliveryPartnerSchema.index({ "availability.currentLocation": "2dsphere" });
deliveryPartnerSchema.index({ applicationStatus: 1 });
deliveryPartnerSchema.index({ "availability.isOnline": 1 });
deliveryPartnerSchema.index({ workingArea: 1 });
deliveryPartnerSchema.index({ "performance.averageRating": -1 });

// Calculate completion rate before saving
deliveryPartnerSchema.pre('save', function(next) {
  if (this.performance.totalDeliveries > 0) {
    this.performance.completionRate = 
      (this.performance.completedDeliveries / this.performance.totalDeliveries) * 100;
    
    this.performance.onTimeRate = 
      (this.performance.onTimeDeliveries / this.performance.completedDeliveries) * 100;
  }
  next();
});

// Virtual for partner status
deliveryPartnerSchema.virtual('isAvailable').get(function() {
  return this.applicationStatus === 'approved' && 
         this.availability.isOnline && 
         !this.currentOrder;
});

// Method to update location
deliveryPartnerSchema.methods.updateLocation = function(longitude, latitude) {
  this.availability.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
  this.availability.lastLocationUpdate = new Date();
  this.lastActiveAt = new Date();
  return this.save();
};

// Method to toggle online status
deliveryPartnerSchema.methods.toggleOnlineStatus = function() {
  this.availability.isOnline = !this.availability.isOnline;
  this.lastActiveAt = new Date();
  return this.save();
};

// Method to assign order
deliveryPartnerSchema.methods.assignOrder = function(orderId) {
  this.currentOrder = orderId;
  return this.save();
};

// Method to complete order
deliveryPartnerSchema.methods.completeOrder = function(deliveryTime, rating = null) {
  this.performance.totalDeliveries += 1;
  this.performance.completedDeliveries += 1;
  
  if (rating) {
    const totalRatingPoints = this.performance.averageRating * this.performance.totalRatings + rating;
    this.performance.totalRatings += 1;
    this.performance.averageRating = totalRatingPoints / this.performance.totalRatings;
  }
  
  // Update average delivery time
  const totalTime = this.performance.averageDeliveryTime * (this.performance.completedDeliveries - 1) + deliveryTime;
  this.performance.averageDeliveryTime = totalTime / this.performance.completedDeliveries;
  
  this.currentOrder = null;
  return this.save();
};

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
