import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CouponSection.css';
import { FiTag, FiCheck, FiX, FiPercent } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';

/**
 * CouponSection Component
 * Handles coupon application, validation, and display
 * ✅ OPTIMIZED with React.memo, useMemo, useCallback
 */
const CouponSection = React.memo(({ cartTotal, onCouponApply, appliedCoupon, onCouponRemove }) => {
  const [couponCode, setCouponCode] = useState('');
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { success, error, warning } = useToast();

  // Available coupons (in real app, would come from API) - memoized
  const availableCoupons = useMemo(() => [
    {
      code: 'FIRST50',
      title: '50% OFF on First Order',
      description: 'Get 50% discount on your first order',
      discount: 50,
      discountType: 'percentage',
      minOrder: 200,
      maxDiscount: 150,
      icon: '🎉',
      validFor: 'First-time users only'
    },
    {
      code: 'SAVE100',
      title: '₹100 OFF',
      description: 'Flat ₹100 off on orders above ₹400',
      discount: 100,
      discountType: 'flat',
      minOrder: 400,
      maxDiscount: 100,
      icon: '💰',
      validFor: 'All users'
    },
    {
      code: 'WEEKEND20',
      title: '20% OFF Weekend Special',
      description: 'Get 20% off on weekend orders',
      discount: 20,
      discountType: 'percentage',
      minOrder: 300,
      maxDiscount: 200,
      icon: '🎊',
      validFor: 'Valid on Sat & Sun'
    },
    {
      code: 'FLAT60',
      title: '₹60 OFF',
      description: 'Flat ₹60 discount on orders above ₹250',
      discount: 60,
      discountType: 'flat',
      minOrder: 250,
      maxDiscount: 60,
      icon: '🔥',
      validFor: 'All users'
    },
    {
      code: 'MEGA30',
      title: '30% OFF Mega Deal',
      description: 'Get 30% discount up to ₹300',
      discount: 30,
      discountType: 'percentage',
      minOrder: 500,
      maxDiscount: 300,
      icon: '⚡',
      validFor: 'Orders above ₹500'
    }
  ], []);

  // Calculate discount amount - stable callback
  const calculateDiscount = useCallback((coupon) => {
    if (cartTotal < coupon.minOrder) return 0;

    if (coupon.discountType === 'percentage') {
      const discountAmount = (cartTotal * coupon.discount) / 100;
      return Math.min(discountAmount, coupon.maxDiscount);
    } else {
      return coupon.discount;
    }
  }, [cartTotal]);

  // Handle manual coupon apply - stable callback
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      warning('Please enter a coupon code');
      return;
    }

    setIsApplying(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      error('Invalid coupon code');
      setIsApplying(false);
      return;
    }

    if (cartTotal < coupon.minOrder) {
      warning(`Add items worth ₹${coupon.minOrder - cartTotal} more to use this coupon`);
      setIsApplying(false);
      return;
    }

    const discountAmount = calculateDiscount(coupon);
    onCouponApply({ ...coupon, discountAmount });
    success(`Coupon "${coupon.code}" applied! You saved ₹${discountAmount}`);
    setCouponCode('');
    setShowAvailableCoupons(false);
    setIsApplying(false);
  }, [couponCode, cartTotal, availableCoupons, calculateDiscount, onCouponApply, success, error, warning]);

  // Handle coupon selection from list - stable callback
  const handleSelectCoupon = useCallback((coupon) => {
    if (cartTotal < coupon.minOrder) {
      warning(`Add items worth ₹${coupon.minOrder - cartTotal} more to use this coupon`);
      return;
    }

    const discountAmount = calculateDiscount(coupon);
    onCouponApply({ ...coupon, discountAmount });
    success(`Coupon "${coupon.code}" applied! You saved ₹${discountAmount}`);
    setShowAvailableCoupons(false);
  }, [cartTotal, calculateDiscount, onCouponApply, success, warning]);

  // Handle remove coupon - stable callback
  const handleRemoveCoupon = useCallback(() => {
    onCouponRemove();
    success('Coupon removed');
  }, [onCouponRemove, success]);

  // Find best coupon for current cart total - memoized
  const bestCoupon = useMemo(() => {
    if (appliedCoupon) return null;
    
    const eligibleCoupons = availableCoupons
      .filter(c => cartTotal >= c.minOrder)
      .map(c => ({ ...c, saving: calculateDiscount(c) }))
      .sort((a, b) => b.saving - a.saving);
    
    return eligibleCoupons[0] || null;
  }, [appliedCoupon, availableCoupons, cartTotal, calculateDiscount]);

  // Auto-hide coupon list when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAvailableCoupons && !e.target.closest('.coupon-section')) {
        setShowAvailableCoupons(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvailableCoupons]);

  return (
    <div className="coupon-section">
      
      {/* Applied Coupon Display */}
      {appliedCoupon ? (
        <div className="applied-coupon-banner">
          <div className="applied-coupon-info">
            <span className="applied-coupon-icon">{appliedCoupon.icon || '🎉'}</span>
            <div className="applied-coupon-details">
              <div className="applied-coupon-code">{appliedCoupon.code}</div>
              <div className="applied-coupon-savings">
                You saved ₹{appliedCoupon.discountAmount}!
              </div>
            </div>
          </div>
          <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
            <FiX />
          </button>
        </div>
      ) : (
        <>
          {/* Best Coupon Suggestion */}
          {bestCoupon && (
            <div className="best-coupon-suggestion" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{bestCoupon.icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Best offer: {bestCoupon.code}</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Save ₹{bestCoupon.saving} on this order!</div>
                </div>
              </div>
              <button 
                onClick={() => handleSelectCoupon(bestCoupon)}
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Apply
              </button>
            </div>
          )}

          {/* Coupon Input */}
          <div className="coupon-input-container">
            <div className="coupon-input-wrapper">
              <FiTag className="coupon-input-icon" />
              <input
                type="text"
                className="coupon-input"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              {couponCode && (
                <button 
                  className="clear-coupon-btn"
                  onClick={() => setCouponCode('')}
                >
                  <FiX />
                </button>
              )}
            </div>
            <button 
              className="apply-coupon-btn"
              onClick={handleApplyCoupon}
              disabled={isApplying || !couponCode}
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {/* View Available Coupons Button */}
          <button 
            className="view-coupons-btn"
            onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
          >
            <FiPercent className="view-coupons-icon" />
            <span>View {availableCoupons.length} available coupons</span>
          </button>
        </>
      )}

      {/* Available Coupons List */}
      {showAvailableCoupons && !appliedCoupon && (
        <div className="available-coupons-panel">
          <div className="available-coupons-header">
            <h3>Available Offers</h3>
            <button 
              className="close-coupons-btn"
              onClick={() => setShowAvailableCoupons(false)}
            >
              <FiX />
            </button>
          </div>
          
          <div className="available-coupons-list">
            {availableCoupons.map((coupon, index) => {
              const isEligible = cartTotal >= coupon.minOrder;
              const potentialDiscount = calculateDiscount(coupon);
              const amountNeeded = Math.max(0, coupon.minOrder - cartTotal);

              return (
                <div 
                  key={index} 
                  className={`coupon-card ${isEligible ? 'eligible' : 'not-eligible'}`}
                >
                  <div className="coupon-card-header">
                    <span className="coupon-icon">{coupon.icon}</span>
                    <div className="coupon-code-badge">{coupon.code}</div>
                  </div>

                  <div className="coupon-card-body">
                    <h4 className="coupon-title">{coupon.title}</h4>
                    <p className="coupon-description">{coupon.description}</p>
                    
                    <div className="coupon-details">
                      <div className="coupon-detail-item">
                        <span className="detail-label">Min Order:</span>
                        <span className="detail-value">₹{coupon.minOrder}</span>
                      </div>
                      {coupon.discountType === 'percentage' && (
                        <div className="coupon-detail-item">
                          <span className="detail-label">Max Discount:</span>
                          <span className="detail-value">₹{coupon.maxDiscount}</span>
                        </div>
                      )}
                      <div className="coupon-detail-item">
                        <span className="detail-label">Valid For:</span>
                        <span className="detail-value">{coupon.validFor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="coupon-card-footer">
                    {isEligible ? (
                      <button 
                        className="apply-coupon-card-btn"
                        onClick={() => handleSelectCoupon(coupon)}
                      >
                        <FiCheck /> Apply & Save ₹{potentialDiscount}
                      </button>
                    ) : (
                      <div className="coupon-not-eligible">
                        Add items worth ₹{amountNeeded} more to use this coupon
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
});

CouponSection.displayName = 'CouponSection';

export default CouponSection;
