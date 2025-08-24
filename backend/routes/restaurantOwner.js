const express = require('express');
const { protect, requireRestaurantOwner } = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// All routes require authentication and restaurant owner role
router.use(protect, requireRestaurantOwner);

// @desc    Get restaurant owner dashboard data
// @route   GET /api/restaurant-owner/dashboard
// @access  Private (Restaurant Owner)
router.get('/dashboard', async (req, res) => {
  try {
    const restaurantId = req.user.restaurantInfo.restaurantId;
    
    // Get restaurant info
    const restaurant = await Restaurant.findById(restaurantId);
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayOrders = await Order.find({
      restaurant: restaurantId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('items.menuItem', 'name');
    
    // Get pending orders
    const pendingOrders = await Order.find({
      restaurant: restaurantId,
      status: 'pending'
    }).populate('items.menuItem', 'name');
    
    // Calculate today's revenue
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.pricing.total, 0);
    
    // Get monthly stats
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyOrders = await Order.find({
      restaurant: restaurantId,
      createdAt: { $gte: monthStart }
    });
    
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.pricing.total, 0);
    
    res.status(200).json({
      success: true,
      data: {
        restaurant,
        stats: {
          todayOrders: todayOrders.length,
          pendingOrders: pendingOrders.length,
          todayRevenue,
          monthlyOrders: monthlyOrders.length,
          monthlyRevenue
        },
        recentOrders: todayOrders.slice(-10) // Last 10 orders
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @desc    Get all orders for restaurant
// @route   GET /api/restaurant-owner/orders
// @access  Private (Restaurant Owner)
router.get('/orders', async (req, res) => {
  try {
    const restaurantId = req.user.restaurantInfo.restaurantId;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { restaurant: restaurantId };
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('items.menuItem', 'name price')
      .populate('user', 'name phone')
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

// @desc    Update order status
// @route   PUT /api/restaurant-owner/orders/:orderId/status
// @access  Private (Restaurant Owner)
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const restaurantId = req.user.restaurantInfo.restaurantId;
    
    const order = await Order.findOne({
      _id: orderId,
      restaurant: restaurantId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    order.status = status;
    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      updatedBy: req.user._id,
      timestamp: new Date()
    });
    
    if (status === 'confirmed') {
      order.tracking.confirmed = new Date();
    } else if (status === 'preparing') {
      order.tracking.preparing = new Date();
    } else if (status === 'ready_for_pickup') {
      order.tracking.readyForPickup = new Date();
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status'
    });
  }
});

// @desc    Get menu items for restaurant
// @route   GET /api/restaurant-owner/menu
// @access  Private (Restaurant Owner)
router.get('/menu', async (req, res) => {
  try {
    const restaurantId = req.user.restaurantInfo.restaurantId;
    
    const menuItems = await MenuItem.find({ restaurant: restaurantId })
      .sort({ category: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching menu'
    });
  }
});

// @desc    Update menu item availability
// @route   PUT /api/restaurant-owner/menu/:itemId/availability
// @access  Private (Restaurant Owner)
router.put('/menu/:itemId/availability', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { available } = req.body;
    const restaurantId = req.user.restaurantInfo.restaurantId;
    
    const menuItem = await MenuItem.findOne({
      _id: itemId,
      restaurant: restaurantId
    });
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    menuItem.available = available;
    await menuItem.save();
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Menu item update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating menu item'
    });
  }
});

module.exports = router;
