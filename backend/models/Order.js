const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    customizations: [{
      name: String,
      selectedOption: String,
      additionalPrice: { type: Number, default: 0 }
    }],
    variant: {
      name: String,
      price: Number
    },
    specialInstructions: String,
    subtotal: {
      type: Number,
      required: true
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    platformFee: {
      type: Number,
      default: 0
    },
    discount: {
      amount: { type: Number, default: 0 },
      couponCode: String,
      description: String
    },
    total: {
      type: Number,
      required: true
    }
  },
  deliveryAddress: {
    type: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      landmark: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      }
    },
    required: true
  },
  status: {
    type: String,
    enum: [
      'pending',           // Order placed, waiting for restaurant confirmation
      'confirmed',         // Restaurant confirmed the order
      'preparing',         // Restaurant is preparing the order
      'ready_for_pickup',  // Order is ready for pickup
      'picked_up',         // Delivery partner picked up the order
      'out_for_delivery',  // Order is out for delivery
      'delivered',         // Order has been delivered
      'cancelled',         // Order was cancelled
      'rejected'           // Restaurant rejected the order
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  deliveryPartner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  preparationTime: {
    estimated: Number, // in minutes
    actual: Number     // in minutes
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentGateway: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date,
    refundAmount: Number
  },
  specialInstructions: {
    type: String,
    maxlength: [200, 'Special instructions cannot be more than 200 characters']
  },
  rating: {
    food: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'restaurant', 'admin', 'system']
    },
    cancelledAt: Date,
    refundAmount: Number
  },
  tracking: {
    orderPlaced: Date,
    orderConfirmed: Date,
    preparationStarted: Date,
    readyForPickup: Date,
    pickedUp: Date,
    outForDelivery: Date,
    delivered: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ deliveryPartner: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "deliveryAddress.coordinates": "2dsphere" });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `UE${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Virtual for order duration
orderSchema.virtual('orderDuration').get(function() {
  if (this.tracking.delivered && this.tracking.orderPlaced) {
    return this.tracking.delivered - this.tracking.orderPlaced;
  }
  return null;
});

// Virtual for preparation duration
orderSchema.virtual('actualPreparationDuration').get(function() {
  if (this.tracking.readyForPickup && this.tracking.preparationStarted) {
    return Math.ceil((this.tracking.readyForPickup - this.tracking.preparationStarted) / (1000 * 60)); // in minutes
  }
  return null;
});

// Virtual for delivery duration
orderSchema.virtual('deliveryDuration').get(function() {
  if (this.tracking.delivered && this.tracking.pickedUp) {
    return Math.ceil((this.tracking.delivered - this.tracking.pickedUp) / (1000 * 60)); // in minutes
  }
  return null;
});

// Method to update status and add to history
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy
  });
  
  // Update tracking timestamps
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.tracking.orderConfirmed = now;
      break;
    case 'preparing':
      this.tracking.preparationStarted = now;
      break;
    case 'ready_for_pickup':
      this.tracking.readyForPickup = now;
      break;
    case 'picked_up':
      this.tracking.pickedUp = now;
      break;
    case 'out_for_delivery':
      this.tracking.outForDelivery = now;
      break;
    case 'delivered':
      this.tracking.delivered = now;
      this.actualDeliveryTime = now;
      break;
  }
  
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
