import { api } from './api';

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script already exists
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (orderId, amount) => {
  try {
    const response = await api.post('/payment/create-order', {
      orderId,
      amount,
      currency: 'INR'
    });

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create payment order');
    }
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    throw error;
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await api.post('/payment/verify-payment', paymentData);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    throw error;
  }
};

// Handle payment failure
export const handlePaymentFailure = async (orderId, error) => {
  try {
    const response = await api.post('/payment/payment-failed', {
      orderId,
      error
    });

    return response;
  } catch (err) {
    console.error('Handle payment failure error:', err);
    throw err;
  }
};

// Initialize Razorpay checkout
export const initiateRazorpayPayment = async (orderId, amount, userInfo) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
    }

    // Create Razorpay order
    const orderData = await createRazorpayOrder(orderId, amount);

    // Configure Razorpay options
    const options = {
      key: orderData.key, // Razorpay Key ID from backend
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      name: 'UniEats',
      description: `Order Payment - Order ID: ${orderId}`,
      image: '/logo.png', // Your logo URL
      order_id: orderData.razorpayOrderId,
      handler: async function (response) {
        try {
          // Payment successful - verify on backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderId
          };

          const verificationResult = await verifyRazorpayPayment(verificationData);
          
          // Show success message
          alert(`Payment successful! Order ${verificationResult.orderNumber} confirmed.`);
          
          // Redirect to orders page or show success modal
          window.location.href = '/orders';
          
          return verificationResult;
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed. Please contact support.');
          throw error;
        }
      },
      prefill: {
        name: userInfo.name || '',
        email: userInfo.email || '',
        contact: userInfo.phone || ''
      },
      notes: {
        orderId: orderId
      },
      theme: {
        color: '#ff6b1a' // Your brand color
      },
      modal: {
        ondismiss: async function() {
          // Payment modal closed without completing payment
          console.log('Payment cancelled by user');
          await handlePaymentFailure(orderId, 'Payment cancelled by user');
          alert('Payment was cancelled. You can retry payment from your orders page.');
        }
      }
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', async function (response) {
      console.error('Payment failed:', response.error);
      
      // Handle payment failure
      await handlePaymentFailure(orderId, response.error.description || 'Payment failed');
      
      alert(`Payment failed: ${response.error.description || 'Unknown error'}. Please try again.`);
    });

    razorpay.open();
  } catch (error) {
    console.error('Razorpay payment initiation error:', error);
    throw error;
  }
};

// Get payment details for an order
export const getPaymentDetails = async (orderId) => {
  try {
    const response = await api.get(`/payment/${orderId}`);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get payment details');
    }
  } catch (error) {
    console.error('Get payment details error:', error);
    throw error;
  }
};

export default {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  initiateRazorpayPayment,
  getPaymentDetails
};
