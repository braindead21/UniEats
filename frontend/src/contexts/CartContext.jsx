import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurantId = localStorage.getItem('cartRestaurantId');
    
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
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (restaurantId) {
      localStorage.setItem('cartRestaurantId', restaurantId);
    } else {
      localStorage.removeItem('cartRestaurantId');
    }
  }, [cartItems, restaurantId]);

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
      
      // If cart is empty, clear restaurant ID
      if (updatedItems.length === 0) {
        setRestaurantId(null);
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

  const value = {
    cartItems,
    restaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isItemInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
