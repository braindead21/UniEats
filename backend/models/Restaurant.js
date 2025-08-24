const mongoose = require('mongoose');
const slugify = require('slugify');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  cuisine: {
    type: [String],
    required: [true, 'Please add at least one cuisine type'],
    enum: [
      'Indian',
      'Chinese',
      'Italian',
      'Fast Food',
      'Continental',
      'South Indian',
      'North Indian',
      'Mexican',
      'Thai',
      'Japanese',
      'Cafe',
      'Desserts',
      'Beverages'
    ]
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    alt: String
  }],
  coverImage: {
    url: String,
    public_id: String,
    alt: String
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must not be more than 5'],
    default: 4.0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
    },
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
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isCurrentlyOpen: {
    type: Boolean,
    default: false
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  estimatedDeliveryTime: {
    type: Number, // in minutes
    default: 30
  },
  tags: [String],
  licenseNumber: {
    type: String,
    default: 'PENDING'
  },
  licenseDocument: {
    type: String, // URL to uploaded license document
    default: 'pending-upload'
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for geospatial queries
restaurantSchema.index({ "address.coordinates": "2dsphere" });
restaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

// Create restaurant slug from the name
restaurantSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual populate for menu items
restaurantSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'restaurant',
  justOne: false
});

// Virtual populate for reviews
restaurantSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'restaurant',
  justOne: false
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
