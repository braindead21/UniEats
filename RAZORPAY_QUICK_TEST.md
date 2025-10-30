# 🧪 Quick Testing Guide - Razorpay Integration

## ✅ Yes, You Have Both Razorpay Keys!

### Your Keys (Already Configured):

**1. Public Key (Key ID):**

```
rzp_test_RVEalzOHCVR74z
```

- ✅ In `backend/.env`
- ✅ In `frontend/.env`
- 📍 Safe to expose (used in frontend)

**2. Secret Key:**

```
PZodNLyAO582V30Z5fe9Iuti
```

- ✅ In `backend/.env` ONLY
- 🔒 NEVER expose publicly
- 📍 Used for signature verification

---

## 🚀 Test Now (5 Minutes)

### Step 1: Start Servers (2 terminals)

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Wait for: `✓ Server running on port 5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Wait for: `➜  Local:   http://localhost:5174/`

### Step 2: Open App

```
http://localhost:5174
```

### Step 3: Complete Checkout

1. **Add items to cart** (any food items)
2. **Click checkout button**
3. **Address Step:**

   - Click "Add New Address"
   - Fill form:
     ```
     Type: Home
     Flat: 123
     Area: Main Street
     Pincode: 560001
     Phone: 9876543210
     ```
   - Click "Save Address"
   - Select the address (blue border)
   - Click "Next"

4. **Payment Step:**

   - Select "UPI" (or any payment method)
   - If UPI: Enter `success@razorpay`
   - Click "Next"

5. **Review Step:**

   - Check all details
   - Check "Accept terms and conditions" ✓
   - Click "Place Order"

6. **Razorpay Modal Opens! 🎉**

### Step 4: Complete Payment (Test Mode)

#### Option A: Test Card

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

#### Option B: Test UPI

```
UPI ID: success@razorpay
```

#### Option C: Net Banking

- Select any bank
- Username: success
- Password: success

### Step 5: Success! ✅

- Payment modal closes
- Success toast appears
- Cart clears automatically
- Order placed!

---

## 🎯 What to Expect

### After Clicking "Place Order":

**Loading State:**

```
Button shows: "Placing Order..."
```

**Backend Actions (Behind the scenes):**

1. ✅ Order created in MongoDB
2. ✅ Razorpay order created
3. ✅ Payment modal opens

**Razorpay Modal:**

```
┌─────────────────────────┐
│      Pay ₹500           │
│                         │
│   [Card] [UPI] [Wallet] │
│                         │
│   Card: 4111 1111...    │
│   CVV: 123              │
│   Expiry: 12/25         │
│                         │
│      [Pay Securely]     │
└─────────────────────────┘
```

**After Successful Payment:**

```
✓ Payment successful! Order placed.
```

**After 2 seconds:**

```
Modal closes
Back to home page
```

---

## 🐛 Quick Troubleshooting

### Problem: Modal doesn't open

**Check Browser Console (F12):**

```javascript
// Should return "function"
typeof Razorpay;
```

If undefined:

- Refresh page
- Check `index.html` has script tag
- Clear cache (Ctrl + Shift + R)

### Problem: "Authentication failed"

**Solution:**

1. You must be **logged in**
2. Check if you have a token:
   ```javascript
   localStorage.getItem("token");
   ```
3. If null, login first

### Problem: "Invalid key_id"

**Check:**

```bash
# Frontend
cat frontend/.env
# Should show: VITE_RAZORPAY_KEY_ID=rzp_test_RVEalzOHCVR74z

# Backend
cat backend/.env
# Should show: RAZORPAY_KEY_ID=rzp_test_RVEalzOHCVR74z
```

**Fix:**

- Keys must match
- Restart both servers after changing `.env`

---

## 📊 Check Backend Logs

### In backend terminal, you should see:

**When order is placed:**

```
POST /api/orders 200
```

**When Razorpay order created:**

```
POST /api/payment/create-order 200
Razorpay order created: order_xyz123
```

**When payment verified:**

```
POST /api/payment/verify-payment 200
Payment verified successfully
Order updated: 673abc123def
```

### If you see errors:

```
Error: Invalid key_id
→ Check .env files

Error: Authentication failed
→ User not logged in

Error: Order not found
→ Database issue
```

---

## 💡 Pro Tips

### Test COD (No Razorpay Modal)

