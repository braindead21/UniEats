const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// Place an order
router.post('/', optionalAuth, async (req, res) => {
  try {
    console.log('Order request received:', JSON.stringify(req.body, null, 2));
    const {
      items,
      restaurantId,
      deliveryAddress,
      paymentMethod,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required and must be a non-empty array'
      });
    }

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID is required'
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Verify and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      console.log('Processing item:', item);
      // Find the menu item
      const menuItem = await MenuItem.findById(item.menuItemId);
      console.log('Found menu item:', menuItem);
      if (!menuItem) {
        console.log('Menu item not found:', item.menuItemId);
        return res.status(404).json({
          success: false,
          message: `Menu item with ID ${item.menuItemId} not found`
        });
      }

      // Verify the item belongs to the restaurant
      if (menuItem.restaurant.toString() !== restaurantId) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${menuItem.name} does not belong to the selected restaurant`
        });
      }

      // Calculate item subtotal
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        customizations: item.customizations || [],
        variant: item.variant || null,
        specialInstructions: item.specialInstructions || '',
        subtotal: itemSubtotal
      });
    }

    // Calculate pricing
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const deliveryFee = subtotal > 300 ? 0 : 40; // Free delivery above ₹300
    const platformFee = Math.round(subtotal * 0.02); // 2% platform fee
    const total = subtotal + tax + deliveryFee + platformFee;

    // Generate unique order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create order
    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : null, // Allow null for guest orders
      restaurant: restaurantId,
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        deliveryFee,
        platformFee,
        total
      },
      deliveryAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      specialInstructions: specialInstructions || '',
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      tracking: {
        orderPlaced: new Date()
      }
    });

    // Add initial status to history
    order.statusHistory.push({
      status: 'pending',
      note: 'Order placed successfully',
      updatedBy: req.user ? req.user._id : null // Allow null for guest orders
    });

    await order.save();

    // Populate order details for response
    await order.populate([
      { path: 'restaurant', select: 'name cuisine address phone' },
      { path: 'items.menuItem', select: 'name category image' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: order
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
});

// Get user orders
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(filter)
      .populate('restaurant', 'name cuisine address phone image')
      .populate('items.menuItem', 'name category image')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    })
    .populate('restaurant', 'name cuisine address phone image')
    .populate('items.menuItem', 'name category image description')
    .populate('deliveryPartner', 'name phone')
    .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Cancel order
router.patch('/:orderId/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed', 'preparing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    await order.updateStatus('cancelled', reason || 'Cancelled by user', req.user._id);
    
    // Set cancellation info
    order.cancellation = {
      reason: reason || 'Cancelled by user',
      cancelledBy: 'user',
      cancelledAt: new Date(),
      refundAmount: order.paymentInfo.status === 'completed' ? order.pricing.total : 0
    };

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

// Rate order (after delivery)
router.patch('/:orderId/rate', protect, async (req, res) => {
  try {
    const { foodRating, deliveryRating, overallRating, review } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
      status: 'delivered'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not yet delivered'
      });
    }

    if (order.rating.ratedAt) {
      return res.status(400).json({
        success: false,
        message: 'Order has already been rated'
      });
    }

    // Update rating
    order.rating = {
      food: foodRating,
      delivery: deliveryRating,
      overall: overallRating,
      review: review || '',
      ratedAt: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Order rated successfully',
      order
    });

  } catch (error) {
    console.error('Error rating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating order',
      error: error.message
    });
  }
});

// Restaurant routes (for restaurant owners)

// Get restaurant orders
router.get('/restaurant/:restaurantId', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const restaurantId = req.params.restaurantId;

    // Verify user owns this restaurant or is admin
    if (req.user.role !== 'admin') {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not the owner of this restaurant.'
        });
      }
    }

    // Build filter
    const filter = { restaurant: restaurantId };
    if (status) {
      filter.status = status;
    }

    // Get orders
    const orders = await Order.find(filter)
      .populate('user', 'name phone')
      .populate('items.menuItem', 'name category')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant orders',
      error: error.message
    });
  }
});

// Update order status (for restaurant)
router.patch('/:orderId/status', protect, async (req, res) => {
  try {
    const { status, note, estimatedTime } = req.body;

    const order = await Order.findById(req.params.orderId).populate('restaurant');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user can update this order
    if (req.user.role !== 'admin' && order.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'rejected'],
      'confirmed': ['preparing'],
      'preparing': ['ready_for_pickup'],
      'ready_for_pickup': ['picked_up'],
      'picked_up': ['out_for_delivery'],
      'out_for_delivery': ['delivered']
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    // Update estimated time if provided
    if (estimatedTime && status === 'confirmed') {
      order.estimatedDeliveryTime = new Date(Date.now() + estimatedTime * 60 * 1000);
    }

    // Update status
    await order.updateStatus(status, note || '', req.user._id);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

module.exports = router; 