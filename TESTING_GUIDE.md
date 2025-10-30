# 🧪 UniEats - Complete Testing Guide

**Version:** 2.0  
**Date:** October 20, 2025  
**Status:** Ready for Testing ✅

---

## 🎯 TESTING OVERVIEW

This guide will help you systematically test all 4 newly integrated features:

1. ✅ Menu Customization Modal
2. ✅ Restaurant Detail Modal
3. ✅ Coupon/Promo System
4. ✅ Saved Addresses

---

## 🚀 SETUP INSTRUCTIONS

### Prerequisites:

- Node.js installed (v14+)
- MongoDB running (if using real backend)
- All dependencies installed

### Start the Application:

**Option 1: Full Stack Testing**

```powershell
# Terminal 1 - Backend
cd "d:\Github Projects\UniEats\backend"
npm start

# Terminal 2 - Frontend
cd "d:\Github Projects\UniEats\frontend"
npm run dev
```

**Option 2: Frontend Only (Mock Data)**

```powershell
cd "d:\Github Projects\UniEats\frontend"
npm run dev
```

### Access the App:

- **Frontend:** http://localhost:5175/ (or check terminal output)
- **Backend:** http://localhost:5000/api/

---

## 🧪 FEATURE 1: MENU CUSTOMIZATION MODAL

### ✅ Test Cases:

#### TC1.1: Open Customization Modal

**Steps:**

1. Navigate to any restaurant's menu
2. Click "Add to Cart" on any menu item
3. Modal should open with item details

**Expected Result:**

- ✅ Modal opens smoothly
- ✅ Item name and image displayed
- ✅ Base price shown correctly
- ✅ "Medium" size pre-selected

**Screenshot Points:** Modal open state, header with item image

---

#### TC1.2: Size Selection

**Steps:**

1. Open customization modal
2. Click on "Small" size option
3. Observe price change
4. Click on "Large" size option
5. Observe price change

**Expected Result:**

- ✅ Small: Price reduces to 75% of base
- ✅ Medium: Base price (100%)
- ✅ Large: Price increases to 150% of base
- ✅ Selected size highlighted with gradient border
- ✅ Total price updates instantly

**Price Calculations:**

- Base Price: ₹200
- Small: ₹150 (200 × 0.75)
- Medium: ₹200 (200 × 1.0)
- Large: ₹300 (200 × 1.5)

---

#### TC1.3: Add-ons Selection

**Steps:**

1. Open customization modal for Pizza
2. Click "Extra Cheese" add-on
3. Observe price increase
4. Click "Mushrooms" add-on
5. Observe cumulative price
6. Click "Extra Cheese" again to deselect

**Expected Result:**

- ✅ Add-on selected with checkmark icon
- ✅ Price increases: Base + Add-on
- ✅ Multiple add-ons stack prices
- ✅ Clicking again deselects and reduces price
- ✅ Smooth animation on selection

**Add-on Prices (Pizza Category):**

- Extra Cheese: +₹50
- Black Olives: +₹30
- Mushrooms: +₹40
- Jalapeños: +₹25
- Sweet Corn: +₹30

---

#### TC1.4: Quantity Adjustment

**Steps:**

1. Open customization modal
2. Click "+" button multiple times
3. Observe quantity increase (max 10)
4. Click "-" button multiple times
5. Observe quantity decrease (min 1)

**Expected Result:**

- ✅ Quantity increases on "+"
- ✅ Total price = (Base + Addons) × Quantity
- ✅ Cannot go below 1
- ✅ Cannot go above 10
- ✅ Price updates in real-time

**Example:**

- Base: ₹200
- 1 Add-on: ₹50
- Quantity: 3
- **Total:** (200 + 50) × 3 = **₹750**

---

#### TC1.5: Special Instructions

**Steps:**

1. Open customization modal
2. Click on "Special Instructions" textarea
3. Type: "Less spicy, no onions"
4. Add to cart

**Expected Result:**

- ✅ Text input works smoothly
- ✅ Multi-line text supported
- ✅ Instructions saved with order
- ✅ Placeholder text visible when empty

---

#### TC1.6: Add to Cart & Modal Close

**Steps:**

1. Customize item (size, addons, quantity, instructions)
2. Click "Add to Cart" button
3. Observe cart behavior

**Expected Result:**

- ✅ Modal closes automatically
- ✅ Cart sidebar opens/updates
- ✅ Item appears in cart with:
  - Selected size
  - Selected add-ons
  - Quantity
  - Special instructions (if any)
