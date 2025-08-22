const mongoose = require('mongoose');
const slugify = require('slugify');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a menu item name'],
    trim: true,
    maxlength: [100, 'Menu item name cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discounted price must be less than original price'
    }
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Appetizers',
      'Main Course',
      'Desserts',
      'Beverages',
      'Pizzas',
      'Burgers',
      'Biryani',
      'Rolls',
      'Sandwiches',
      'Snacks',
      'Chinese',
      'South Indian',
      'North Indian',
      'Continental',
      'Salads',
      'Soups',
      'Ice Cream',
      'Cakes',
      'Juices',
      'Coffee',
      'Tea',
      'Shakes'
    ]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    alt: String
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    default: 'Medium'
  },
  allergens: [{
    type: String,
    enum: ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Shellfish', 'Fish']
  }],
  ingredients: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number, // in grams
    carbs: Number,   // in grams
    fat: Number,     // in grams
    fiber: Number,   // in grams
    sugar: Number    // in grams
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stockQuantity: {
    type: Number,
    default: null // null means unlimited
  },
  soldCount: {
    type: Number,
    default: 0
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
  tags: [String],
  customizations: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      name: String,
      price: Number, // additional price
      isDefault: { type: Boolean, default: false }
    }],
    isRequired: { type: Boolean, default: false },
    maxSelections: { type: Number, default: 1 }
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    isDefault: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
menuItemSchema.index({ restaurant: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text', category: 'text' });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ rating: -1 });
menuItemSchema.index({ soldCount: -1 });

// Create menu item slug from the name
menuItemSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual for final price (considering discount)
menuItemSchema.virtual('finalPrice').get(function() {
  return this.discountedPrice || this.price;
});

// Virtual for discount percentage
menuItemSchema.virtual('discountPercentage').get(function() {
  if (!this.discountedPrice) return 0;
  return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
});

// Virtual populate for reviews
menuItemSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'menuItem',
  justOne: false
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
