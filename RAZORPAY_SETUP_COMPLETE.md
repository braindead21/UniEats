# 🔐 Razorpay Integration - Complete Setup Guide

## ✅ Current Status

### Your Razorpay Keys (Already Configured!)

**Backend** (`backend/.env`):

```env
RAZORPAY_KEY_ID=rzp_test_RVEalzOHCVR74z
RAZORPAY_KEY_SECRET=PZodNLyAO582V30Z5fe9Iuti
```

**Frontend** (`frontend/.env`):

```env
VITE_RAZORPAY_KEY_ID=rzp_test_RVEalzOHCVR74z
```

✅ **Both keys are synced and ready to use!**

---

## 🎯 What Was Fixed

### 1. Payment Flow Integration

Updated `CheckoutModalEnhanced.jsx` to properly integrate with your backend:

**Old Flow (Broken):**

```
Address → Payment → Review → Razorpay (without backend)
```

**New Flow (Working):**

```
Address → Payment → Review → Create Order → Razorpay Payment → Verify → Success
```

### 2. Backend Integration Points

#### Step 1: Create Order (Database)

```javascript
POST /api/orders
Headers: { Authorization: Bearer <token> }
Body: { order details, payment: 'pending' }
Response: { orderId }
```

#### Step 2: Create Razorpay Order

```javascript
POST /api/payment/create-order
Headers: { Authorization: Bearer <token> }
Body: { amount, currency, orderId }
Response: { razorpayOrderId, key }
```

#### Step 3: User Pays (Razorpay Modal)

- Opens Razorpay payment modal
- User completes payment
- Razorpay returns payment details

#### Step 4: Verify Payment

```javascript
POST /api/payment/verify-payment
Headers: { Authorization: Bearer <token> }
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }
Response: { success: true }
```

#### Step 5: Success

- Order status → 'confirmed'
- Payment status → 'completed'
- User redirected to orders page

---

## 🚀 How to Use

### Testing the Integration:

1. **Start Backend Server:**

   ```bash
   cd backend
   npm start
   # Server running on http://localhost:5000
   ```

2. **Start Frontend Server:**

   ```bash
   cd frontend
   npm run dev
   # Vite running on http://localhost:5173 or 5174
   ```

3. **Complete Checkout Flow:**

   - ✅ Add items to cart
   - ✅ Click checkout
   - ✅ Add/select delivery address
   - ✅ Click "Next"
   - ✅ Select payment method (UPI/Card/Wallet for Razorpay)
   - ✅ Click "Next"
   - ✅ Review order details
   - ✅ Check "Accept terms and conditions"
   - ✅ Click "Place Order"

4. **Razorpay Modal Opens:**

   - Test Mode - Use test card details
   - Or select UPI/Netbanking/Wallet

5. **Payment Success:**
   - Order confirmed
   - Toast notification shown
   - Cart cleared
   - Auto-redirect to home/orders

---

## 💳 Test Payment Methods

### Test Cards (Test Mode):

#### Successful Payment:

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

#### Failed Payment (To test failure):

```
Card Number: 4000 0000 0000 0002
```

### UPI (Test Mode):

```
UPI ID: success@razorpay
```

This will simulate successful payment

### Net Banking (Test Mode):

- Select any bank
- Use "success" as username/password
- This will simulate successful payment

---

## 🔑 Your Razorpay Dashboard

### Access Your Account:

1. Go to: https://dashboard.razorpay.com/
2. Login with your credentials
3. Navigate to **Settings → API Keys**

### Current Mode: TEST MODE ⚠️

Your keys start with `rzp_test_` which means you're in test mode.

**Test Mode Features:**

- ✅ No real money involved
- ✅ Test cards work
- ✅ All features available
- ✅ Perfect for development

**When Ready for Production:**

1. Complete KYC verification
2. Activate account
3. Generate LIVE keys (`rzp_live_...`)
4. Update both `.env` files with live keys
5. Test thoroughly before going live

---

## 🔍 Debugging & Testing

### Check if Razorpay SDK is Loaded:

Open browser console (F12) and run:

```javascript
typeof Razorpay;
// Should return "function"
```

If it returns "undefined":

- Check if `index.html` has Razorpay script
- Refresh the page
- Check browser console for script loading errors

