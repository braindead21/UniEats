const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { cuisine, search, sortBy = 'rating', order = 'desc' } = req.query;
    
    let query = { isActive: true, isApproved: true };
    
    // Filter by cuisine
    if (cuisine && cuisine !== 'All') {
      query.cuisine = { $in: [cuisine] };
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const restaurants = await Restaurant.find(query)
      .select('-licenseDocument -licenseNumber -owner')
      .sort(sortOptions)
      .populate('menuItems', 'name price category')
      .lean();
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurants'
    });
  }
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .select('-licenseDocument -licenseNumber')
      .populate('menuItems')
      .populate('owner', 'name email phone');
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching restaurant'
    });
  }
});

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private (Restaurant owners)
router.post('/', protect, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    req.body.owner = req.user.id;
    
    const restaurant = await Restaurant.create(req.body);
    
    res.status(201).json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating restaurant'
    });
  }
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (Restaurant owner or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }
    
    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating restaurant'
    });
  }
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (Restaurant owner or admin)
router.delete('/:id', protect, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Check if user owns the restaurant or is admin
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this restaurant'
      });
    }
    
    await restaurant.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting restaurant'
    });
  }
});

// @desc    Search restaurants
// @route   GET /api/restaurants/search/:query
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const restaurants = await Restaurant.find({
      isActive: true,
      isApproved: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { cuisine: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .select('-licenseDocument -licenseNumber -owner')
    .sort({ rating: -1 });
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching restaurants'
    });
  }
});

module.exports = router; 