- ✅ Cart count badge updates
- ✅ Success toast notification (if enabled)

---

#### TC1.7: Close Modal (Without Adding)

**Steps:**

1. Open customization modal
2. Click "X" button OR Press ESC key OR Click backdrop
3. Observe modal behavior

**Expected Result:**

- ✅ Modal closes smoothly
- ✅ No item added to cart
- ✅ Form resets for next use
- ✅ ESC key closes modal (**NEW FEATURE**)

---

#### TC1.8: Different Item Categories

**Steps:**

1. Test Pizza item - Check add-ons (cheese, olives, mushrooms)
2. Test Burger item - Check add-ons (bacon, egg, avocado)
3. Test Biryani item - Check add-ons (raita, egg, chicken)
4. Test Other items - Check generic add-ons

**Expected Result:**

- ✅ Add-ons change based on item category
- ✅ Category-specific emojis displayed
- ✅ Prices vary per add-on type
- ✅ All categories work smoothly

---

### 🐛 Known Issues:

- None reported yet

---

## 🧪 FEATURE 2: RESTAURANT DETAIL MODAL

### ✅ Test Cases:

#### TC2.1: Open Restaurant Details

**Steps:**

1. Scroll to "Top Restaurants" section
2. Hover over any restaurant card
3. Click "ℹ️ Details" button
4. Modal should open

**Expected Result:**

- ✅ Modal opens with full restaurant info
- ✅ Image gallery loaded
- ✅ Restaurant name and rating visible
- ✅ Smooth fade-in animation

---

#### TC2.2: Image Gallery Navigation

**Steps:**

1. Open restaurant detail modal
2. Click right arrow button (→)
3. Observe image change
4. Click left arrow button (←)
5. Observe image change

**Expected Result:**

- ✅ Images change smoothly
- ✅ Circular navigation (last → first)
- ✅ Image indicators at bottom
- ✅ Active indicator highlighted
- ✅ High-quality images loaded

---

#### TC2.3: Rating Breakdown

**Steps:**

1. Open restaurant detail modal
2. Scroll to "Rating Breakdown" section
3. Observe rating bars

**Expected Result:**

- ✅ Food Quality: 4.5/5 with progress bar
- ✅ Delivery Speed: 4.3/5 with progress bar
- ✅ Value for Money: 4.4/5 with progress bar
- ✅ Bars filled proportionally
- ✅ Star icons displayed

---

#### TC2.4: Popular Dishes Section

**Steps:**

1. Open restaurant detail modal
2. Scroll to "Most Ordered" section
3. View popular dishes

**Expected Result:**

- ✅ 3-4 popular dishes displayed
- ✅ Dish name and price shown
- ✅ Order count displayed
- ✅ Nice card layout with hover effect

---

#### TC2.5: Opening Hours

**Steps:**

1. Open restaurant detail modal
2. Scroll to "Opening Hours" section
3. Check all days

**Expected Result:**

- ✅ All 7 days listed
- ✅ Timing format: "10:00 AM - 11:00 PM"
- ✅ Current day highlighted (if applicable)
- ✅ Open/Closed status shown

---

#### TC2.6: Customer Reviews

**Steps:**

1. Open restaurant detail modal
2. Scroll to "Customer Reviews" section
3. Read 2-3 reviews
4. Click "Load More Reviews" button

**Expected Result:**

- ✅ User name and rating shown
- ✅ Review text displayed
- ✅ Date/time shown ("2 days ago")
- ✅ Helpful count displayed
- ✅ "Load More" loads additional reviews
- ✅ Star rating visualization

---

#### TC2.7: Contact Information

**Steps:**

1. Open restaurant detail modal
2. Scroll to bottom
3. View contact details

**Expected Result:**

- ✅ Phone number displayed
- ✅ Address shown with map icon
- ✅ Delivery time estimate
- ✅ Icons properly aligned

---

#### TC2.8: View Full Menu Action

**Steps:**

1. Open restaurant detail modal
2. Scroll to bottom
3. Click "View Full Menu" button

**Expected Result:**

- ✅ Detail modal closes
- ✅ Redirects to restaurant menu section
- ✅ Menu items loaded
- ✅ Smooth transition

---

#### TC2.9: Close Modal

**Steps:**