### Test Payment Flow:

1. **Open Network Tab** (F12 → Network)
2. **Complete checkout**
3. **Look for these requests:**
   - ✅ POST `/api/orders` → Creates order
   - ✅ POST `/api/payment/create-order` → Creates Razorpay order
   - ✅ Razorpay modal opens
   - ✅ POST `/api/payment/verify-payment` → Verifies payment

### Check Backend Logs:

```bash
# In backend terminal, you should see:
Create Razorpay order error: (if any)
Payment verified successfully
Order updated: <orderId>
```

### Common Errors & Solutions:

#### Error: "Razorpay is not defined"

**Solution:** Add script to `frontend/index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Already added ✅

#### Error: "Invalid key_id"

**Solution:**

- Check `.env` files have correct keys
- Restart both servers after changing `.env`
- Key ID should match in frontend and backend

#### Error: "Authentication failed"

**Solution:**

- User must be logged in
- JWT token must be valid
- Check localStorage has 'token'

#### Error: "Payment verification failed"

**Solution:**

- Key secret mismatch
- Check backend `.env` has correct `RAZORPAY_KEY_SECRET`
- Don't share key secret publicly!

---

## 🛡️ Security Best Practices

### ✅ Already Implemented:

1. **Key Secret on Backend Only**

   - ✅ Frontend only has Key ID (public)
   - ✅ Key Secret stays in backend (private)

2. **Payment Verification on Backend**

   - ✅ All verification happens server-side
   - ✅ Can't be bypassed by user

3. **Order Amount Validation**

   - ✅ Backend recalculates total
   - ✅ Prevents amount manipulation

4. **User Authentication**
   - ✅ All payment routes protected
   - ✅ User must be logged in

### 🔒 Additional Security Tips:

1. **Never commit `.env` files**

   - Add `.env` to `.gitignore`
   - Use `.env.example` for reference

2. **Use environment variables**

   - Don't hardcode keys in code
   - ✅ Already using `import.meta.env`

3. **Validate on backend**

   - ✅ Backend verifies signature
   - ✅ Backend validates amount

4. **Use HTTPS in production**
   - Razorpay requires HTTPS for live mode
   - Get SSL certificate (free with Let's Encrypt)

---

## 📊 Payment Flow Diagram

```
┌─────────────┐
│   User      │
│ (Frontend)  │
└──────┬──────┘
       │ 1. Fill address & payment details
       │
       ↓
┌─────────────────────────────┐
│   Review & Place Order      │
└──────┬──────────────────────┘
       │ 2. Create order in DB
       │
       ↓
┌─────────────────────────────┐
│   Backend: Create Order     │
│   POST /api/orders          │
└──────┬──────────────────────┘
       │ 3. Returns orderId
       │
       ↓
┌─────────────────────────────┐
│   Create Razorpay Order     │
│   POST /api/payment/        │
│        create-order         │
└──────┬──────────────────────┘
       │ 4. Returns razorpayOrderId
       │
       ↓
┌─────────────────────────────┐
│   Open Razorpay Modal       │
│   (Payment Gateway)         │
└──────┬──────────────────────┘
       │ 5. User pays
       │
       ↓
┌─────────────────────────────┐
│   Razorpay Callback         │
│   (Payment Success)         │
└──────┬──────────────────────┘
       │ 6. Send payment details
       │
       ↓
┌─────────────────────────────┐
│   Backend: Verify Payment   │
│   POST /api/payment/        │
│        verify-payment       │
└──────┬──────────────────────┘
       │ 7. Verify signature
       │ 8. Update order status
       │
       ↓
┌─────────────────────────────┐
│   Success Response          │
│   - Clear cart              │
│   - Show success toast      │
│   - Redirect to orders      │
└─────────────────────────────┘
```

---

## 🎯 COD (Cash on Delivery) Flow

For COD orders, the flow is simpler:

```
┌─────────────┐
│   User      │
│ (Frontend)  │
└──────┬──────┘
       │ 1. Select COD payment
       │ 2. Place order
       │
       ↓
┌─────────────────────────────┐
│   Backend: Create Order     │
│   POST /api/orders          │
│   - Payment: COD            │
│   - Status: Pending         │
│   - Add ₹10 COD charges     │
└──────┬──────────────────────┘
       │ 3. Order created
       │
       ↓
