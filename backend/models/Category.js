const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  type: {
    type: String,
    enum: ['food', 'cuisine', 'restaurant'],
    required: [true, 'Please specify category type']
  },
  icon: {
    url: String,
    public_id: String,
    alt: String
  },
  image: {
    url: String,
    public_id: String,
    alt: String
  },
  color: {
    type: String,
    default: '#ff6a1a'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  itemCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ sortOrder: 1 });

// Create category slug from the name
categorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual populate for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

module.exports = mongoose.model('Category', categorySchema);