1. Open restaurant detail modal
2. Test 3 closing methods:
   - Click "X" button (top-right)
   - Press ESC key (**NEW FEATURE**)
   - Click outside modal (backdrop)

**Expected Result:**

- ✅ All 3 methods close modal
- ✅ Smooth fade-out animation
- ✅ Returns to restaurant list
- ✅ No errors in console

---

### 🐛 Known Issues:

- None reported yet

---

## 🧪 FEATURE 3: COUPON/PROMO SYSTEM

### ✅ Test Cases:

#### TC3.1: View Coupon Section

**Steps:**

1. Add items to cart (total > ₹200)
2. Open cart sidebar
3. Locate coupon section

**Expected Result:**

- ✅ Coupon input field visible
- ✅ Tag icon displayed
- ✅ "View X available coupons" button visible
- ✅ Clean, modern design

---

#### TC3.2: Apply Valid Coupon

**Steps:**

1. Add items worth ₹300 to cart
2. Open cart
3. Type: `FIRST50` in coupon input
4. Click "Apply"

**Expected Result:**

- ✅ Success toast: "Coupon applied! You saved ₹150"
- ✅ Green checkmark animation
- ✅ Discount shown in pricing breakdown
- ✅ Final total reduced by ₹150
- ✅ Coupon banner replaces input field

**Calculation:**

- Cart Total: ₹300
- FIRST50: 50% OFF (max ₹150)
- Discount: ₹150 (50% of 300 = 150, within max)
- Final Total: ₹150

---

#### TC3.3: Apply Invalid Coupon

**Steps:**

1. Add items to cart
2. Type: `INVALID123`
3. Click "Apply"

**Expected Result:**

- ✅ Error toast: "Invalid coupon code"
- ✅ Red error animation
- ✅ No discount applied
- ✅ Input field remains

---

#### TC3.4: Coupon Minimum Order Check

**Steps:**

1. Add items worth ₹150 to cart
2. Try to apply: `SAVE100` (min order ₹400)
3. Click "Apply"

**Expected Result:**

- ✅ Warning toast: "Add items worth ₹250 more to use this coupon"
- ✅ Helpful message shows exact amount needed
- ✅ No discount applied
- ✅ User knows how much more to add

---

#### TC3.5: View Available Coupons

**Steps:**

1. Open cart
2. Click "View X available coupons"
3. Observe coupon panel

**Expected Result:**

- ✅ Panel slides down smoothly
- ✅ 5 coupons displayed:
  1. FIRST50 (50% OFF, min ₹200)
  2. SAVE100 (₹100 OFF, min ₹400)
  3. WEEKEND20 (20% OFF, min ₹300)
  4. FLAT60 (₹60 OFF, min ₹250)
  5. MEGA30 (30% OFF, min ₹500)
- ✅ Each coupon shows:
  - Code
  - Title
  - Description
  - Min order
  - Valid for info
  - Apply button OR "Add ₹X more" message

---

#### TC3.6: Best Coupon Suggestion (**NEW FEATURE**)

**Steps:**

1. Add items worth ₹500 to cart
2. Open cart (without applying coupon)
3. Observe purple banner at top

**Expected Result:**

- ✅ Purple gradient banner displayed
- ✅ Shows best available coupon (MEGA30)
- ✅ Shows exact savings: "Save ₹150!"
- ✅ "Apply" button in banner
- ✅ Clicking applies coupon instantly

**Logic:**

- System calculates discount for all eligible coupons
- Displays the one with maximum savings
- Auto-updates when cart total changes

---

#### TC3.7: Apply Coupon from Panel

**Steps:**

1. Add items worth ₹300
2. Click "View available coupons"
3. Find "WEEKEND20" coupon
4. Click "Apply" button on coupon card

**Expected Result:**

- ✅ Coupon applied instantly
- ✅ Panel closes automatically
- ✅ Success toast shown
- ✅ Discount reflected in total
- ✅ Coupon banner replaces input

---

#### TC3.8: Remove Applied Coupon

**Steps:**

1. Apply any coupon
2. Observe applied coupon banner
3. Click "X" button on banner

**Expected Result:**

- ✅ Coupon removed
- ✅ Success toast: "Coupon removed"
- ✅ Input field returns
- ✅ Discount removed from total
- ✅ Best coupon suggestion appears again

---

#### TC3.9: Multiple Coupon Attempts

**Steps:**

1. Apply FIRST50
2. Remove it
3. Apply SAVE100
4. Remove it
5. Apply WEEKEND20
6. Keep it

