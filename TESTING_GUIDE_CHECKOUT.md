# 🚀 QUICK START GUIDE - Testing the Checkout System

## ⚡ Fast Setup (5 Minutes)

### **Step 1: Install Dependencies (if not done)**

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### **Step 2: Start Servers**

Open **TWO** terminals:

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

✅ Server should run on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

✅ App should open on `http://localhost:3000`

---

## 🧪 Testing the Checkout Flow

### **Test Scenario 1: Complete Checkout (Happy Path)**

1. **Browse Restaurants**

   - Click on any restaurant
   - Add 2-3 items to cart

2. **Open Cart**

   - Click cart icon (top right)
   - Verify items are shown
   - Click **"Proceed to Checkout"**

3. **Step 1: Add Delivery Address**

   - Click **"Add New Address"**
   - Fill in the form:
     ```
     Type: Home
     Flat: A-204
     Area: Sector 62
     Landmark: Near Metro
     Pincode: 201301
     Phone: 9876543210
     Instructions: Ring the bell
     ```
   - Click **"Save Address"**
   - Verify address appears in list
   - Select the address
   - Click **"Next"**

4. **Step 2: Select Payment**

   - Select **"UPI"**
   - Enter UPI ID: `test@paytm`
   - Click **"Next"**

5. **Step 3: Review & Place Order**

   - Verify all details are correct
   - Select delivery time: **"ASAP"**
   - Add tip: Click **"₹30"**
   - Add special instructions: `"Extra spicy"`
   - Enable contactless delivery (checkbox)
   - Accept terms & conditions
   - Click **"Place Order"**

6. **Payment (for UPI/Card)**

   - Razorpay modal should open
   - Use test card:
     ```
     Card: 4111 1111 1111 1111
     Expiry: Any future date
     CVV: 123
     ```
   - Complete payment

7. **Confirmation**
   - Success message should appear
   - Order ID should be displayed
   - Auto-redirect after 3 seconds

✅ **Expected Result:** Order placed successfully

---

### **Test Scenario 2: Cash on Delivery**

1. Add items to cart
2. Go to checkout
3. Select/Add address
4. **Select "Cash on Delivery"**
5. Note: ₹10 handling charges added
6. Complete order review
7. Place order

✅ **Expected Result:** Order placed without payment gateway

---

### **Test Scenario 3: Apply Coupon**

1. Add items to cart (total > ₹200)
2. Go to checkout
3. Complete steps 1 & 2
4. In Step 3, enter coupon: `FIRST50`
5. Click **"Apply"**
6. Verify ₹50 discount applied
7. Check updated total

✅ **Expected Result:** Discount reflected in total

---

### **Test Scenario 4: Edit Address**

1. Go to checkout
2. Find saved address
3. Click **Edit** icon
4. Modify details
5. Click **"Update Address"**
6. Verify changes saved

✅ **Expected Result:** Address updated successfully

---

### **Test Scenario 5: Mobile Responsiveness**

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Go through checkout flow
5. Verify:
   - Full-screen modal
   - Large buttons
   - Easy to tap
   - No horizontal scroll

✅ **Expected Result:** Mobile-friendly UI

---

## 🔍 Validation Testing

### **Test Invalid Inputs**

**Invalid Pincode:**

```
Enter: 12345 (5 digits)
Expected: Error message "Please enter valid 6-digit pincode"
```

**Invalid Phone:**

```
Enter: 98765 (5 digits)
Expected: Error message "Please enter valid 10-digit phone number"
```

**Empty Required Fields:**

```
Leave Flat/Area empty
Expected: Error message on save attempt
```

**No Address Selected:**

```
Try clicking "Next" without selecting address
Expected: Error toast "Please select a delivery address"
```

**No Payment Method:**

```
Try clicking "Next" without selecting payment
Expected: Error toast "Please select a payment method"
```

**Terms Not Accepted:**

```
Try placing order without accepting terms
Expected: Error toast "Please accept terms and conditions"
```

---

## 🎯 Backend API Testing

### **Using Browser Console**

Open DevTools Console (F12) and run:

```javascript
// Test Address Validation
fetch("http://localhost:5000/api/address/validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ pincode: "201301" }),
})
  .then((res) => res.json())
  .then((data) => console.log("Address validation:", data));

// Test Serviceability Check
fetch("http://localhost:5000/api/address/check-serviceability/201301")
  .then((res) => res.json())
  .then((data) => console.log("Serviceability:", data));

// Test Serviceable Areas
fetch("http://localhost:5000/api/address/serviceable-areas")
  .then((res) => res.json())
  .then((data) => console.log("All areas:", data));
```

