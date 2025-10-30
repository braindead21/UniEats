const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, orderId } = req.body;

    // Validate required fields
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: currency,
      receipt: receipt || `order_${orderId}`,
      notes: {
        orderId: orderId,
        userId: req.user.id,
        orderNumber: order.orderNumber
      }
    });

    // Update order with Razorpay order ID
    order.paymentInfo.razorpay = {
      orderId: razorpayOrder.id
    };
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify-payment
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'All payment details are required'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Payment verification failed
      order.paymentInfo.status = 'failed';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Payment verified successfully - Update order
    order.paymentInfo.razorpay = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    };
    order.paymentInfo.status = 'completed';
    order.paymentInfo.paidAt = Date.now();
    order.paymentInfo.transactionId = razorpay_payment_id;
    order.paymentInfo.paymentGateway = 'razorpay';
    
    // Update order status to confirmed
    if (order.status === 'pending') {
      order.status = 'confirmed';
      order.statusHistory.push({
        status: 'confirmed',
        timestamp: Date.now(),
        note: 'Payment completed successfully',
        updatedBy: req.user.id
      });
      order.tracking.orderConfirmed = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentInfo.status,
        orderStatus: order.status
      }
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// @desc    Handle payment failure
// @route   POST /api/payment/payment-failed
// @access  Private
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Update payment status to failed
    order.paymentInfo.status = 'failed';
    order.statusHistory.push({
      status: order.status,
      timestamp: Date.now(),
      note: `Payment failed: ${error || 'Unknown error'}`,
      updatedBy: req.user.id
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        orderId: order._id,
        paymentStatus: order.paymentInfo.status
      }
    });
  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment failure',
      error: error.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:orderId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user or user is admin/restaurant
    if (
      order.user.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      (req.user.role !== 'restaurant_owner' || order.restaurant.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentInfo: order.paymentInfo,
        orderTotal: order.pricing.total,
        orderStatus: order.status
      }
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details',
      error: error.message
    });
  }
};