**Expected Result:**

- ✅ Only one coupon active at a time
- ✅ Each application works correctly
- ✅ Calculations accurate every time
- ✅ No errors or glitches

---

#### TC3.10: Coupon with Percentage Discount

**Steps:**

1. Add items worth ₹800
2. Apply WEEKEND20 (20% OFF, max ₹200)

**Expected Result:**

- ✅ Discount: ₹160 (20% of 800 = 160, within max ₹200)
- ✅ Final Total: ₹640

Now test max cap: 3. Add more items to make total ₹1500 4. WEEKEND20 still applied

**Expected Result:**

- ✅ Discount capped at ₹200 (20% of 1500 = 300, but max is 200)
- ✅ Final Total: ₹1300

---

#### TC3.11: Coupon Auto-Close Panel

**Steps:**

1. Open available coupons panel
2. Click anywhere outside panel
3. Observe behavior

**Expected Result:**

- ✅ Panel closes automatically
- ✅ Smooth slide-up animation
- ✅ No coupon applied
- ✅ Clean UX

---

#### TC3.12: Coupon Input Clear Button

**Steps:**

1. Type a coupon code
2. Observe "X" button in input
3. Click "X" button

**Expected Result:**

- ✅ Input cleared
- ✅ Smooth interaction
- ✅ Ready for new input

---

### 🐛 Known Issues:

- None reported yet

---

## 🧪 FEATURE 4: SAVED ADDRESSES

### ✅ Test Cases:

#### TC4.1: Access Saved Addresses

**Steps:**

1. Login as student user
2. Navigate to Student Dashboard
3. Click "Addresses" tab

**Expected Result:**

- ✅ Addresses section loads
- ✅ 2 demo addresses pre-loaded:
  - Home (A-204, Sector 62, Noida)
  - Office (Floor 5, Tower B, Sector 18)
- ✅ "Add New Address" button visible
- ✅ Clean card layout

---

#### TC4.2: View Address Details

**Steps:**

1. Open Addresses tab
2. Observe first address card

**Expected Result:**

- ✅ Address type icon (🏠 Home / 💼 Work)
- ✅ Address label displayed
- ✅ Full address formatted:
  - Flat/House No
  - Area/Street
  - Landmark
  - Pincode
- ✅ Phone number shown
- ✅ "Default" badge if applicable
- ✅ Edit and Delete buttons visible

---

#### TC4.3: Add New Address

**Steps:**

1. Click "Add New Address" button
2. Form modal opens
3. Fill details:
   - Type: Home
   - Label: "Hostel Room"
   - Flat No: "Room 305"
   - Area: "JIIT Campus, Sector 62"
   - Landmark: "Near Library"
   - Pincode: "201301"
   - Phone: "+91 99999 00000"
4. Click "Save Address"

**Expected Result:**

- ✅ Form validation passes
- ✅ Address added to list
- ✅ Success toast: "Address saved successfully"
- ✅ Form closes
- ✅ New address appears in list
- ✅ Saved to localStorage

---

#### TC4.4: Form Validation

**Steps:**

1. Click "Add New Address"
2. Try to save with empty fields
3. Observe validation

**Expected Result:**

- ✅ Error toast for missing fields
- ✅ Required field indicators
- ✅ Cannot save incomplete form

Now test individual validations:

- Pincode: Must be 6 digits
- Phone: Must be valid format
- All text fields: Min 2 characters

---

#### TC4.5: Edit Existing Address

**Steps:**

1. Click "Edit" button on any address
2. Form opens with pre-filled data
3. Change "Area" field
4. Change "Landmark" field
5. Click "Update Address"

**Expected Result:**

- ✅ Form pre-filled with current values
- ✅ Title shows "Edit Address"
- ✅ Changes saved correctly
- ✅ Success toast: "Address updated"
- ✅ Updated data reflected in card
- ✅ localStorage updated

---

#### TC4.6: Delete Address

**Steps:**

1. Click "Delete" button on non-default address
2. Observe confirmation
3. Confirm deletion

**Expected Result:**

- ✅ Confirmation dialog appears
- ✅ "Are you sure?" message shown
- ✅ Cancel and Delete options
- ✅ Address removed from list
- ✅ Success toast: "Address deleted"
- ✅ localStorage updated
- ✅ UI updates smoothly

---

#### TC4.7: Set Default Address

**Steps:**

