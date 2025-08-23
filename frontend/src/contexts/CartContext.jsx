import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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
    // Check if this item is from a different restaurant
    if (restaurantId && restaurantId !== item.restaurantId) {
      const confirmSwitch = window.confirm(
        'Adding this item will clear your current cart. Do you want to continue?'
      );
      if (!confirmSwitch) return false;
      clearCart();
    }

    setRestaurantId(item.restaurantId);
    if (item.restaurant) {
      setRestaurant(item.restaurant);
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });

    return true;
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== itemId);
      
      // If cart is empty, clear restaurant info
      if (updatedItems.length === 0) {
        setRestaurantId(null);
        setRestaurant(null);
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

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