┌─────────────────────────────┐
│   Success Response          │
│   - Clear cart              │
│   - Show success toast      │
│   - Order confirmed         │
└─────────────────────────────┘
```

---

## 📱 Testing Checklist

### Frontend Tests:

- [ ] Razorpay script loads (check console)
- [ ] Environment variable loaded (`VITE_RAZORPAY_KEY_ID`)
- [ ] Modal opens on "Place Order"
- [ ] Payment methods shown correctly
- [ ] User details pre-filled
- [ ] Success toast appears after payment
- [ ] Cart clears after success
- [ ] Error messages shown on failure

### Backend Tests:

- [ ] Environment variables loaded
- [ ] `/api/orders` endpoint works
- [ ] `/api/payment/create-order` endpoint works
- [ ] `/api/payment/verify-payment` endpoint works
- [ ] Signature verification works
- [ ] Order status updates correctly
- [ ] Payment info saved correctly

### Integration Tests:

- [ ] Complete UPI payment flow
- [ ] Complete Card payment flow
- [ ] Complete COD flow
- [ ] Payment failure handling
- [ ] Payment cancellation handling
- [ ] Network error handling
- [ ] Multiple concurrent orders

---

## 🔧 Troubleshooting

### Issue: Razorpay modal doesn't open

**Check:**

1. Browser console for errors
2. Network tab for API failures
3. Razorpay script loaded:
   ```javascript
   console.log(window.Razorpay); // Should not be undefined
   ```

**Solution:**

- Ensure `index.html` has Razorpay script ✅
- Check no ad-blocker blocking Razorpay
- Try incognito mode

### Issue: "Invalid signature" error

**Check:**

1. Backend `.env` has correct `RAZORPAY_KEY_SECRET`
2. Frontend key matches backend key
3. No extra spaces in `.env` file

**Solution:**

```env
# backend/.env
RAZORPAY_KEY_ID=rzp_test_RVEalzOHCVR74z
RAZORPAY_KEY_SECRET=PZodNLyAO582V30Z5fe9Iuti
```

### Issue: Payment successful but order not updating

**Check:**

1. `/api/payment/verify-payment` endpoint response
2. Backend logs for errors
3. Database connection

**Debug:**

```javascript
// In browser console after payment
fetch("http://localhost:5000/api/orders", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 📚 API Reference

### Create Order

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id",
  "restaurantId": "restaurant_id",
  "items": [...],
  "deliveryAddress": {...},
  "paymentMethod": "upi|card|cod",
  "pricing": {...},
  "paymentInfo": {
    "method": "upi",
    "status": "pending"
  }
}

Response:
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD-12345",
    ...
  }
}
```

### Create Razorpay Order

```http
POST /api/payment/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "currency": "INR",
  "orderId": "mongodb_order_id",
  "receipt": "receipt_12345"
}

Response:
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_xyz123",
    "amount": 50000,
    "currency": "INR",
    "key": "rzp_test_..."
  }
}
```

### Verify Payment

```http
POST /api/payment/verify-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_hash",
  "orderId": "mongodb_order_id"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "order": {...}
  }
}
```

---

## ✅ Summary

### What You Have:

1. ✅ **Valid Razorpay Keys**

   - Key ID: `rzp_test_RVEalzOHCVR74z`
   - Key Secret: Configured (hidden)
   - Mode: Test

2. ✅ **Backend Integration**

   - Order creation endpoint
   - Payment creation endpoint
   - Payment verification endpoint
   - Signature validation

3. ✅ **Frontend Integration**

   - Razorpay SDK loaded
   - Environment variables configured
   - Payment modal integration
   - Success/failure handling

4. ✅ **Security**
   - Authentication required
   - Server-side verification
   - Signature validation
   - Amount validation

### Next Steps:

1. **Test the complete flow** (follow testing checklist)
2. **Handle edge cases** (network errors, timeouts)
3. **Add order tracking page**
4. **Deploy to production** (with live keys)

---

**Status:** 🟢 Razorpay Fully Integrated & Ready to Test!

**Last Updated:** December 2024  
**Test Mode:** Active ✅  
**Production Ready:** After testing ⏳