1. Follow steps 1-4
2. **Payment Step:** Select "Cash on Delivery"
3. **Review Step:** Click "Place Order"
4. Order placed directly (no payment modal)
5. Success! ✅

**Expected:** No Razorpay modal, direct order confirmation

### Test Payment Failure

Use failing card:

```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

**Expected:**

- Payment fails
- Error toast: "Payment failed"
- Order status: 'failed'

### Test Payment Cancellation

1. Open Razorpay modal
2. Click "X" or "Cancel"

**Expected:**

- Toast: "Payment cancelled"
- Back to checkout
- Can try again

---

## 🔍 Verify in Database

### Check MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use database
use unieats

# Find recent order
db.orders.find().sort({ createdAt: -1 }).limit(1).pretty()
```

**Should show:**

```javascript
{
  _id: ObjectId("..."),
  orderNumber: "ORD-12345",
  paymentInfo: {
    method: "upi",
    status: "completed",
    razorpay: {
      orderId: "order_xyz...",
      paymentId: "pay_abc...",
      signature: "..."
    }
  },
  status: "confirmed"
}
```

---

## ✅ Success Checklist

After testing, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5174
- [ ] Can add items to cart
- [ ] Can open checkout modal
- [ ] Can save address
- [ ] Can proceed to payment step
- [ ] Can proceed to review step
- [ ] Razorpay modal opens
- [ ] Can complete test payment
- [ ] Success toast appears
- [ ] Cart clears
- [ ] Order saved in database
- [ ] Payment info saved correctly

---

## 📸 Screenshot Points

Take screenshots of:

1. **Razorpay Modal Opened** ✓
2. **Successful Payment Toast** ✓
3. **Order in Database** ✓
4. **Backend Logs** ✓

This proves integration is working!

---

## 🎓 Understanding the Keys

### Public Key (Key ID): `rzp_test_RVEalzOHCVR74z`

**Purpose:**

- Used to initialize Razorpay on frontend
- Safe to expose in JavaScript
- Tells Razorpay which account to charge

**Where it's used:**

```javascript
// Frontend
const razorpay = new window.Razorpay({
  key: "rzp_test_RVEalzOHCVR74z", // ← This one
});
```

### Secret Key: `PZodNLyAO582V30Z5fe9Iuti`

**Purpose:**

- Used to verify payment signatures
- Proves payment is genuine
- MUST stay on backend only

**Where it's used:**

```javascript
// Backend only
const signature = crypto
  .createHmac("sha256", "PZodNLyAO582V30Z5fe9Iuti") // ← This one
  .update(data)
  .digest("hex");
```

**⚠️ Security:**

- Public key: ✅ Can be in frontend
- Secret key: ❌ NEVER in frontend
- Secret key: ❌ NEVER in Git
- Secret key: ❌ NEVER shared publicly

---

## 🔄 Quick Reset (If Something Goes Wrong)

### Reset Everything:

```bash
# Stop both servers (Ctrl+C)

# Clear frontend cache
cd frontend
rm -rf node_modules/.vite
rm -rf dist

# Restart
npm run dev
```

```bash
# In another terminal
cd backend
npm start
```

### Clear localStorage:

```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

## 🎯 Next Steps After Successful Test

1. ✅ **Test all payment methods**

   - UPI ✓
   - Cards ✓
   - Net Banking ✓
   - Wallets ✓
   - COD ✓

2. ✅ **Test failure scenarios**

   - Payment failure ✓
   - Payment cancellation ✓
   - Network error ✓

3. ✅ **Build order tracking**

   - Order list page
   - Order details page
   - Order status updates

4. ✅ **Production deployment**
   - Get live Razorpay keys
   - Deploy to production
   - Test with real card

---

## 📞 Still Having Issues?

### Quick Checks:

```bash
# 1. Check backend is running
curl http://localhost:5000/api/orders
# Should not be "Connection refused"

# 2. Check Razorpay script loaded
curl http://localhost:5174 | grep razorpay
# Should show script tag

# 3. Check environment variables
cat frontend/.env
cat backend/.env
# Should show Razorpay keys
```

### Get Help:

If still stuck, check:

1. Browser console errors (screenshot)
2. Network tab (failed requests)
3. Backend terminal errors
4. MongoDB connection status

---

**Status:** 🟢 Ready to Test!  
**Estimated Test Time:** 5 minutes  
**Difficulty:** Easy  
**Success Rate:** 99% (if servers are running)

**Go test it now! 🚀**
