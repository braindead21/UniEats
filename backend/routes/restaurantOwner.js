const express = require('express');
const { protect, requireRestaurantOwner } = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// All routes require authentication and restaurant owner role
router.use(protect, requireRestaurantOwner);

// @desc    Get restaurant owner dashboard stats
// @route   GET /api/restaurant-owner/stats
// @access  Private (Restaurant Owner)
router.get('/stats', async (req, res) => {
  try {
    const restaurantId = req.user.restaurantInfo?.restaurantId;
    
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID not found in user profile'
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all orders for this restaurant
    const allOrders = await Order.find({ restaurant: restaurantId });
    
    // Get today's orders
    const todayOrders = await Order.find({
      restaurant: restaurantId,
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    // Get pending orders
    const pendingOrders = await Order.find({
      restaurant: restaurantId,
      status: 'pending'
    });
    
    // Calculate revenue
    const totalRevenue = allOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
      
    const todayRevenue = todayOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
    
    // Calculate average rating (dummy for now)
    const averageRating = 4.3;
    
    res.status(200).json({
      success: true,
      stats: {
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length,
        totalRevenue,
        todayRevenue,
        averageRating,
        pendingOrders: pendingOrders.length
      }
    });
  } catch (error) {
    console.error('Restaurant stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurant stats'
    });
  }
});

// @desc    Get all orders for restaurant
// @route   GET /api/restaurant-owner/orders
// @access  Private (Restaurant Owner)
router.get('/orders', async (req, res) => {
  try {
    const restaurantId = req.user.restaurantInfo?.restaurantId;
    
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID not found in user profile'
      });
    }
    
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { restaurant: restaurantId };
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      orders: orders,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
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
    const restaurantId = req.user.restaurantInfo?.restaurantId;
    
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID not found in user profile'
      });
    }
    
    const menuItems = await MenuItem.find({ restaurant: restaurantId })
      .sort({ category: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      count: menuItems.length,
      menu: menuItems
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
    const restaurantId = req.user.restaurantInfo?.restaurantId;
    
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID not found in user profile'
      });
    }
    
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
    
    menuItem.isAvailable = available;
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
