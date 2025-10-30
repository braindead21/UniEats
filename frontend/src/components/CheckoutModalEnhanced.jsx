import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { 
  FiMapPin, 
  FiCreditCard, 
  FiCheckCircle, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiHome, 
  FiBriefcase, 
  FiMapPin as FiOther,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiCheck
} from 'react-icons/fi';
import './CheckoutModalEnhanced.css';

const CheckoutModalEnhanced = ({ isOpen, onClose, restaurant: restaurantProp }) => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  // Get restaurant from prop or from first cart item
  const restaurant = restaurantProp || (cartItems && cartItems.length > 0 ? cartItems[0].restaurant : null);

  // Helper function for showing toasts
  const showToast = (message, type = 'info') => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else if (type === 'warning') toast.warning(message);
    else toast.info(message);
  };

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    flat: '',
    area: '',
    landmark: '',
    pincode: '',
    phone: '',
    alternatePhone: '',
    instructions: 'Ring the bell',
    isDefault: false
  });

  // Payment state
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [upiId, setUpiId] = useState('');

  // Order details state
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('asap');
  const [customTime, setCustomTime] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [contactlessDelivery, setContactlessDelivery] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Load saved addresses
  useEffect(() => {
    if (isOpen) {
      loadSavedAddresses();
    }
  }, [isOpen]);

  const loadSavedAddresses = () => {
    const addresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    setSavedAddresses(addresses);
    
    // Auto-select default address
    const defaultAddr = addresses.find(addr => addr.isDefault);
    if (defaultAddr) {
      setSelectedAddress(defaultAddr);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    }
  };

  const saveAddress = () => {
    if (!validateAddress(newAddress)) return;

    const addresses = [...savedAddresses];
    const addressWithId = {
      ...newAddress,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    // If set as default, unset other defaults
    if (addressWithId.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push(addressWithId);
    localStorage.setItem('savedAddresses', JSON.stringify(addresses));
    setSavedAddresses(addresses);
    setSelectedAddress(addressWithId);
    setIsAddingAddress(false);
    resetAddressForm();
    showToast('Address saved successfully', 'success');
  };

  const updateAddress = () => {
    if (!validateAddress(newAddress)) return;

    const addresses = savedAddresses.map(addr => {
      if (addr.id === editingAddressId) {
        return { ...newAddress, id: addr.id, createdAt: addr.createdAt };
      }
      // Unset default from others if this one is default
      if (newAddress.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    localStorage.setItem('savedAddresses', JSON.stringify(addresses));
    setSavedAddresses(addresses);
    const updatedAddr = addresses.find(a => a.id === editingAddressId);
    setSelectedAddress(updatedAddr);
    setEditingAddressId(null);
    setIsAddingAddress(false);
    resetAddressForm();
    showToast('Address updated successfully', 'success');
  };

  const deleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const addresses = savedAddresses.filter(addr => addr.id !== id);
      localStorage.setItem('savedAddresses', JSON.stringify(addresses));
      setSavedAddresses(addresses);
      if (selectedAddress?.id === id) {
        setSelectedAddress(addresses[0] || null);
      }
      showToast('Address deleted', 'success');
    }
  };

  const editAddress = (address) => {
    setNewAddress({
      type: address.type,
      flat: address.flat,
      area: address.area,
      landmark: address.landmark,
      pincode: address.pincode,
      phone: address.phone,
      alternatePhone: address.alternatePhone || '',
      instructions: address.instructions || 'Ring the bell',
      isDefault: address.isDefault || false
    });
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
  };

  const validateAddress = (addr) => {
    if (!addr.flat.trim()) {
      showToast('Please enter flat/house number', 'error');
      return false;
    }
    if (!addr.area.trim()) {
      showToast('Please enter area/locality', 'error');
      return false;
    }
    if (!addr.pincode.match(/^\d{6}$/)) {
      showToast('Please enter valid 6-digit pincode', 'error');
      return false;
    }
    if (!addr.phone.match(/^\d{10}$/)) {
      showToast('Please enter valid 10-digit phone number', 'error');
      return false;
    }
    return true;
  };

  const resetAddressForm = () => {
    setNewAddress({
      type: 'home',
      flat: '',
      area: '',
      landmark: '',
      pincode: '',
      phone: '',
      alternatePhone: '',
      instructions: 'Ring the bell',
      isDefault: false
    });
  };

  const getAddressIcon = (type) => {
    switch(type) {
      case 'home': return <FiHome />;
      case 'work': return <FiBriefcase />;
      default: return <FiOther />;
    }
  };

  const calculatePricing = () => {
    const itemTotal = getCartTotal();
    const deliveryFee = itemTotal >= 200 ? 0 : 40;
    const platformFee = 5;
    const gst = Math.round((itemTotal + deliveryFee) * 0.05);
    const codCharges = selectedPayment === 'cod' ? 10 : 0;
    const total = itemTotal + deliveryFee + platformFee + gst + tipAmount + codCharges - discount;
    
    return {
      itemTotal,
      deliveryFee,
      platformFee,
      gst,
      codCharges,
      discount,
      tipAmount,
      total
    };
  };

  const applyCoupon = () => {
    // Simple coupon logic - you can expand this
    const coupons = {
      'FIRST50': { discount: 50, minOrder: 200, type: 'flat' },
      'SAVE20': { discount: 20, minOrder: 0, type: 'percentage' }
    };

    const coupon = coupons[couponCode.toUpperCase()];
    if (!coupon) {
      showToast('Invalid coupon code', 'error');
      return;
    }

    const itemTotal = getCartTotal();
    if (itemTotal < coupon.minOrder) {
      showToast(`Minimum order of ₹${coupon.minOrder} required`, 'error');
      return;
    }

    const discountAmount = coupon.type === 'flat' 
      ? coupon.discount 
      : Math.round(itemTotal * (coupon.discount / 100));

    setDiscount(discountAmount);
    setAppliedCoupon(coupon);
    showToast(`Coupon applied! You saved ₹${discountAmount}`, 'success');
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const canProceedToNextStep = () => {
    switch(currentStep) {
      case 1:
        return selectedAddress !== null;
      case 2:
        if (selectedPayment === 'upi' && upiId && !upiId.includes('@')) {
          return false;
        }
        return selectedPayment !== null;
      case 3:
        return acceptTerms;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (!canProceedToNextStep()) {
      if (currentStep === 1) showToast('Please select a delivery address', 'error');
      if (currentStep === 2) showToast('Please select a payment method', 'error');
      if (currentStep === 3) showToast('Please accept terms and conditions', 'error');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const placeOrder = async () => {
    if (!canProceedToNextStep()) return;

    setIsLoading(true);
    try {
      const pricing = calculatePricing();
      
      // Filter out any items without valid IDs and log for debugging
      const validItems = cartItems.filter(item => {
        const hasId = !!(item._id || item.id);
        if (!hasId) {
          console.error('Item missing ID:', item);
        }
        return hasId;
      });

      if (validItems.length === 0) {
        showToast('No valid items in cart', 'error');
        setIsLoading(false);
        return;
      }
      
      const orderData = {
        userId: user?.id || user?._id,
        restaurantId: restaurant?._id || restaurant?.id,
        items: validItems.map(item => ({
          itemId: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: selectedAddress,
        paymentMethod: selectedPayment,
        pricing: pricing,
        deliveryTimeSlot: deliveryTimeSlot === 'asap' ? 'ASAP (30-45 mins)' : customTime,
        tipAmount: tipAmount,
        contactlessDelivery: contactlessDelivery,
        specialInstructions: specialInstructions,
        alternatePhone: selectedAddress.alternatePhone,
        deliveryInstructions: selectedAddress.instructions,
        couponCode: couponCode,
        notifications: {
          sms: smsNotifications,
          whatsapp: whatsappUpdates
        }
      };

      // If payment is online, initiate Razorpay
      if (selectedPayment !== 'cod') {
        await initiatePayment(orderData);
      } else {
        // For COD, directly place order
        await submitOrder(orderData);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      showToast(error.message || 'Failed to place order', 'error');
      setIsLoading(false);
    }
  };

  const initiatePayment = async (orderData) => {
    try {
      // First, create the order in database to get orderId
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify({
          ...orderData,
          paymentInfo: {
            method: selectedPayment,
            status: 'pending'
          }
        })
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const createdOrder = await orderResponse.json();
      const dbOrderId = createdOrder.data?._id || createdOrder._id;

      // Create Razorpay order
      const razorpayOrderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: orderData.pricing.total,
          currency: 'INR',
          orderId: dbOrderId,
          receipt: `receipt_${dbOrderId}`
        })
      });

      if (!razorpayOrderResponse.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const { data } = await razorpayOrderResponse.json();
      const { razorpayOrderId, amount, currency, key } = data;

      // Razorpay checkout options
      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RVEalzOHCVR74z',
        amount: amount,
        currency: currency,
        name: 'UniEats',
        description: `Order from ${restaurant?.name || 'Restaurant'}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderId
              })
            });

            if (verifyResponse.ok) {
              const result = await verifyResponse.json();
              showToast('Payment successful! Order placed.', 'success');
              clearCart();
              setIsLoading(false);
              
              // Redirect after 2 seconds
              setTimeout(() => {
                onClose();
                // Optional: Redirect to orders page
                // window.location.href = '/orders';
              }, 2000);
            } else {
              const error = await verifyResponse.json();
              throw new Error(error.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showToast(error.message || 'Payment verification failed', 'error');
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.name || user?.username || '',
          email: user?.email || '',
          contact: selectedAddress.phone || ''
        },
        theme: {
          color: '#ff6b1a'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            showToast('Payment cancelled', 'warning');
          }
        },
        notes: {
          order_id: dbOrderId,
          restaurant: restaurant?.name || 'N/A'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        showToast(`Payment failed: ${response.error.description}`, 'error');
        setIsLoading(false);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      showToast(error.message || 'Failed to initiate payment', 'error');
      setIsLoading(false);
      throw error;
    }
  };

  const submitOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...orderData,
          paymentInfo: {
            method: selectedPayment,
            status: selectedPayment === 'cod' ? 'pending' : 'completed'
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }

      const result = await response.json();
      const order = result.data || result;
      
      showToast(`Order placed successfully! Order #${order.orderNumber || order._id}`, 'success');
      clearCart();
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        onClose();
        // Optional: Redirect to orders page
        // window.location.href = '/orders';
      }, 2000);
    } catch (error) {
      console.error('Order submission error:', error);
      showToast(error.message || 'Failed to place order', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="checkout-step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">{currentStep > 1 ? <FiCheck /> : '1'}</div>
        <div className="step-label">Address</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-number">{currentStep > 2 ? <FiCheck /> : '2'}</div>
        <div className="step-label">Payment</div>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Review</div>
      </div>
    </div>
  );

  const renderAddressStep = () => (
    <div className="checkout-step-content address-step">
      <div className="step-header">
        <div className="step-title">
          <FiMapPin className="step-icon" />
          <div>
            <h3>Delivery Address</h3>
            <p className="step-subtitle">Where should we deliver your order?</p>
          </div>
        </div>
      </div>
      
      {!isAddingAddress ? (
        <>
          <div className="saved-addresses-list">
            {savedAddresses.length === 0 ? (
              <div className="empty-state-enhanced">
                <div className="empty-icon-wrapper">
                  <FiMapPin size={56} />
                </div>
                <h4>No saved addresses yet</h4>
                <p>Add your first delivery address to continue</p>
                <button onClick={() => setIsAddingAddress(true)} className="btn-primary-enhanced">
                  <FiMapPin /> Add Delivery Address
                </button>
              </div>
            ) : (
              <>
                <div className="addresses-grid">
                  {savedAddresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`address-card-enhanced ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      {selectedAddress?.id === address.id && (
                        <div className="selected-indicator">
                          <FiCheckCircle />
                        </div>
                      )}
                      <div className="address-card-content">
                        <div className="address-header-new">
                          <div className="address-type-badge">
                            {getAddressIcon(address.type)}
                            <span>{address.type.charAt(0).toUpperCase() + address.type.slice(1)}</span>
                          </div>
                          {address.isDefault && (
                            <span className="default-badge-new">
                              <FiCheck size={12} /> Default
                            </span>
                          )}
                        </div>
                        <div className="address-details-new">
                          <p className="address-text-main">
                            {address.flat}, {address.area}
                          </p>
                          {address.landmark && (
                            <p className="address-landmark">
                              <FiMapPin size={14} /> {address.landmark}
                            </p>
                          )}
                          <div className="address-meta">
                            <span className="address-pincode-tag">{address.pincode}</span>
                            <span className="address-phone-tag">📞 {address.phone}</span>
                          </div>
                          {address.instructions && (
                            <p className="address-instructions-new">
                              � {address.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="address-card-actions">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            editAddress(address);
                          }} 
                          className="action-btn-new edit"
                          title="Edit address"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(address.id);
                          }} 
                          className="action-btn-new delete"
                          title="Delete address"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setIsAddingAddress(true)} 
                  className="btn-add-new-address"
                >
                  <span className="plus-icon">+</span>
                  Add New Address
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="address-form-enhanced">
          <div className="form-header">
            <h4>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
            <p>Fill in the details below</p>
          </div>

          <div className="form-section">
            <label className="form-label-new">Address Type</label>
            <div className="address-type-selector-new">
              {['home', 'work', 'other'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`type-btn-new ${newAddress.type === type ? 'active' : ''}`}
                  onClick={() => setNewAddress({...newAddress, type})}
                >
                  <span className="type-icon">{getAddressIcon(type)}</span>
                  <span className="type-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  {newAddress.type === type && <FiCheck className="check-icon" />}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="form-row-new">
              <div className="form-group-new">
                <label className="form-label-new">
                  Flat / House No. <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input-new"
                  value={newAddress.flat}
                  onChange={(e) => setNewAddress({...newAddress, flat: e.target.value})}
                  placeholder="e.g., A-204, Floor 2"
                />
              </div>
              <div className="form-group-new">
                <label className="form-label-new">
                  Area / Locality <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input-new"
                  value={newAddress.area}
                  onChange={(e) => setNewAddress({...newAddress, area: e.target.value})}
                  placeholder="e.g., Sector 62, Noida"
                />
              </div>
            </div>

            <div className="form-group-new">
              <label className="form-label-new">Landmark (Optional)</label>
              <input
                type="text"
                className="form-input-new"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                placeholder="e.g., Near Metro Station, Behind Mall"
              />
            </div>

            <div className="form-row-new">
              <div className="form-group-new">
                <label className="form-label-new">
                  Pincode <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input-new"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
              <div className="form-group-new">
                <label className="form-label-new">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className="form-input-new"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="form-group-new">
              <label className="form-label-new">Alternate Phone (Optional)</label>
              <input
                type="tel"
                className="form-input-new"
                value={newAddress.alternatePhone}
                onChange={(e) => setNewAddress({...newAddress, alternatePhone: e.target.value})}
                placeholder="10-digit number"
                maxLength={10}
              />
            </div>

            <div className="form-group-new">
              <label className="form-label-new">Delivery Instructions</label>
              <select
                className="form-select-new"
                value={newAddress.instructions}
                onChange={(e) => setNewAddress({...newAddress, instructions: e.target.value})}
              >
                <option value="Ring the bell">🔔 Ring the bell</option>
                <option value="Leave at door">🚪 Leave at door</option>
                <option value="Call on arrival">📞 Call on arrival</option>
              </select>
            </div>

            <div className="form-group-new checkbox-group-new">
              <label className="checkbox-label-new">
                <input
                  type="checkbox"
                  className="checkbox-input-new"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                />
                <span className="checkbox-text">
                  <FiCheckCircle className="checkbox-icon" />
                  Set as default address
                </span>
              </label>
            </div>
          </div>

          <div className="form-actions-new">
            <button 
              type="button"
              onClick={() => {
                setIsAddingAddress(false);
                setEditingAddressId(null);
                resetAddressForm();
              }} 
              className="btn-cancel-new"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={editingAddressId ? updateAddress : saveAddress} 
              className="btn-save-new"
            >
              {editingAddressId ? (
                <>
                  <FiCheck /> Update Address
                </>
              ) : (
                <>
                  <FiCheckCircle /> Save Address
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="checkout-step-content payment-step">
      <div className="step-header">
        <div className="step-title">
          <FiCreditCard className="step-icon" />
          <div>
            <h3>Payment Method</h3>
            <p className="step-subtitle">Choose how you'd like to pay</p>
          </div>
        </div>
      </div>
      
      <div className="payment-methods-enhanced">
        {/* UPI - Most Popular */}
        <div 
          className={`payment-card-new ${selectedPayment === 'upi' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('upi')}
        >
          <div className="payment-card-inner">
            <div className="payment-header-new">
              <div className="payment-icon-wrapper upi">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M8 12h16v2H8zm0 4h16v2H8zm0 4h10v2H8z"/>
                  <path d="M4 6h24v20H4V6zm2 2v16h20V8H6z"/>
                </svg>
              </div>
              <div className="payment-info-new">
                <div className="payment-title-row">
                  <h4>UPI</h4>
                  <span className="recommended-tag">
                    ⚡ Most Popular
                  </span>
                </div>
                <p className="payment-description">Google Pay, PhonePe, Paytm</p>
                <div className="payment-features">
                  <span className="feature-tag">✓ Instant</span>
                  <span className="feature-tag">✓ Secure</span>
                </div>
              </div>
              <div className="payment-radio-new">
                <div className={`radio-circle ${selectedPayment === 'upi' ? 'checked' : ''}`}>
                  {selectedPayment === 'upi' && <div className="radio-dot"></div>}
                </div>
              </div>
            </div>
            {selectedPayment === 'upi' && (
              <div className="payment-details-expanded">
                <div className="upi-input-group">
                  <label className="upi-label">Enter your UPI ID</label>
                  <input
                    type="text"
                    placeholder="username@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="upi-input-new"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="upi-apps">
                    <span className="upi-app-icon">📱</span>
                    <span className="upi-app-icon">💳</span>
                    <span className="upi-app-icon">🏦</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Credit/Debit Card */}
        <div 
          className={`payment-card-new ${selectedPayment === 'card' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('card')}
        >
          <div className="payment-card-inner">
            <div className="payment-header-new">
              <div className="payment-icon-wrapper card">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <rect x="4" y="8" width="24" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <rect x="4" y="12" width="24" height="4" fill="currentColor"/>
                  <rect x="8" y="20" width="8" height="2" rx="1"/>
                </svg>
              </div>
              <div className="payment-info-new">
                <h4>Credit / Debit Card</h4>
                <p className="payment-description">Visa, Mastercard, RuPay, Amex</p>
                <div className="payment-features">
                  <span className="feature-tag">✓ Rewards</span>
                  <span className="feature-tag">✓ EMI Available</span>
                </div>
              </div>
              <div className="payment-radio-new">
                <div className={`radio-circle ${selectedPayment === 'card' ? 'checked' : ''}`}>
                  {selectedPayment === 'card' && <div className="radio-dot"></div>}
                </div>
              </div>
            </div>
            {selectedPayment === 'card' && (
              <div className="payment-details-expanded">
                <div className="card-brands">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24' viewBox='0 0 40 24'%3E%3Ctext x='5' y='17' fill='%23000' font-size='12' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24'%3E%3Ccircle cx='14' cy='12' r='8' fill='%23EB001B'/%3E%3Ccircle cx='26' cy='12' r='8' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" />
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24' viewBox='0 0 40 24'%3E%3Ctext x='5' y='17' fill='%23000' font-size='10'%3ERuPay%3C/text%3E%3C/svg%3E" alt="RuPay" />
                </div>
                <p className="payment-note">You'll be redirected to secure payment page</p>
              </div>
            )}
          </div>
        </div>

        {/* Net Banking */}
        <div 
          className={`payment-card-new ${selectedPayment === 'netbanking' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('netbanking')}
        >
          <div className="payment-card-inner">
            <div className="payment-header-new">
              <div className="payment-icon-wrapper netbanking">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4l12 8v12H4V12l12-8zm0 2.4L6 13v11h20V13l-10-6.6z"/>
                  <rect x="10" y="18" width="4" height="6"/>
                  <rect x="18" y="18" width="4" height="6"/>
                  <rect x="14" y="14" width="4" height="4"/>
                </svg>
              </div>
              <div className="payment-info-new">
                <h4>Net Banking</h4>
                <p className="payment-description">All major banks supported</p>
                <div className="payment-features">
                  <span className="feature-tag">✓ Direct</span>
                  <span className="feature-tag">✓ Reliable</span>
                </div>
              </div>
              <div className="payment-radio-new">
                <div className={`radio-circle ${selectedPayment === 'netbanking' ? 'checked' : ''}`}>
                  {selectedPayment === 'netbanking' && <div className="radio-dot"></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallets */}
        <div 
          className={`payment-card-new ${selectedPayment === 'wallet' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('wallet')}
        >
          <div className="payment-card-inner">
            <div className="payment-header-new">
              <div className="payment-icon-wrapper wallet">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M6 8h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2zm0 2v12h20V10H6z"/>
                  <circle cx="20" cy="16" r="2"/>
                </svg>
              </div>
              <div className="payment-info-new">
                <h4>Wallets</h4>
                <p className="payment-description">Paytm, PhonePe, Amazon Pay</p>
                <div className="payment-features">
                  <span className="feature-tag">✓ Fast</span>
                  <span className="feature-tag">✓ Cashback</span>
                </div>
              </div>
              <div className="payment-radio-new">
                <div className={`radio-circle ${selectedPayment === 'wallet' ? 'checked' : ''}`}>
                  {selectedPayment === 'wallet' && <div className="radio-dot"></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash on Delivery */}
        <div 
          className={`payment-card-new ${selectedPayment === 'cod' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('cod')}
        >
          <div className="payment-card-inner">
            <div className="payment-header-new">
              <div className="payment-icon-wrapper cod">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10z"/>
                  <path d="M16 10c1.7 0 3 1.3 3 3 0 .8-.3 1.5-.8 2 .5.5.8 1.2.8 2 0 1.7-1.3 3-3 3s-3-1.3-3-3c0-.8.3-1.5.8-2-.5-.5-.8-1.2-.8-2 0-1.7 1.3-3 3-3z"/>
                </svg>
              </div>
              <div className="payment-info-new">
                <h4>Cash on Delivery</h4>
                <p className="payment-description">Pay when you receive</p>
                <div className="payment-features">
                  <span className="fee-tag-new">+ ₹10 handling fee</span>
                </div>
              </div>
              <div className="payment-radio-new">
                <div className={`radio-circle ${selectedPayment === 'cod' ? 'checked' : ''}`}>
                  {selectedPayment === 'cod' && <div className="radio-dot"></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Security Badge */}
      <div className="payment-security-enhanced">
        <div className="security-badge">
          <FiShield className="shield-icon" />
          <div className="security-info">
            <strong>Secured by Razorpay</strong>
            <p>256-bit encryption • PCI DSS Level 1 Compliant</p>
          </div>
        </div>
        <div className="razorpay-logo">
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#3395FF' }}>Razorpay</span>
        </div>
      </div>

      {/* Save Payment Method */}
      {selectedPayment !== 'cod' && (
        <div className="save-payment-option">
          <label className="save-payment-label">
            <input
              type="checkbox"
              checked={savePaymentMethod}
              onChange={(e) => setSavePaymentMethod(e.target.checked)}
              className="save-payment-checkbox"
            />
            <span className="save-payment-text">
              <FiCheckCircle className="save-icon" />
              Securely save this payment method for faster checkout next time
            </span>
          </label>
        </div>
      )}

      {/* Payment Info Note */}
      <div className="payment-info-note">
        <p>💡 You will be redirected to Razorpay's secure payment gateway to complete your transaction</p>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const pricing = calculatePricing();
    
    return (
      <div className="checkout-step-content review-step">
        <h3><FiCheckCircle /> Order Review</h3>
        
        {/* Restaurant Info */}
        {restaurant && (
          <div className="review-section">
            <h4>Restaurant</h4>
            <div className="restaurant-info">
              <strong>{restaurant.name || 'Restaurant Name'}</strong>
              <p>{restaurant.cuisine?.join(', ') || 'Various cuisines'}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        {cartItems && cartItems.length > 0 && (
          <div className="review-section">
            <h4>Order Items</h4>
            <div className="order-items-list">
              {cartItems.map(item => (
                <div key={item._id || item.id || Math.random()} className="order-item">
                  <span className="item-name">{item.name || 'Unknown Item'}</span>
                  <span className="item-quantity">× {item.quantity || 1}</span>
                  <span className="item-price">₹{(item.price || 0) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="review-section">
          <div className="section-header">
            <h4><FiMapPin /> Delivery Address</h4>
            <button onClick={() => setCurrentStep(1)} className="change-btn">Change</button>
          </div>
          {selectedAddress && (
            <div className="address-preview">
              <p className="address-type-preview">
                {getAddressIcon(selectedAddress.type)}
                <strong>{selectedAddress.type.charAt(0).toUpperCase() + selectedAddress.type.slice(1)}</strong>
              </p>
              <p>{selectedAddress.flat}, {selectedAddress.area}</p>
              {selectedAddress.landmark && <p>{selectedAddress.landmark}</p>}
              <p>Pincode: {selectedAddress.pincode}</p>
              <p>Phone: {selectedAddress.phone}</p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="review-section">
          <div className="section-header">
            <h4><FiCreditCard /> Payment Method</h4>
            <button onClick={() => setCurrentStep(2)} className="change-btn">Change</button>
          </div>
          <div className="payment-preview">
            <p>
              {selectedPayment === 'upi' && '💳 UPI'}
              {selectedPayment === 'card' && '💳 Credit/Debit Card'}
              {selectedPayment === 'netbanking' && '🏦 Net Banking'}
              {selectedPayment === 'wallet' && '👛 Wallet'}
              {selectedPayment === 'cod' && '💵 Cash on Delivery'}
            </p>
            {selectedPayment === 'cod' && <span className="cod-notice">+ ₹10 handling charges</span>}
          </div>
        </div>

        {/* Delivery Time Slot */}
        <div className="review-section">
          <h4><FiClock /> Delivery Time</h4>
          <div className="delivery-time-selector">
            <label className={deliveryTimeSlot === 'asap' ? 'active' : ''}>
              <input
                type="radio"
                value="asap"
                checked={deliveryTimeSlot === 'asap'}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
              />
              <span>ASAP (30-45 mins)</span>
            </label>
            <label className={deliveryTimeSlot === 'scheduled' ? 'active' : ''}>
              <input
                type="radio"
                value="scheduled"
                checked={deliveryTimeSlot === 'scheduled'}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
              />
              <span>Schedule for later</span>
            </label>
          </div>
          {deliveryTimeSlot === 'scheduled' && (
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="time-input"
            />
          )}
        </div>

        {/* Tip for Delivery Partner */}
        <div className="review-section">
          <h4><FiDollarSign /> Tip for Delivery Partner (Optional)</h4>
          <div className="tip-selector">
            {[0, 20, 30, 50].map(amount => (
              <button
                key={amount}
                className={`tip-btn ${tipAmount === amount ? 'active' : ''}`}
                onClick={() => {
                  setTipAmount(amount);
                  setCustomTip('');
                }}
              >
                {amount === 0 ? 'No Tip' : `₹${amount}`}
              </button>
            ))}
            <input
              type="number"
              placeholder="Custom"
              value={customTip}
              onChange={(e) => {
                setCustomTip(e.target.value);
                setTipAmount(parseInt(e.target.value) || 0);
              }}
              className="custom-tip-input"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div className="review-section">
          <h4><FiFileText /> Special Instructions for Restaurant</h4>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 200))}
            placeholder="Add cooking preferences, allergies, etc. (max 200 characters)"
            maxLength={200}
            rows={3}
          />
          <span className="char-count">{specialInstructions.length}/200</span>
        </div>

        {/* Contactless Delivery */}
        <div className="review-section">
          <label className="contactless-toggle">
            <input
              type="checkbox"
              checked={contactlessDelivery}
              onChange={(e) => setContactlessDelivery(e.target.checked)}
            />
            <span>Enable contactless delivery</span>
          </label>
        </div>

        {/* Coupon Code */}
        <div className="review-section">
          <h4>🎟️ Apply Coupon</h4>
          {!appliedCoupon ? (
            <div className="coupon-input-group">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="coupon-input"
              />
              <button onClick={applyCoupon} className="btn-apply-coupon">Apply</button>
            </div>
          ) : (
            <div className="applied-coupon">
              <span>✓ Coupon "{couponCode}" applied - You saved ₹{discount}</span>
              <button onClick={removeCoupon} className="remove-coupon">Remove</button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="review-section">
          <h4>📱 Order Updates</h4>
          <div className="notification-options">
            <label>
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
              />
              <span>SMS notifications</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => setWhatsappUpdates(e.target.checked)}
              />
              <span>WhatsApp updates</span>
            </label>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="review-section price-breakdown">
          <h4>Bill Summary</h4>
          <div className="price-row">
            <span>Item Total</span>
            <span>₹{pricing.itemTotal}</span>
          </div>
          <div className="price-row">
            <span>Delivery Fee {pricing.deliveryFee === 0 && <span className="free-badge">FREE</span>}</span>
            <span>₹{pricing.deliveryFee}</span>
          </div>
          <div className="price-row">
            <span>Platform Fee</span>
            <span>₹{pricing.platformFee}</span>
          </div>
          <div className="price-row">
            <span>GST & Taxes</span>
            <span>₹{pricing.gst}</span>
          </div>
          {tipAmount > 0 && (
            <div className="price-row">
              <span>Tip for Delivery Partner</span>
              <span>₹{tipAmount}</span>
            </div>
          )}
          {pricing.codCharges > 0 && (
            <div className="price-row">
              <span>COD Handling Charges</span>
              <span>₹{pricing.codCharges}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="price-row discount-row">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>
          )}
          <div className="price-row total-row">
            <span>Total Amount</span>
            <span>₹{pricing.total}</span>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="review-section">
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>I accept the <a href="/terms" target="_blank">terms and conditions</a> and <a href="/privacy" target="_blank">privacy policy</a></span>
          </label>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal-enhanced">
        <div className="checkout-modal-header">
          <h2>Checkout</h2>
          <button onClick={onClose} className="close-btn">
            <FiX />
          </button>
        </div>

        {renderStepIndicator()}

        <div className="checkout-modal-body">
          {currentStep === 1 && renderAddressStep()}
          {currentStep === 2 && renderPaymentStep()}
          {currentStep === 3 && renderReviewStep()}
        </div>

        <div className="checkout-modal-footer">
          <div className="footer-actions">
            {currentStep > 1 && (
              <button onClick={handlePreviousStep} className="btn-back">
                <FiChevronLeft /> Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                onClick={handleNextStep} 
                className="btn-next"
                disabled={!canProceedToNextStep()}
              >
                Next <FiChevronRight />
              </button>
            ) : (
              <button 
                onClick={placeOrder} 
                className="btn-place-order"
                disabled={!acceptTerms || isLoading}
              >
                {isLoading ? 'Placing Order...' : `Place Order ₹${calculatePricing().total}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModalEnhanced;