---

## 📊 Database Verification

### **Check MongoDB Orders**

```bash
# Connect to MongoDB
mongosh

# Switch to database
use unieats

# View latest order
db.orders.find().sort({createdAt: -1}).limit(1).pretty()

# Verify new fields exist
db.orders.findOne({}, {
  deliveryTimeSlot: 1,
  tipAmount: 1,
  contactlessDelivery: 1,
  deliveryInstructions: 1,
  alternatePhone: 1,
  codHandlingCharges: 1,
  notifications: 1
})
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: Modal Not Opening**

**Symptom:** Click checkout, nothing happens  
**Fix:** Check console for errors, verify CartContext is working

### **Issue 2: Payment Gateway Error**

**Symptom:** Razorpay not loading  
**Fix:**

```bash
# Check if Razorpay script is loaded
# In public/index.html, verify:
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### **Issue 3: Address Not Saving**

**Symptom:** Address disappears after refresh  
**Fix:** Check browser localStorage:

```javascript
// In console
localStorage.getItem("savedAddresses");
```

### **Issue 4: Backend Connection Failed**

**Symptom:** Network errors in console  
**Fix:**

```bash
# Verify backend is running
curl http://localhost:5000/

# Check CORS settings in backend/server.js
```

### **Issue 5: Order Not Creating**

**Symptom:** Place order fails  
**Fix:** Check backend console for errors, verify MongoDB connection

---

## ✅ Quick Test Checklist

**Frontend:**

- [ ] Modal opens on checkout click
- [ ] Step indicator shows correctly
- [ ] Can add new address
- [ ] Can edit address
- [ ] Can delete address
- [ ] Can select payment method
- [ ] Can add tip amount
- [ ] Can apply coupon code
- [ ] Can enable contactless delivery
- [ ] Terms checkbox works
- [ ] Place order button enables/disables correctly

**Backend:**

- [ ] Address validation API works
- [ ] Order creation accepts new fields
- [ ] Pricing calculated correctly
- [ ] COD charges added
- [ ] Tip amount saved
- [ ] Order saved to database

**Integration:**

- [ ] Cart context integration works
- [ ] Toast notifications appear
- [ ] Payment gateway integrates
- [ ] Order confirmation shown
- [ ] Auto-redirect works

---

## 🎥 Demo Flow (Copy & Paste)

**Quick Demo Steps:**

1. Start servers ✓
2. Go to `http://localhost:3000`
3. Click any restaurant
4. Add "Margherita Pizza" (×2)
5. Add "Garlic Bread" (×1)
6. Click cart icon
7. Click "Proceed to Checkout"
8. Add address (use test data below)
9. Select UPI payment
10. Enter UPI: `test@paytm`
11. Add ₹30 tip
12. Apply coupon: `FIRST50`
13. Accept terms
14. Place order
15. Complete payment
16. See success message!

**Test Data (Copy-Paste Ready):**

```
Flat: A-204
Area: Sector 62, Noida
Landmark: Near Metro Station
Pincode: 201301
Phone: 9876543210
Alternate Phone: 9876543211
UPI ID: test@paytm
Coupon Code: FIRST50
```

---

## 📸 Screenshots to Verify

Take screenshots of:

1. Step 1 - Address selection
2. Step 2 - Payment methods
3. Step 3 - Order review
4. Success confirmation
5. Mobile view

---

## 🚦 Status Check

After testing, verify:

✅ **GREEN (Working):**

- Checkout modal opens
- All steps navigable
- Address CRUD operations
- Payment selection
- Order placement
- Validation working

⚠️ **YELLOW (Needs Attention):**

- Slow API responses
- UI glitches
- Minor validation issues

❌ **RED (Broken):**

- Modal not opening
- Backend connection failed
- Payment gateway error
- Order not saving

---

## 🎯 Performance Check

**Load Time:**

- Modal should open < 300ms
- Step transition < 200ms
- API calls < 1s

**Memory:**

- No memory leaks
- Smooth scrolling
- No lag on mobile

---

## 📞 Need Help?

**Check:**

1. Browser console for errors
2. Backend terminal for API errors
3. MongoDB connection
4. Network tab in DevTools

**Debug Mode:**
Enable console logs in CheckoutModalEnhanced.jsx by uncommenting debug statements.

---

## 🎉 Success Indicators

✅ Order appears in MongoDB with all new fields  
✅ Payment processed successfully  
✅ Success toast shown  
✅ Cart cleared after order  
✅ No console errors  
✅ Mobile responsive

---

**Ready to test? Let's go! 🚀**
