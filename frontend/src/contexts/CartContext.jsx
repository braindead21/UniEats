import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

console.log('CartContext.jsx loaded - version 2.0');

const CartContext = createContext();

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null); // For removal animation
  const [updatingItemId, setUpdatingItemId] = useState(null); // For quantity animation
  
  // Toast notifications - will be initialized after ToastProvider is available
  let toast = null;
  try {
    toast = useToast();
  } catch (e) {
    // Toast context not available yet
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('cartRestaurantId');
    const savedRestaurant = localStorage.getItem('cartRestaurant');
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }

    if (savedRestaurant) {
      try {
        setRestaurant(JSON.parse(savedRestaurant));
      } catch (error) {
        console.error('Error loading restaurant from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (restaurantId) {
      localStorage.setItem('cartRestaurantId', restaurantId);
    } else {
      localStorage.removeItem('cartRestaurantId');
    }
    if (restaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
    } else {
      localStorage.removeItem('cartRestaurant');
    }
  }, [cartItems, restaurantId, restaurant]);

  const addToCart = (item, quantity = 1) => {
    // Normalize restaurant ID to string for consistent comparison
    const itemRestaurantId = String(item.restaurantId || item.restaurant?._id || item.restaurant);
    const currentRestaurantId = String(restaurantId || '');
    
    console.log('🛒 Adding to cart:', { 
      itemName: item.name,
      itemId: item._id,
      itemRestaurantId: itemRestaurantId,
      currentRestaurantId: currentRestaurantId,
      areEqual: itemRestaurantId === currentRestaurantId,
      isDifferent: currentRestaurantId && itemRestaurantId !== currentRestaurantId,
      currentCartItems: cartItems.length,
      fullItem: item
    });

    // Check if this item is from a different restaurant
    if (currentRestaurantId && itemRestaurantId !== currentRestaurantId) {
      console.log('🔄 Different restaurant - clearing cart and adding new item');
      // Automatically clear cart and add new item from different restaurant
      setRestaurantId(itemRestaurantId);
      if (item.restaurant) {
        setRestaurant(item.restaurant);
      }
      setCartItems([{ ...item, quantity }]);
      if (toast) {
        toast.warning(`Cart cleared! Now ordering from ${item.restaurant?.name || 'new restaurant'}`);
      }
      return true;
    }

    // Set restaurant info if not already set
    if (!currentRestaurantId) {
      console.log('🏪 Setting restaurant for first item');
    }
    
    // Always update restaurant info to ensure it's set
    setRestaurantId(itemRestaurantId);
    if (item.restaurant) {
      setRestaurant(item.restaurant);
    }

    setCartItems(prevItems => {
      console.log('📦 Current cart before adding:', prevItems.map(i => ({ name: i.name, id: i._id })));
      console.log('🔍 Looking for existing item with _id:', item._id);
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      console.log('🔍 Found existing item?', existingItem ? existingItem.name : 'No');
      
      if (existingItem) {
        console.log('➕ Incrementing quantity for existing item');
        const updated = prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
        console.log('📦 Cart after update:', updated.map(i => i.name));
        if (toast) {
          toast.success(`Updated ${item.name} quantity`);
        }
        return updated;
      } else {
        console.log('✨ Adding new item to cart');
        const updated = [...prevItems, { ...item, quantity }];
        console.log('📦 Cart after adding:', updated.map(i => i.name));
        if (toast) {
          toast.success(`${item.name} added to cart!`);
        }
        return updated;
      }
    });

    return true;
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cartItems.find(item => item._id === itemId);
    
    // Trigger animation
    setRemovingItemId(itemId);
    
    // Remove after animation completes
    setTimeout(() => {
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item._id !== itemId);
        
        // If cart is empty, clear restaurant info
        if (updatedItems.length === 0) {
          setRestaurantId(null);
          setRestaurant(null);
        }
        
        return updatedItems;
      });
      
      setRemovingItemId(null);
      
      // Show toast with undo option
      if (toast && itemToRemove) {
        toast.info(`${itemToRemove.name} removed`, {
          duration: 4000,
          action: {
            label: 'Undo',
            onClick: () => {
              // Restore the item
              setCartItems(prev => {
                // Check if item already exists (double-add protection)
                const exists = prev.find(item => item._id === itemToRemove._id);
                if (exists) return prev;
                
                // Add back with restaurant info
                if (!restaurantId && itemToRemove.restaurantId) {
                  setRestaurantId(itemToRemove.restaurantId);
                  setRestaurant(itemToRemove.restaurant);
                }
                
                return [...prev, itemToRemove];
              });
              toast.success('Item restored!');
            }
          }
        });
      }
    }, 400); // Match animation duration
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    // Trigger animation
    setUpdatingItemId(itemId);
    setTimeout(() => setUpdatingItemId(null), 400);

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setRestaurant(null);
    if (toast) {
      toast.info('Cart cleared');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isItemInCart = (itemId) => {
    return cartItems.some(item => item._id === itemId);
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  // Calculate pricing breakdown
  const getPricingBreakdown = () => {
    const subtotal = getCartTotal();
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const deliveryFee = subtotal > 300 ? 0 : 40; // Free delivery above ₹300
    const platformFee = Math.round(subtotal * 0.02); // 2% platform fee
    const total = subtotal + tax + deliveryFee + platformFee;

    return {
      subtotal,
      tax,
      deliveryFee,
      platformFee,
      total
    };
  };

  // Checkout function
  const checkout = async (deliveryAddress, paymentMethod, specialInstructions = '') => {
    console.log('Checkout function called with:', { deliveryAddress, paymentMethod, specialInstructions });
    console.log('Current cart items:', cartItems);
    console.log('Current restaurant ID:', restaurantId);
    
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    if (!restaurantId) {
      throw new Error('No restaurant selected');
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity,
          customizations: item.customizations || [],
          variant: item.variant || null,
          specialInstructions: item.specialInstructions || ''
        })),
        restaurantId,
        deliveryAddress,
        paymentMethod,
        specialInstructions
      };

      console.log('Sending order data:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('Order response:', response);

      if (response && response.success) {
        // Clear cart after successful order
        clearCart();
        return {
          success: true,
          order: response.order,
          message: response.message || 'Order placed successfully!'
        };
      } else {
        throw new Error((response && response.message) || 'Order placement failed - no response data');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      console.error('Error response:', error.response);
      throw new Error(error.response?.data?.message || error.message || 'Checkout failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const value = {
    cartItems,
    restaurantId,
    restaurant,
    isCheckingOut,
    removingItemId,
    updatingItemId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isItemInCart,
    getItemQuantity,
    getPricingBreakdown,
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { useCart };
