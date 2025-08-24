const express = require('express');
const { protect, requireDeliveryPartner } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication and delivery partner role
router.use(protect, requireDeliveryPartner);

// @desc    Get delivery partner dashboard
// @route   GET /api/delivery-partner/dashboard
// @access  Private (Delivery Partner)
router.get('/dashboard', async (req, res) => {
  try {
    const partnerId = req.user._id;
    
    // Get today's deliveries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayDeliveries = await Order.find({
      deliveryPartner: partnerId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).populate('restaurant', 'name');
    
    // Get current deliveries (assigned but not delivered)
    const currentDeliveries = await Order.find({
      deliveryPartner: partnerId,
      status: { $in: ['out_for_delivery', 'ready_for_pickup'] }
    }).populate('restaurant', 'name');
    
    // Calculate today's earnings
    const todayEarnings = todayDeliveries
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + (order.deliveryFee || 40), 0);
    
    // Get monthly stats
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyDeliveries = await Order.find({
      deliveryPartner: partnerId,
      createdAt: { $gte: monthStart },
      status: 'delivered'
    });
    
    const monthlyEarnings = monthlyDeliveries.reduce((sum, order) => sum + (order.deliveryFee || 40), 0);
    
    res.status(200).json({
      success: true,
      data: {
        partnerInfo: req.user.deliveryPartnerInfo,
        stats: {
          todayDeliveries: todayDeliveries.filter(o => o.status === 'delivered').length,
          currentDeliveries: currentDeliveries.length,
          todayEarnings,
          monthlyDeliveries: monthlyDeliveries.length,
          monthlyEarnings,
          isAvailable: req.user.deliveryPartnerInfo.isAvailable
        },
        currentOrders: currentDeliveries
      }
    });
  } catch (error) {
    console.error('Delivery partner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @desc    Toggle availability status
// @route   PUT /api/delivery-partner/availability
// @access  Private (Delivery Partner)
router.put('/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      'deliveryPartnerInfo.isAvailable': isAvailable
    });
    
    res.status(200).json({
      success: true,
      message: `Status updated to ${isAvailable ? 'available' : 'unavailable'}`,
      isAvailable
    });
  } catch (error) {
    console.error('Availability update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating availability'
    });
  }
});

// @desc    Get available orders for delivery
// @route   GET /api/delivery-partner/available-orders
// @access  Private (Delivery Partner)
router.get('/available-orders', async (req, res) => {
  try {
    const partnerZones = req.user.deliveryPartnerInfo.deliveryZones;
    
    // Find orders that are ready for pickup and in partner's zones
    const availableOrders = await Order.find({
      status: 'ready_for_pickup',
      deliveryPartner: null,
      // Add zone filtering logic here based on delivery address
    })
    .populate('restaurant', 'name address')
    .populate('user', 'name phone')
    .sort({ createdAt: 1 }); // Oldest first
    
    res.status(200).json({
      success: true,
      count: availableOrders.length,
      data: availableOrders
    });
  } catch (error) {
    console.error('Available orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available orders'
    });
  }
});

// @desc    Accept delivery order
// @route   POST /api/delivery-partner/accept-order/:orderId
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
    order.status = 'out_for_delivery';
    order.tracking.pickedUp = new Date();
    order.statusHistory.push({
      status: 'out_for_delivery',
      note: 'Order picked up by delivery partner',
      updatedBy: partnerId,
      timestamp: new Date()
    });
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order accepted successfully',
      data: order
    });
  } catch (error) {
    console.error('Order acceptance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting order'
    });
  }
});

// @desc    Mark order as delivered
// @route   PUT /api/delivery-partner/complete-delivery/:orderId
// @access  Private (Delivery Partner)
router.put('/complete-delivery/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.user._id;
    const { deliveryNote } = req.body;
    
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
    
    if (order.status !== 'out_for_delivery') {
      return res.status(400).json({
        success: false,
        message: 'Order is not out for delivery'
      });
    }
    
    // Mark as delivered
    order.status = 'delivered';
    order.tracking.delivered = new Date();
    order.statusHistory.push({
      status: 'delivered',
      note: deliveryNote || 'Order delivered successfully',
      updatedBy: partnerId,
      timestamp: new Date()
    });
    
    await order.save();
    
    // Update delivery partner stats
    await User.findByIdAndUpdate(partnerId, {
      $inc: {
        'deliveryPartnerInfo.totalDeliveries': 1,
        'deliveryPartnerInfo.earnings.total': order.pricing.deliveryFee || 40,
        'deliveryPartnerInfo.earnings.thisMonth': order.pricing.deliveryFee || 40
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Order marked as delivered',
      data: order
    });
  } catch (error) {
    console.error('Delivery completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing delivery'
    });
  }
});

// @desc    Get delivery history
// @route   GET /api/delivery-partner/history
// @access  Private (Delivery Partner)
router.get('/history', async (req, res) => {
  try {
    const partnerId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    
    const deliveries = await Order.find({
      deliveryPartner: partnerId
    })
    .populate('restaurant', 'name')
    .populate('user', 'name phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Order.countDocuments({
      deliveryPartner: partnerId
    });
    
    res.status(200).json({
      success: true,
      count: deliveries.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: deliveries
    });
  } catch (error) {
    console.error('Delivery history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching delivery history'
    });
  }
});

// @desc    Update current location
// @route   PUT /api/delivery-partner/location
// @access  Private (Delivery Partner)
router.put('/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const partnerId = req.user._id;
    
    await User.findByIdAndUpdate(partnerId, {
      'deliveryPartnerInfo.currentLocation': {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating location'
    });
  }
});

module.exports = router;
