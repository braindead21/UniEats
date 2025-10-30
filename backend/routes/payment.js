const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Payment routes
router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify-payment', paymentController.verifyRazorpayPayment);
router.post('/payment-failed', paymentController.handlePaymentFailure);
router.get('/:orderId', paymentController.getPaymentDetails);

module.exports = router;
