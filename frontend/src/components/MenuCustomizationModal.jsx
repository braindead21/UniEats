import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './MenuCustomizationModal.css';
import { FiX, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';

const MenuCustomizationModal = React.memo(({ item, onClose, onAddToCart, isOpen }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Handle ESC key to close modal - memoized
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  // Reset form when modal opens with new item
  useEffect(() => {
    if (isOpen && item) {
      setSelectedSize('medium');
      setSelectedAddons([]);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [isOpen, item]);

  // Available sizes with price multipliers - memoized
  const sizes = useMemo(() => [
    { id: 'small', name: 'Small', multiplier: 0.75, emoji: '🥤' },
    { id: 'medium', name: 'Medium', multiplier: 1, emoji: '🍔', recommended: true },
    { id: 'large', name: 'Large', multiplier: 1.5, emoji: '🍕' }
  ], []);

  // Available add-ons - memoized based on item category
  const addons = useMemo(() => {
    const category = item?.category?.toLowerCase() || '';
    
    if (category.includes('pizza')) {
      return [
        { id: 'cheese', name: 'Extra Cheese', price: 50, emoji: '🧀' },
        { id: 'olives', name: 'Black Olives', price: 30, emoji: '🫒' },
        { id: 'mushrooms', name: 'Mushrooms', price: 40, emoji: '🍄' },
        { id: 'jalapenos', name: 'Jalapeños', price: 25, emoji: '🌶️' },
        { id: 'corn', name: 'Sweet Corn', price: 30, emoji: '🌽' }
      ];
    } else if (category.includes('burger')) {
      return [
        { id: 'cheese', name: 'Extra Cheese', price: 30, emoji: '🧀' },
        { id: 'bacon', name: 'Bacon', price: 50, emoji: '🥓' },
        { id: 'egg', name: 'Fried Egg', price: 20, emoji: '🍳' },
        { id: 'avocado', name: 'Avocado', price: 40, emoji: '🥑' },
        { id: 'onions', name: 'Grilled Onions', price: 15, emoji: '🧅' }
      ];
    } else if (category.includes('biryani') || category.includes('rice')) {
      return [
        { id: 'raita', name: 'Raita', price: 30, emoji: '🥛' },
        { id: 'egg', name: 'Boiled Egg', price: 20, emoji: '🥚' },
        { id: 'chicken', name: 'Extra Chicken', price: 80, emoji: '🍗' },
        { id: 'gravy', name: 'Extra Gravy', price: 40, emoji: '🍛' }
      ];
    } else {
      return [
        { id: 'extra-portion', name: 'Extra Portion', price: 50, emoji: '➕' },
        { id: 'extra-sauce', name: 'Extra Sauce', price: 20, emoji: '🥫' },
        { id: 'extra-spice', name: 'Extra Spicy', price: 0, emoji: '🌶️' },
        { id: 'less-spice', name: 'Less Spicy', price: 0, emoji: '❄️' }
      ];
    }
  }, [item?.category]);

  // Calculate total price - memoized
  const totalPrice = useMemo(() => {
    if (!item) return 0;

    const basePrice = item.price || 0;
    const sizeMultiplier = sizes.find(s => s.id === selectedSize)?.multiplier || 1;
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);

    const itemTotal = (basePrice * sizeMultiplier + addonsPrice) * quantity;
    return Math.round(itemTotal);
  }, [item, selectedSize, selectedAddons, quantity, addons, sizes]);

  // Handle addon toggle - memoized
  const toggleAddon = useCallback((addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  }, []);

  // Handle quantity change - memoized
  const updateQuantity = useCallback((change) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + change)));
  }, []);

  // Handle add to cart - memoized
  const handleAddToCart = useCallback(() => {
    const customizedItem = {
      ...item,
      customization: {
        size: selectedSize,
        addons: selectedAddons.map(id => addons.find(a => a.id === id)),
        specialInstructions: specialInstructions.trim()
      },
      quantity,
      customizedPrice: totalPrice / quantity, // Price per item
      totalPrice
    };

    onAddToCart(customizedItem, quantity);
    onClose();
  }, [item, selectedSize, selectedAddons, specialInstructions, quantity, totalPrice, addons, onAddToCart, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSize('medium');
      setSelectedAddons([]);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return createPortal(
    <div className="menu-customization-overlay" onClick={onClose}>
      <div className="menu-customization-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header with Image */}
        <div className="customization-header">
          <button className="close-customization-btn" onClick={onClose}>
            <FiX />
          </button>
          <div className="item-image-container">
            <img src={item.image} alt={item.name} className="customization-item-image" />
            {item.isVeg !== undefined && (
              <span className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
                {item.isVeg ? '🟢' : '🔴'}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="customization-content">
          
          {/* Item Details */}
          <div className="item-details-section">
            <h2 className="item-name">{item.name}</h2>
            <p className="item-description">{item.description || 'Delicious and freshly prepared'}</p>
            <div className="item-meta">
              <span className="item-restaurant">🍴 {item.restaurant?.name || 'Restaurant'}</span>
              {item.rating && (
                <span className="item-rating">⭐ {item.rating}</span>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="customization-section">
            <h3 className="section-title">Choose Size</h3>
            <div className="size-options">
              {sizes.map(size => {
                const sizePrice = Math.round(item.price * size.multiplier);
                return (
                  <button
                    key={size.id}
                    className={`size-option ${selectedSize === size.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    <span className="size-emoji">{size.emoji}</span>
                    <span className="size-name">{size.name}</span>
                    {size.recommended && <span className="recommended-badge">Popular</span>}
                    <span className="size-price">₹{sizePrice}</span>
                    {selectedSize === size.id && (
                      <FiCheck className="check-icon" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons Selection */}
          {addons.length > 0 && (
            <div className="customization-section">
              <h3 className="section-title">Add-ons (Optional)</h3>
              <div className="addons-grid">
                {addons.map(addon => (
                  <button
                    key={addon.id}
                    className={`addon-option ${selectedAddons.includes(addon.id) ? 'selected' : ''}`}
                    onClick={() => toggleAddon(addon.id)}
                  >
                    <span className="addon-emoji">{addon.emoji}</span>
                    <div className="addon-info">
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-price">
                        {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                      </span>
                    </div>
                    {selectedAddons.includes(addon.id) && (
                      <FiCheck className="addon-check" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="customization-section">
            <h3 className="section-title">Special Instructions (Optional)</h3>
            <textarea
              className="special-instructions-input"
              placeholder="E.g., Less spicy, no onions, extra sauce..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <span className="char-count">{specialInstructions.length}/200</span>
          </div>

        </div>

        {/* Footer with Quantity and Add to Cart */}
        <div className="customization-footer">
          
          {/* Quantity Selector */}
          <div className="quantity-selector">
            <button 
              className="quantity-btn"
              onClick={() => updateQuantity(-1)}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => updateQuantity(1)}
              disabled={quantity >= 10}
            >
              <FiPlus />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <span>Add to Cart</span>
            <span className="total-price">₹{totalPrice}</span>
          </button>

        </div>

      </div>
    </div>,
    document.body
  );
});

export default MenuCustomizationModal;