1. Have multiple addresses
2. Click "Set as Default" on second address
3. Observe changes

**Expected Result:**

- ✅ Previous default badge removed
- ✅ New default badge added
- ✅ Success toast: "Default address updated"
- ✅ Only one default at a time
- ✅ Default address used in checkout

---

#### TC4.8: Cannot Delete Default Address

**Steps:**

1. Try to delete the default address
2. Observe behavior

**Expected Result:**

- ✅ Warning toast: "Cannot delete default address"
- ✅ Or: "Set another address as default first"
- ✅ Address not deleted
- ✅ Helpful message shown

---

#### TC4.9: Address Type Icons

**Steps:**

1. Create addresses with different types:
   - Home (🏠)
   - Work (💼)
   - Other (📍)
2. Observe icons

**Expected Result:**

- ✅ Correct icon for each type
- ✅ Consistent styling
- ✅ Icon color matches theme

---

#### TC4.10: Address Selection Mode

**Steps:**

1. Access addresses from checkout flow
2. `showActions=false` prop passed
3. Click on address card

**Expected Result:**

- ✅ Edit/Delete buttons hidden
- ✅ Cards clickable for selection
- ✅ Selected address highlighted
- ✅ onSelectAddress callback triggered

---

#### TC4.11: Persistence Test

**Steps:**

1. Add 3 new addresses
2. Refresh browser
3. Check addresses

**Expected Result:**

- ✅ All addresses persist
- ✅ Default address remembered
- ✅ No data loss
- ✅ localStorage working correctly

---

#### TC4.12: Mobile Responsiveness

**Steps:**

1. Resize browser to mobile width (375px)
2. Access Addresses tab
3. Test all operations

**Expected Result:**

- ✅ Cards stack vertically
- ✅ Form adapts to mobile
- ✅ Buttons remain accessible
- ✅ Touch-friendly interactions
- ✅ No horizontal scroll

---

### 🐛 Known Issues:

- None reported yet

---

## 🔄 CROSS-FEATURE INTEGRATION TESTS

### ✅ Test Cases:

#### INT1: Menu Customization → Cart → Coupon

**Steps:**

1. Customize and add 3 items to cart (₹600+ total)
2. Open cart
3. Apply FIRST50 coupon
4. Verify discount

**Expected Result:**

- ✅ All 3 items in cart with customizations
- ✅ Coupon applies to total correctly
- ✅ Final amount accurate
- ✅ Smooth flow

---

#### INT2: Restaurant Details → Menu → Customize

**Steps:**

1. Open restaurant detail modal
2. Click "View Full Menu"
3. Select item
4. Customize item
5. Add to cart

**Expected Result:**

- ✅ Seamless navigation
- ✅ Restaurant context maintained
- ✅ All modals work correctly
- ✅ No data loss

---

#### INT3: Address → Checkout → Payment

**Steps:**

1. Add items to cart
2. Proceed to checkout
3. Select saved address
4. Apply coupon
5. Complete order

**Expected Result:**

- ✅ Address pre-filled
- ✅ Coupon discount reflected
- ✅ Final amount correct
- ✅ Order placed successfully

---

#### INT4: Multiple Modals Handling

**Steps:**

1. Open restaurant detail modal
2. Don't close it
3. Try to open customization modal
4. Observe behavior

**Expected Result:**

- ✅ Only one modal open at a time
- ✅ Previous modal closes automatically
- ✅ No z-index conflicts
- ✅ Smooth transitions

---

## 📱 RESPONSIVE DESIGN TESTS

### Device Breakpoints to Test:

1. **Mobile:** 320px - 480px
2. **Tablet:** 768px - 1024px
3. **Desktop:** 1200px+

### Test All Features on Each Breakpoint:

- ✅ Menu Customization Modal
- ✅ Restaurant Detail Modal
- ✅ Coupon Section
- ✅ Saved Addresses

### Expected Results:

- ✅ All modals adapt to screen size
- ✅ Buttons remain accessible
- ✅ Text readable
- ✅ No horizontal scroll
- ✅ Touch-friendly tap targets (min 44px)

---

## ⚡ PERFORMANCE TESTS

### Load Time Tests:

- ✅ Modal opens in < 200ms
- ✅ Coupon calculation < 50ms
- ✅ Address save < 100ms
- ✅ Image gallery smooth at 60fps

### Memory Tests:

- ✅ No memory leaks when opening/closing modals repeatedly
- ✅ Event listeners cleaned up properly
- ✅ LocalStorage size reasonable

---

## ♿ ACCESSIBILITY TESTS

### Keyboard Navigation:

- ✅ Tab through all form fields
- ✅ ESC key closes modals (**NEW FEATURE**)
- ✅ Enter key submits forms
- ✅ Focus visible on all elements

### Screen Reader:

- ✅ All images have alt text
- ✅ Form labels properly associated
- ✅ Error messages announced
- ✅ Success messages announced

### Color Contrast:

- ✅ Text readable (WCAG AA)
- ✅ Button colors sufficient contrast
- ✅ Disabled states clear

---

## 🐛 BUG REPORTING TEMPLATE

If you find a bug, please report using this format:

```
**Bug ID:** BUG-001
**Feature:** Menu Customization Modal
**Severity:** High / Medium / Low
**Priority:** P0 / P1 / P2

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Screenshots:**
[Attach if applicable]

**Browser/Device:**
Chrome 120, Windows 11

**Console Errors:**
[Copy any errors from browser console]
```

---

## ✅ TESTING CHECKLIST

### Before Testing:

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Browser console open
- [ ] Network tab open (for API calls)
- [ ] Testing in incognito mode (clean slate)

### During Testing:

- [ ] Test happy path first
- [ ] Then test edge cases
- [ ] Check console for errors
- [ ] Verify localStorage updates
- [ ] Test on different browsers
- [ ] Test mobile responsiveness

### After Testing:

- [ ] Document all bugs found
- [ ] Note any UX improvements
- [ ] Verify no console errors
- [ ] Clear localStorage and retest
- [ ] Provide feedback

---

## 🎯 SUCCESS CRITERIA

### Menu Customization:

- ✅ All size options work
- ✅ Add-ons calculate correctly
- ✅ Quantity controls functional
- ✅ Special instructions saved
- ✅ ESC key closes modal

### Restaurant Details:

- ✅ Image gallery navigates
- ✅ Ratings display correctly
- ✅ Reviews load properly
- ✅ View Menu action works
- ✅ ESC key closes modal

### Coupon System:

- ✅ Valid coupons apply
- ✅ Invalid coupons rejected
- ✅ Min order validation works
- ✅ Best coupon suggested
- ✅ Discount calculated accurately

### Saved Addresses:

- ✅ CRUD operations work
- ✅ Default address logic correct
- ✅ Form validation solid
- ✅ Persistence via localStorage
- ✅ Mobile responsive

---

## 📊 TEST COVERAGE

| Feature            | Test Cases | Priority | Status     |
| ------------------ | ---------- | -------- | ---------- |
| Menu Customization | 8          | High     | ✅ Ready   |
| Restaurant Details | 9          | High     | ✅ Ready   |
| Coupon System      | 12         | High     | ✅ Ready   |
| Saved Addresses    | 12         | High     | ✅ Ready   |
| Integration        | 4          | Medium   | ✅ Ready   |
| Responsive         | 3          | High     | ✅ Ready   |
| Performance        | 4          | Medium   | ⏳ Pending |
| Accessibility      | 12         | High     | ⏳ Pending |

**Total Test Cases:** 64+  
**Estimated Testing Time:** 2-3 hours  
**Regression Testing:** 30 minutes

---

## 🚀 QUICK START TESTING

**5-Minute Smoke Test:**

1. ✅ Open app
2. ✅ Click any "Add to Cart" → Customize → Add
3. ✅ Hover restaurant → Click "Details" → Browse → Close
4. ✅ Open cart → Apply coupon: `FIRST50`
5. ✅ Login → Dashboard → Addresses → Add new address
6. ✅ Verify no console errors

**If all pass:** Full testing can proceed  
**If any fail:** Report immediately

---

## 📞 SUPPORT & FEEDBACK

**Found a Bug?**  
Create an issue with BUG REPORTING TEMPLATE above

**Have Suggestions?**  
Note them down during testing

**Need Help?**  
Check console for error messages first

---

## 🎉 HAPPY TESTING!

Remember:

- Test thoroughly but efficiently
- Document everything
- Think like a user
- Break things creatively
- Report findings clearly

**Your testing helps make UniEats better! 🍕🚀**

---

**Last Updated:** October 20, 2025  
**Version:** 2.0  
**Tested By:** ********\_********  
**Date:** ********\_********  
**Sign-off:** ********\_********
