const express = require('express');
const { protect, requireDeliveryPartner } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication and delivery partner role
router.use(protect, requireDeliveryPartner);

// @desc    Get delivery partner stats
// @route   GET /api/deliveryPartner/stats
// @access  Private (Delivery Partner)
router.get('/stats', async (req, res) => {
  try {
    const partnerId = req.user._id;
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get all deliveries for this partner
    const allDeliveries = await Order.find({
      deliveryPartner: partnerId,
      status: 'delivered'
    });
    
    // Get today's deliveries
    const todayDeliveries = await Order.find({
      deliveryPartner: partnerId,
      status: 'delivered',
      'tracking.delivered': { $gte: today, $lt: tomorrow }
    });
    
    // Calculate earnings
    const totalEarnings = allDeliveries.reduce((sum, order) => sum + (order.deliveryFee || 40), 0);
    const todayEarnings = todayDeliveries.reduce((sum, order) => sum + (order.deliveryFee || 40), 0);
    
    // Calculate rating (dummy for now)
    const currentRating = 4.5; // This would be calculated from actual ratings
    
    res.status(200).json({
      success: true,
      stats: {
        totalDeliveries: allDeliveries.length,
        todayDeliveries: todayDeliveries.length,
        totalEarnings,
        todayEarnings,
        currentRating,
        completedOrders: allDeliveries.length
      }
    });
  } catch (error) {
    console.error('Delivery partner stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats'
    });
  }
});

// @desc    Get available orders for delivery
// @route   GET /api/deliveryPartner/available-orders
// @access  Private (Delivery Partner)
router.get('/available-orders', async (req, res) => {
  try {
    // Find orders that are ready for pickup and not assigned
    const availableOrders = await Order.find({
      status: 'ready_for_pickup',
      deliveryPartner: null
    })
    .populate('restaurant', 'name address')
    .populate('user', 'name phone')
    .sort({ createdAt: 1 }); // Oldest first
    
    res.status(200).json({
      success: true,
      orders: availableOrders
    });
  } catch (error) {
    console.error('Available orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available orders'
    });
  }
});

// @desc    Get my deliveries
// @route   GET /api/deliveryPartner/my-deliveries
// @access  Private (Delivery Partner)
router.get('/my-deliveries', async (req, res) => {
  try {
    const partnerId = req.user._id;
    
    const myDeliveries = await Order.find({
      deliveryPartner: partnerId,
      status: { $in: ['picked_up', 'out_for_delivery', 'delivered'] }
    })
    .populate('restaurant', 'name address')
    .populate('user', 'name phone')
    .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      deliveries: myDeliveries
    });
  } catch (error) {
    console.error('My deliveries fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching deliveries'
    });
  }
});

// @desc    Get earnings history
// @route   GET /api/deliveryPartner/earnings
// @access  Private (Delivery Partner)
router.get('/earnings', async (req, res) => {
  try {
    const partnerId = req.user._id;
    
    const deliveredOrders = await Order.find({
      deliveryPartner: partnerId,
      status: 'delivered'
    })
    .sort({ 'tracking.delivered': -1 })
    .limit(20);
    
    const earnings = deliveredOrders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      amount: order.deliveryFee || 40,
      date: order.tracking.delivered || order.createdAt
    }));
    
    res.status(200).json({
      success: true,
      earnings
    });
  } catch (error) {
    console.error('Earnings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching earnings'
    });
  }
});

// @desc    Toggle online status
// @route   POST /api/deliveryPartner/toggle-online
// @access  Private (Delivery Partner)
router.post('/toggle-online', async (req, res) => {
  try {
    const { isOnline } = req.body;
    const partnerId = req.user._id;
    
    await User.findByIdAndUpdate(partnerId, {
      'deliveryPartnerInfo.isAvailable': isOnline
    });
    
    res.status(200).json({
      success: true,
      message: `Status updated to ${isOnline ? 'online' : 'offline'}`
    });
  } catch (error) {
    console.error('Online status toggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating status'
    });
  }
});

// @desc    Accept delivery order
// @route   POST /api/deliveryPartner/accept-order/:orderId
// @access  Private (Delivery Partner)
router.post('/accept-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.user._id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (order.deliveryPartner) {
      return res.status(400).json({
        success: false,
        message: 'Order already assigned to another partner'
      });
    }
    
    if (order.status !== 'ready_for_pickup') {
      return res.status(400).json({
        success: false,
        message: 'Order is not ready for pickup'
      });
    }
    
    // Assign order to delivery partner
    order.deliveryPartner = partnerId;
    order.status = 'picked_up';
    if (!order.tracking) {
      order.tracking = {};
    }
    order.tracking.pickedUp = new Date();
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order accepted successfully'
    });
  } catch (error) {
    console.error('Order acceptance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting order'
    });
  }
});

// @desc    Update delivery status
// @route   PUT /api/deliveryPartner/update-delivery/:orderId
// @access  Private (Delivery Partner)
router.put('/update-delivery/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const partnerId = req.user._id;
    
    const order = await Order.findOne({
      _id: orderId,
      deliveryPartner: partnerId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to you'
      });
    }
    
    // Update order status
    order.status = status;
    if (!order.tracking) {
      order.tracking = {};
    }
    
    switch (status) {
      case 'picked_up':
        order.tracking.pickedUp = new Date();
        break;
      case 'out_for_delivery':
        order.tracking.outForDelivery = new Date();
        break;
      case 'delivered':
        order.tracking.delivered = new Date();
        break;
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully'
    });
  } catch (error) {
    console.error('Delivery status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating delivery status'
    });
  }
});

module.exports = router;
