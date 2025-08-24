const express = require('express');
const { protect, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, requireAdmin);

// @desc    Get admin dashboard overview
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts for each user type
    const studentCount = await User.countDocuments({ role: 'student' });
    const restaurantOwnerCount = await User.countDocuments({ role: 'restaurant_owner' });
    const deliveryPartnerCount = await User.countDocuments({ role: 'delivery_partner' });
    
    // Get order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    // Get today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' }
        }
      }
    ]);
    
    // Get restaurant count
    const restaurantCount = await Restaurant.countDocuments();
    const activeDeliveryPartners = await User.countDocuments({
      role: 'delivery_partner',
      'deliveryPartnerInfo.isAvailable': true
    });
    
    // Recent activities
    const recentOrders = await Order.find()
      .populate('restaurant', 'name')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: {
            students: studentCount,
            restaurantOwners: restaurantOwnerCount,
            deliveryPartners: deliveryPartnerCount,
            total: studentCount + restaurantOwnerCount + deliveryPartnerCount
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            delivered: deliveredOrders,
            today: todayOrders
          },
          revenue: {
            today: todayRevenue[0]?.total || 0
          },
          restaurants: restaurantCount,
          activeDeliveryPartners
        },
        recentActivities: {
          orders: recentOrders,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    
    let query = {};
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// @desc    Get user details by ID
// @route   GET /api/admin/users/:userId
// @access  Private (Admin)
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's orders if student
    let orders = [];
    if (user.role === 'student') {
      orders = await Order.find({ user: user._id })
        .populate('restaurant', 'name')
        .sort({ createdAt: -1 })
        .limit(10);
    }
    
    // Get restaurant if restaurant owner
    let restaurant = null;
    if (user.role === 'restaurant_owner' && user.restaurantInfo.restaurantId) {
      restaurant = await Restaurant.findById(user.restaurantInfo.restaurantId);
    }
    
    res.status(200).json({
      success: true,
      data: {
        user,
        orders,
        restaurant
      }
    });
  } catch (error) {
    console.error('User details fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user details'
    });
  }
});

// @desc    Update user status (activate/deactivate)
// @route   PUT /api/admin/users/:userId/status
// @access  Private (Admin)
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.userId;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status'
    });
  }
});

// @desc    Get all orders with filtering
// @route   GET /api/admin/orders
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const { status, restaurant, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    if (restaurant) {
      query.restaurant = restaurant;
    }
    
    const orders = await Order.find(query)
      .populate('restaurant', 'name')
      .populate('user', 'name email phone')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders'
    });
  }
});

// @desc    Get all restaurants
// @route   GET /api/admin/restaurants
// @access  Private (Admin)
router.get('/restaurants', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const restaurants = await Restaurant.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Restaurant.countDocuments();
    
    res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: restaurants
    });
  } catch (error) {
    console.error('Restaurants fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurants'
    });
  }
});

// @desc    Update restaurant status
// @route   PUT /api/admin/restaurants/:restaurantId/status
// @access  Private (Admin)
router.put('/restaurants/:restaurantId/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const restaurantId = req.params.restaurantId;
    
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isActive },
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Restaurant ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: restaurant
    });
  } catch (error) {
    console.error('Restaurant status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating restaurant status'
    });
  }
});

// @desc    Create new admin user
// @route   POST /api/admin/create-admin
// @access  Private (Admin)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating admin user'
    });
  }
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let dateRange = {};
    const now = new Date();
    
    switch (period) {
      case '7days':
        dateRange = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        break;
      case '30days':
        dateRange = { $gte: new Date(now.setDate(now.getDate() - 30)) };
        break;
      case '3months':
        dateRange = { $gte: new Date(now.setMonth(now.getMonth() - 3)) };
        break;
      default:
        dateRange = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    }
    
    // Order analytics
    const orderAnalytics = await Order.aggregate([
      { $match: { createdAt: dateRange } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);
    
    // Top restaurants
    const topRestaurants = await Order.aggregate([
      { $match: { createdAt: dateRange } },
      {
        $group: {
          _id: '$restaurant',
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: '_id',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      { $unwind: '$restaurant' },
      { $sort: { orders: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        orderTrends: orderAnalytics,
        topRestaurants
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
});

module.exports = router;
