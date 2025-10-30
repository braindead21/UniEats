import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { EmptyCart } from './EmptyState';
import CheckoutModalEnhanced from './CheckoutModalEnhanced';
import './CartPage.css';

// Lazy load components
const CouponSection = lazy(() => import('./CouponSection'));

function CartPage() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    restaurant, 
    getCartTotal, 
    getCartCount, 
    getPricingBreakdown,
    updateQuantity,
    removeFromCart,
    checkout,
    isCheckingOut,
    removingItemId,
    updatingItemId
  } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [priceUpdated, setPriceUpdated] = useState(false);

  // Track price changes for animation
  const prevTotalRef = React.useRef(0);
  React.useEffect(() => {
    if (!getPricingBreakdown) return;
    
    try {
      const pricing = getPricingBreakdown();
      const currentTotal = pricing.total - (appliedCoupon?.discountAmount || 0);
      
      if (prevTotalRef.current !== 0 && prevTotalRef.current !== currentTotal) {
        setPriceUpdated(true);
        setTimeout(() => setPriceUpdated(false), 600);
      }
      
      prevTotalRef.current = currentTotal;
    } catch (error) {
      console.error('Error tracking price changes:', error);
    }
  }, [cartItems, appliedCoupon, getPricingBreakdown]);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to proceed with checkout');
      navigate('/student/login');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleContinueShopping = () => {
    navigate('/');
    // Scroll to restaurants section after navigation
    setTimeout(() => {
      const restaurantsSection = document.getElementById('restaurants');
      if (restaurantsSection) {
        restaurantsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-container">
          <div className="cart-page-header">
            <button className="cart-back-btn" onClick={() => navigate(-1)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h1 className="cart-page-title">Your Cart</h1>
          </div>
          <div className="cart-empty-wrapper">
            <EmptyCart onBrowseRestaurants={handleContinueShopping} />
          </div>
        </div>
      </div>
    );
  }

  const pricing = getPricingBreakdown();
  const subtotal = getCartTotal();
  const freeDeliveryTarget = 300;
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        {/* Header */}
        <div className="cart-page-header">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1 className="cart-page-title">
            Your Cart
            <span className="cart-page-count">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}</span>
          </h1>
        </div>

        <div className="cart-page-content">
          {/* Main Content - Left Side */}
          <div className="cart-page-main">
            {/* Restaurant Info */}
            {restaurant && (
              <div className="cart-page-restaurant-card">
                <div className="restaurant-card-icon">🏪</div>
                <div className="restaurant-card-info">
                  <h2 className="restaurant-card-name">{restaurant.name}</h2>
                  <p className="restaurant-card-cuisine">{restaurant.cuisine}</p>
                </div>
                <button 
                  className="restaurant-card-change"
                  onClick={handleContinueShopping}
                >
                  Change
                </button>
              </div>
            )}

            {/* Free Delivery Progress */}
            <div className="cart-page-delivery-progress">
              {progress >= 100 ? (
                <div className="delivery-unlocked">
                  <span className="delivery-icon">🎉</span>
                  <span className="delivery-text">You've unlocked FREE delivery!</span>
                </div>
              ) : (
                <>
                  <div className="delivery-pending">
                    <span className="delivery-icon">🚚</span>
                    <span className="delivery-text">Add ₹{remaining} more for FREE delivery</span>
                  </div>
                  <div className="delivery-progress-bar">
                    <div 
                      className="delivery-progress-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Cart Items */}
            <div className="cart-page-items">
              <h3 className="cart-items-heading">Items in your cart</h3>
              {cartItems.map((item, index) => (
                <div 
                  key={item._id}
                  className={`cart-page-item ${removingItemId === item._id ? 'removing' : ''}`}
                  style={{ '--item-index': index }}
                >
                  {/* Item Type Badge */}
                  <div className={`item-type-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                    <span className="badge-dot"></span>
                  </div>

                  {/* Item Image */}
                  <div className="cart-item-image-wrapper">
                    <img 
                      src={item.images?.[0]?.url || item.img || item.image || 'https://via.placeholder.com/120x120?text=Dish'} 
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    
                    {/* Customizations */}
                    {(item.size || item.addons?.length > 0 || item.spiceLevel || item.notes) && (
                      <div className="cart-item-customizations">
                        {item.size && (
                          <span className="customization-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            {item.size}
                          </span>
                        )}
                        {item.spiceLevel && (
                          <span className="customization-tag spice">
                            🌶️ {item.spiceLevel}
                          </span>
                        )}
                        {item.addons?.map((addon, idx) => (
                          <span key={idx} className="customization-tag addon">
                            + {addon.name || addon}
                          </span>
                        ))}
                        {item.notes && (
                          <span className="customization-tag notes" title={item.notes}>
                            📝 Special instructions
                          </span>
                        )}
                      </div>
                    )}

                    <div className="cart-item-price">₹{item.price}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <span className={`qty-value ${updatingItemId === item._id ? 'updating' : ''}`}>
                        {item.quantity}
                      </span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              Continue Shopping
            </button>
          </div>

          {/* Sidebar - Right Side */}
          <div className="cart-page-sidebar">
            {/* Bill Details */}
            <div className="bill-details-card">
              <h3 className="bill-details-heading">Bill Details</h3>
              
              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{pricing.subtotal}</span>
              </div>

              {pricing.deliveryFee > 0 && (
                <div className="bill-row">
                  <span>Delivery Fee</span>
                  <span>₹{pricing.deliveryFee}</span>
                </div>
              )}

              <div className="bill-row">
                <span>
                  Platform Fee
                  <small className="fee-info">Helps support UniEats</small>
                </span>
                <span>₹{pricing.platformFee}</span>
              </div>

              <div className="bill-row">
                <span>GST & Taxes</span>
                <span>₹{pricing.tax}</span>
              </div>

              {pricing.subtotal > 300 && (
                <div className="bill-row discount">
                  <span>🎉 Free Delivery Discount</span>
                  <span>-₹40</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="bill-row discount">
                  <span>🎉 Coupon ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount}</span>
                </div>
              )}

              <div className="bill-divider"></div>

              <div className="bill-row total">
                <span>To Pay</span>
                <span className={priceUpdated ? 'price-updated' : ''}>
                  ₹{pricing.total - (appliedCoupon?.discountAmount || 0)}
                </span>
              </div>
            </div>

            {/* Coupon Section */}
            <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
              <CouponSection
                cartTotal={getCartTotal()}
                appliedCoupon={appliedCoupon}
                onCouponApply={(coupon) => setAppliedCoupon(coupon)}
                onCouponRemove={() => setAppliedCoupon(null)}
              />
            </Suspense>

            {/* Checkout Button */}
            <button 
              className="checkout-btn"
              onClick={handleProceedToCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <span className="checkout-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            {/* Delivery Info */}
            <div className="delivery-info-card">
              <div className="delivery-info-icon">🏍️</div>
              <div className="delivery-info-text">
                <h4>Fast & Safe Delivery</h4>
                <p>Your order will be delivered in 30-45 mins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Checkout Modal */}
      <CheckoutModalEnhanced 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        restaurant={restaurant}
      />
    </div>
  );
}

export default CartPage;
