// ⚡ PERFORMANCE OPTIMIZED - Code Splitting with React.lazy + Suspense
import './App.css';
import './header-animations.css';
import './hero-styles.css';
import './restaurant-styles.css';
import './menu-styles.css';
import './cart-styles.css';
import './components/AdminDashboard.css';
import './components/StudentDashboard.css';
import './performance-optimizations.css';
import './micro-interactions.css';
import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import { useCart } from './contexts/CartContext.jsx';
import { useToast } from './contexts/ToastContext.jsx';
import { useRestaurants } from './hooks/useRestaurants.js';
import { api } from './services/api.js';

// Critical components - load immediately
import { RestaurantCardSkeleton, MenuItemSkeleton, SkeletonGrid, SearchResultSkeleton } from './components/Skeleton.jsx';
import { EmptyCart, NoOrders, NoSearchResults, NoMenuItems, NoRestaurants } from './components/EmptyState.jsx';
import LazyImage, { RestaurantImage, MenuItemImage } from './components/LazyImage.jsx';

// Code-split route components - lazy load on demand (40% bundle size reduction!)
const AdminDashboard = lazy(() => import('./components/AdminDashboard.jsx'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard.jsx'));
const RestaurantOwnerDashboard = lazy(() => import('./components/RestaurantOwnerDashboard.jsx'));
const DeliveryPartnerDashboard = lazy(() => import('./components/DeliveryPartnerDashboard.jsx'));
const SearchPage = lazy(() => import('./components/SearchPage.jsx'));
const CartPage = lazy(() => import('./components/CartPage.jsx'));

// Code-split UI feature modals - only load when needed
const MenuCustomizationModal = lazy(() => import('./components/MenuCustomizationModal.jsx'));
const RestaurantDetailModal = lazy(() => import('./components/RestaurantDetailModal.jsx'));
const CouponSection = lazy(() => import('./components/CouponSection.jsx'));
const SavedAddresses = lazy(() => import('./components/SavedAddresses.jsx'));
const RatingReviewModal = lazy(() => import('./components/RatingReviewModal.jsx'));
const NotificationCenter = lazy(() => import('./components/NotificationCenter.jsx'));
const FilterPanel = lazy(() => import('./components/FilterPanel.jsx'));
const FavoritesPage = lazy(() => import('./components/FavoritesPage.jsx'));
const FavoriteButton = lazy(() => import('./components/FavoriteButton.jsx'));
const RestaurantOwnerPanel = lazy(() => import('./components/RestaurantOwnerPanel.jsx'));
const DarkModeToggle = lazy(() => import('./components/DarkModeToggle.jsx'));

// Code-split authentication components
const AdminLogin = lazy(() => import('./components/AdminLogin.jsx'));
const StudentLogin = lazy(() => import('./components/StudentLogin.jsx'));
const StudentSignup = lazy(() => import('./components/StudentSignup.jsx'));
const RestaurantLogin = lazy(() => import('./components/RestaurantLogin.jsx'));
const RestaurantSignup = lazy(() => import('./components/RestaurantSignup.jsx'));
const DeliveryLogin = lazy(() => import('./components/DeliveryLogin.jsx'));
const DeliverySignup = lazy(() => import('./components/DeliverySignup.jsx'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
    fontSize: '18px',
    color: '#666'
  }}>
    <div>Loading...</div>
  </div>
);

// ScrollInCard component for animation - highly optimized for performance
function ScrollInCard({ children, delay = 0, className = '', ...props }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    // Single-fire observer with aggressive settings
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          // Use RAF to batch DOM updates
          requestAnimationFrame(() => {
            node.classList.add('scroll-in');
            setVisible(true);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'scroll-in' : ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Premium Login Page
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login to UniEats</h2>
        <form className="auth-form">
          <input type="email" placeholder="Email" className="auth-input" required />
          <div className="auth-password-row">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="auth-input" required />
            <button type="button" className="auth-show-btn" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button>
          </div>
          <button className="auth-btn" type="submit">Login</button>
        </form>
        <div className="auth-forgot-row">
          <a href="#" className="auth-link">Forgot password?</a>
        </div>
        <div className="auth-switch">
          Don&apos;t have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
// Premium Signup Page
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Your UniEats Account</h2>
        <form className="auth-form">
          <input type="text" placeholder="Name" className="auth-input" required />
          <input type="email" placeholder="College Email ID" className="auth-input" required />
          <div className="auth-password-row">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="auth-input" required />
            <button type="button" className="auth-show-btn" onClick={() => setShowPassword(v => !v)}>{showPassword ? "Hide" : "Show"}</button>
          </div>
          <div className="auth-password-row">
            <input type={showConfirm ? "text" : "password"} placeholder="Confirm Password" className="auth-input" required />
            <button type="button" className="auth-show-btn" onClick={() => setShowConfirm(v => !v)}>{showConfirm ? "Hide" : "Show"}</button>
          </div>
          <div className="auth-upload-row">
            <label className="auth-upload-label">College ID Card Proof:</label>
            <input type="file" accept="image/*,.pdf" className="auth-upload-input" required />
          </div>
          <div className="auth-password-note">Password must be at least 6 characters and contain a number.</div>
          <button className="auth-btn" type="submit">Sign Up</button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'confirmed': return '#2196f3';
      case 'preparing': return '#ff9800';
      case 'out_for_delivery': return '#9c27b0';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className="orders-page" style={{padding:'64px 20px', textAlign:'center'}}>
        <h2>Your Orders</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page" style={{padding:'64px 20px', textAlign:'center'}}>
        <h2>Your Orders</h2>
        <p style={{color: '#f44336'}}>{error}</p>
        <button onClick={fetchOrders} style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page" style={{padding:'64px 20px', maxWidth: '1200px', margin: '0 auto'}}>
      <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Your Orders</h2>
      
      {orders.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <p style={{fontSize: '18px', color: '#666'}}>No orders found</p>
          <p style={{color: '#888'}}>When you place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card" style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
                <div>
                  <h3 style={{margin: '0 0 5px 0', color: '#333'}}>Order #{order.orderNumber}</h3>
                  <p style={{margin: '0', color: '#666', fontSize: '14px'}}>{formatDate(order.createdAt)}</p>
                </div>
                <span style={{
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{marginBottom: '15px'}}>
                <p style={{margin: '0 0 10px 0', fontWeight: 'bold', color: '#333'}}>
                  {order.restaurant?.name || 'Restaurant'}
                </p>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '5px 0',
                      borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
                    }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                <div style={{fontSize: '14px', color: '#666'}}>
                  <p style={{margin: '0 0 5px 0'}}>Delivery to: {order.deliveryAddress?.name}</p>
                  <p style={{margin: '0'}}>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
                    Total: ₹{order.pricing?.total || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
    // Authentication and cart state
  const { isAuthenticated, user, login, register, logout } = useAuth();
  const { cartItems, getCartCount, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart, getPricingBreakdown, checkout, isCheckingOut, restaurant, removingItemId, updatingItemId } = useCart();
  const toast = useToast(); // Add toast hook
  
  // Local fallback restaurant data (defined first before being used)
  const localRestaurants = [
    {
      name: "Spice Garden",
      cuisine: ["Indian", "Biryani"],
      rating: 4.8,
      deliveryTime: "25-30 min",
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      tag: "🔥 Trending",
      offers: "50% OFF",
      isOpen: true
    },
    {
      name: "Dragon Wok",
      cuisine: ["Chinese", "Asian"],
      rating: 4.6,
      deliveryTime: "30-35 min",
      distance: "2.1 km",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
      tag: "⚡ Fast Delivery",
      offers: "Free Delivery",
      isOpen: true
    },
    {
      name: "Pizza Paradise",
      cuisine: ["Italian", "Pizza"],
      rating: 4.7,
      deliveryTime: "20-25 min",
      distance: "0.8 km",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      tag: "⭐ Popular",
      offers: "Buy 1 Get 1",
      isOpen: true
    },
    {
      name: "Burger Hub",
      cuisine: ["Fast Food", "Burgers"],
      rating: 4.5,
      deliveryTime: "15-20 min",
      distance: "1.5 km",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      tag: "💰 Budget Friendly",
      offers: "30% OFF",
      isOpen: true
    },
    {
      name: "Sushi Station",
      cuisine: ["Japanese", "Sushi"],
      rating: 4.9,
      deliveryTime: "35-40 min",
      distance: "3.2 km",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      tag: "⭐ Premium",
      offers: "20% OFF",
      isOpen: true
    },
    {
      name: "Taco Fiesta",
      cuisine: ["Mexican", "Tacos"],
      rating: 4.4,
      deliveryTime: "25-30 min",
      distance: "1.8 km",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
      tag: "🌮 New",
      offers: "Free Nachos",
      isOpen: true
    }
  ];
  
  // Local fallback menu data (defined first before being used)
  const localMenuItems = [
    {
      name: "Chicken Biryani",
      category: "Indian",
      price: 249,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop",
      restaurant: { name: "Spice Garden" },
      rating: 4.8,
      isVeg: false,
      badge: "🔥 Bestseller",
      description: "Aromatic basmati rice with tender chicken"
    },
    {
      name: "Margherita Pizza",
      category: "Italian",
      price: 299,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
      restaurant: { name: "Pizza Paradise" },
      rating: 4.7,
      isVeg: true,
      badge: "⭐ Popular",
      description: "Classic pizza with fresh mozzarella"
    },
    {
      name: "Chicken Hakka Noodles",
      category: "Chinese",
      price: 199,
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop",
      restaurant: { name: "Dragon Wok" },
      rating: 4.6,
      isVeg: false,
      badge: "⚡ Quick",
      description: "Stir-fried noodles with veggies"
    },
    {
      name: "Paneer Tikka",
      category: "Indian",
      price: 229,
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop",
      restaurant: { name: "Spice Garden" },
      rating: 4.7,
      isVeg: true,
      badge: "🌱 Veg Special",
      description: "Grilled cottage cheese with spices"
    },
    {
      name: "Classic Burger",
      category: "Fast Food",
      price: 159,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop",
      restaurant: { name: "Burger Hub" },
      rating: 4.5,
      isVeg: false,
      badge: "💰 Value",
      description: "Juicy beef patty with cheese"
    },
    {
      name: "California Roll",
      category: "Japanese",
      price: 349,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop",
      restaurant: { name: "Sushi Station" },
      rating: 4.9,
      isVeg: false,
      badge: "⭐ Premium",
      description: "Fresh sushi with avocado"
    },
    {
      name: "Chicken Tacos",
      category: "Mexican",
      price: 189,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop",
      restaurant: { name: "Taco Fiesta" },
      rating: 4.4,
      isVeg: false,
      badge: "🌮 Spicy",
      description: "Soft tacos with grilled chicken"
    },
    {
      name: "Pasta Alfredo",
      category: "Italian",
      price: 269,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
      restaurant: { name: "Pizza Paradise" },
      rating: 4.6,
      isVeg: true,
      badge: "🧀 Creamy",
      description: "Creamy white sauce pasta"
    },
    {
      name: "Masala Dosa",
      category: "Indian",
      price: 129,
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop",
      restaurant: { name: "Spice Garden" },
      rating: 4.8,
      isVeg: true,
      badge: "💰 Budget",
      description: "Crispy dosa with potato filling"
    }
  ];
  
  // Dynamic restaurant data
  const { restaurants: fetchedRestaurants, loading: restaurantsLoading } = useRestaurants();
  
  // Use local fallback if API returns empty
  const restaurantData = (fetchedRestaurants && fetchedRestaurants.length > 0) 
    ? fetchedRestaurants 
    : localRestaurants;
  
  // Dynamic menu items
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Price animation state
  const [priceUpdated, setPriceUpdated] = useState(false);
  
  // Restaurant selection state
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);
  
  // Fetch menu items from all restaurants
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuLoading(true);
        console.log('Fetching menu items...');
        const response = await api.get('/menu');
        console.log('Menu response:', response);
        
        // Use local fallback data if API returns empty
        if (response.menu && response.menu.length > 0) {
          // Ensure all items have _id field
          const itemsWithIds = response.menu.map((item, index) => ({
            ...item,
            _id: item._id || `menu-item-${index}-${Date.now()}`
          }));
          setMenuItems(itemsWithIds);
        } else {
          console.log('Using local fallback menu data');
          // Add unique IDs to local menu items
          const itemsWithIds = localMenuItems.map((item, index) => ({
            ...item,
            _id: `local-${item.name.toLowerCase().replace(/\s+/g, '-')}-${index}`
          }));
          setMenuItems(itemsWithIds);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        console.log('Using local fallback menu data due to error');
        // Add unique IDs to local menu items
        const itemsWithIds = localMenuItems.map((item, index) => ({
          ...item,
          _id: `local-${item.name.toLowerCase().replace(/\s+/g, '-')}-${index}`
        }));
        setMenuItems(itemsWithIds);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenuItems();
  }, []);
  
  // Static data (will be replaced with dynamic data later)
  const restaurantCategories = ['All', 'Indian', 'Chinese', 'Italian', 'Fast Food'];
  const [selectedRestaurantCategory, setSelectedRestaurantCategory] = useState('All');
  const filteredRestaurants = selectedRestaurantCategory === 'All'
    ? restaurantData
    : restaurantData.filter(r => {
        const cuisine = Array.isArray(r.cuisine) ? r.cuisine : [r.cuisine];
        return cuisine.includes(selectedRestaurantCategory);
      });

  // Dynamic food categories based on menu items
  const foodCategories = ['All', ...new Set(menuItems.map(item => item.category))];
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('All');
  
  // Filter food items by category and selected restaurant
  const filteredFoodItems = (() => {
    let items = selectedFoodCategory === 'All' ? menuItems : menuItems.filter(item => item.category === selectedFoodCategory);
    
    // Further filter by restaurant if one is selected
    if (showRestaurantMenu && selectedRestaurant) {
      items = items.filter(item => {
        const itemRestaurantName = item.restaurant?.name || '';
        return itemRestaurantName === selectedRestaurant.name;
      });
    }
    
    return items;
  })();

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [modal, setModal] = useState(null); // 'login' | 'signup' | 'partner' | null
  const [cartOpen, setCartOpen] = useState(false);
  const [partnerThankYou, setPartnerThankYou] = useState(false);
  const navigate = useNavigate();
  const [scrollTarget, setScrollTarget] = useState(null);
  const [showSearchPage, setShowSearchPage] = useState(false);

  // New UI Features State
  const [showMenuCustomization, setShowMenuCustomization] = useState(false);
  const [selectedMenuItemForCustomization, setSelectedMenuItemForCustomization] = useState(null);
  const [showRestaurantDetail, setShowRestaurantDetail] = useState(false);
  const [selectedRestaurantForDetail, setSelectedRestaurantForDetail] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  
  // Track price changes for animation - MOVED HERE AFTER appliedCoupon DECLARATION
  const prevTotalRef = useRef(0);
  useEffect(() => {
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
  
  // Additional Feature States
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    cuisines: [],
    priceRange: [0, 1000],
    minRating: null,
    maxDeliveryTime: null,
    dietary: [],
    sortBy: 'popular'
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [orderToRate, setOrderToRate] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/ping')
      .then(res => res.json())
      .then(data => console.log('Backend /api/ping:', data))
      .catch(err => console.error('Backend connection error:', err));
  }, []);

  // Prevent background scroll when modal, cart, or search page is open
  useEffect(() => {
    if (modal || cartOpen || showSearchPage || showMenuCustomization || showRestaurantDetail || showNotificationCenter || showFilterPanel || showRatingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modal, cartOpen, showSearchPage, showMenuCustomization, showRestaurantDetail, showNotificationCenter, showFilterPanel, showRatingModal]);

  function handleHomeClick(e) {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function handleNavSection(e, sectionId) {
    e.preventDefault();
    if (location.pathname !== '/') {
      setScrollTarget(sectionId);
      navigate('/');
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  useEffect(() => {
    if (location.pathname === '/' && scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setScrollTarget(null);
    }
  }, [location.pathname, scrollTarget]);

  // Add to Cart handler - Opens customization modal
  function handleAddToCart(item) {
    setSelectedMenuItemForCustomization(item);
    setShowMenuCustomization(true);
  }

  // Handle customized item add to cart
  function handleCustomizedAddToCart(customizedItem, quantity) {
    addToCart(customizedItem, quantity);
    // Close modal after successful add
    setShowMenuCustomization(false);
    setSelectedMenuItemForCustomization(null);
    // Don't auto-open cart - let user click "View Cart" button to see it
  }

  // Get item quantity from cart
  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle quantity change from menu
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item._id);
    } else {
      const currentQuantity = getItemQuantity(item._id);
      if (currentQuantity === 0) {
        addToCart(item, newQuantity);
      } else {
        updateQuantity(item._id, newQuantity);
      }
    }
  };

  // Handle restaurant detail view
  const handleRestaurantDetailView = (restaurant, e) => {
    if (e) e.stopPropagation();
    setSelectedRestaurantForDetail(restaurant);
    setShowRestaurantDetail(true);
  };

  // Handle view menu from restaurant detail
  const handleViewMenuFromDetail = (restaurant) => {
    setShowRestaurantDetail(false);
    handleRestaurantClick(restaurant);
  };

  // Handle restaurant click - scroll to menu and filter by restaurant
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantMenu(true);
    
    // Scroll to menu section
    setTimeout(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle dish click - scroll to menu section
  const handleDishClick = (dish) => {
    if (dish.restaurant) {
      setSelectedRestaurant(dish.restaurant);
      setShowRestaurantMenu(true);
    }
    
    // Scroll to menu section
    setTimeout(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Advanced Search Handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    // Search in menu items
    const lowerQuery = query.toLowerCase();
    const results = menuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.restaurant?.name?.toLowerCase().includes(lowerQuery) ||
      item.category?.toLowerCase().includes(lowerQuery)
    );

    // Sort results by relevance
    const sortedResults = results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match comes first
      if (aName === lowerQuery) return -1;
      if (bName === lowerQuery) return 1;
      
      // Items starting with query come second
      const aStarts = aName.startsWith(lowerQuery);
      const bStarts = bName.startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then sort by how early the query appears in the name
      const aIndex = aName.indexOf(lowerQuery);
      const bIndex = bName.indexOf(lowerQuery);
      if (aIndex !== bIndex) return aIndex - bIndex;
      
      // Finally, sort alphabetically
      return aName.localeCompare(bName);
    });

    // Also search in restaurants
    const restaurantResults = restaurantData.filter(restaurant =>
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisine?.some(c => c.toLowerCase().includes(lowerQuery))
    );

    // Sort restaurant results by relevance too
    const sortedRestaurants = restaurantResults.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match comes first
      if (aName === lowerQuery) return -1;
      if (bName === lowerQuery) return 1;
      
      // Items starting with query come second
      const aStarts = aName.startsWith(lowerQuery);
      const bStarts = bName.startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then sort by how early the query appears
      const aIndex = aName.indexOf(lowerQuery);
      const bIndex = bName.indexOf(lowerQuery);
      if (aIndex !== bIndex) return aIndex - bIndex;
      
      // Finally, sort alphabetically
      return aName.localeCompare(bName);
    });

    setSearchResults({
      foodItems: sortedResults.slice(0, 8),
      restaurants: sortedRestaurants.slice(0, 4)
    });
    setIsSearching(false);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    if (searchQuery.trim().length > 0) {
      // Scroll to menu section
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close dropdown after short delay
      setTimeout(() => {
        setShowSearchResults(false);
      }, 300);
    }
  };

  // Scroll to search result
  const scrollToResult = (type, id) => {
    setShowSearchResults(false);
    
    if (type === 'food') {
      const element = document.getElementById('menu');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (type === 'restaurant') {
      // Find the restaurant by id or name
      const restaurant = restaurantData.find(r => r._id === id || r.name === id);
      if (restaurant) {
        handleRestaurantClick(restaurant);
      } else {
        const element = document.getElementById('restaurants');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    
    // Clear search after navigation
    setTimeout(() => {
      setSearchQuery('');
    }, 500);
  };

  return (
    <div className={`app-container${modal ? ' modal-open' : ''}`}>
      {/* Premium Animated Header */}
      <header className="header">
        {/* Animated Background Gradient */}
        <div className="header-bg-gradient"></div>
        <div className="header-glow"></div>
        
        {/* Logo with Animation */}
        <div className="logo" onClick={handleHomeClick}>
          <div className="logo-icon-wrapper">
            <span role="img" aria-label="logo" className="logo-icon">🍴</span>
            <div className="logo-sparkle"></div>
          </div>
          <span className="logo-text">
            <span className="logo-letter">U</span>
            <span className="logo-letter">n</span>
            <span className="logo-letter">i</span>
            <span className="logo-letter">E</span>
            <span className="logo-letter">a</span>
            <span className="logo-letter">t</span>
            <span className="logo-letter">s</span>
          </span>
        </div>

        {/* Navigation with Hover Effects */}
        <nav className="nav">
          <a href="/" className="nav-link" onClick={handleHomeClick}>
            <span className="nav-link-text">Home</span>
            <span className="nav-link-underline"></span>
          </a>
          <a href="#restaurants" className="nav-link" onClick={e => handleNavSection(e, 'restaurants')}>
            <span className="nav-link-text">Restaurants</span>
            <span className="nav-link-underline"></span>
          </a>
          <a href="#menu" className="nav-link" onClick={e => handleNavSection(e, 'menu')}>
            <span className="nav-link-text">Menu</span>
            <span className="nav-link-underline"></span>
          </a>
          {isAuthenticated && (
            <Link to="/dashboard" className="nav-link nav-link-special">
              <span className="nav-link-text">
                {user?.role === 'admin' ? '🛡️ Admin Panel' : 
                 user?.role === 'restaurant_owner' ? '🏪 My Restaurant' :
                 user?.role === 'delivery_partner' ? '🏍️ Delivery Hub' :
                 '👨‍🎓 Dashboard'}
              </span>
              <span className="nav-link-underline"></span>
            </Link>
          )}
          <Link to="/orders" className="nav-link">
            <span className="nav-link-text">Orders</span>
            <span className="nav-link-underline"></span>
          </Link>
          <Link to="/favorites" className="nav-link">
            <span className="nav-link-text">❤️ Favorites</span>
            <span className="nav-link-underline"></span>
          </Link>
        </nav>

        {/* Header Actions with Animations */}
        <div className="header-actions">
          {/* Search Button */}
          <button 
            className="search-btn" 
            title="Search" 
            onClick={() => setShowSearchPage(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              color: '#333',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span role="img" aria-label="search">🔍</span>
          </button>
          
          <button className="cart-btn" title="Cart" onClick={() => navigate('/cart')}>
            <span className="cart-icon-wrapper">
              <span role="img" aria-label="cart" className="cart-icon">🛒</span>
            </span>
            {getCartCount() > 0 && (
              <span className="cart-badge">
                {getCartCount()}
              </span>
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="user-greeting">Hi, {user?.name || 'User'}!</span>
              <button className="logout-btn" onClick={logout}>
                <span>Logout</span>
                <span className="logout-icon">→</span>
              </button>
            </div>
          ) : (
            <div className="header-auth-options">
              <div className="auth-dropdown">
                <button className="auth-dropdown-btn">
                  <span>Login</span>
                  <span className="dropdown-arrow">▾</span>
                </button>
                <div className="auth-dropdown-content">
                  <Link to="/admin/login" className="auth-dropdown-link">
                    <span className="link-icon">🛡️</span>
                    <span>Admin</span>
                  </Link>
                  <Link to="/student/login" className="auth-dropdown-link">
                    <span className="link-icon">🎓</span>
                    <span>Student</span>
                  </Link>
                  <Link to="/restaurant/login" className="auth-dropdown-link">
                    <span className="link-icon">🏪</span>
                    <span>Restaurant</span>
                  </Link>
                  <Link to="/delivery/login" className="auth-dropdown-link">
                    <span className="link-icon">🏍️</span>
                    <span>Delivery Partner</span>
                  </Link>
                </div>
              </div>
              <div className="auth-dropdown">
                <button className="auth-dropdown-btn signup-btn">
                  <span>Sign Up</span>
                  <span className="dropdown-arrow">▾</span>
                </button>
                <div className="auth-dropdown-content">
                  <Link to="/student/signup" className="auth-dropdown-link">
                    <span className="link-icon">🎓</span>
                    <span>Student Signup</span>
                  </Link>
                  <Link to="/restaurant/signup" className="auth-dropdown-link">
                    <span className="link-icon">🏪</span>
                    <span>Restaurant Signup</span>
                  </Link>
                  <Link to="/delivery/signup" className="auth-dropdown-link">
                    <span className="link-icon">🏍️</span>
                    <span>Delivery Signup</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Main page content - wrapped with Suspense for code splitting */}
      <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route path="/restaurant/signup" element={<RestaurantSignup />} />
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery/signup" element={<DeliverySignup />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            user?.role === 'admin' ? <AdminDashboard /> :
            user?.role === 'restaurant_owner' ? <RestaurantOwnerDashboard /> :
            user?.role === 'delivery_partner' ? <DeliveryPartnerDashboard /> :
            <StudentDashboard />
          ) : (
            <div style={{padding: '100px 20px', textAlign: 'center'}}>
              <h2>Please login to access your dashboard</h2>
              <div className="dashboard-auth-options" style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <Link to="/student/login" className="dashboard-auth-btn">🎓 Student Login</Link>
                <Link to="/restaurant/login" className="dashboard-auth-btn">🏪 Restaurant Login</Link>
                <Link to="/delivery/login" className="dashboard-auth-btn">🏍️ Delivery Login</Link>
                <Link to="/admin/login" className="dashboard-auth-btn">🛡️ Admin Login</Link>
              </div>
            </div>
          )
        } />
        
        {/* Role-Specific Dashboard Routes */}
        <Route path="/admin/dashboard" element={
          isAuthenticated && user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div style={{padding: '100px 20px', textAlign: 'center'}}>
              <h2>🛡️ Admin Access Required</h2>
              <p>You need admin privileges to access this page.</p>
              <Link to="/admin/login" style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}>
                Admin Login
              </Link>
            </div>
          )
        } />
        
        <Route path="/student/dashboard" element={
          isAuthenticated && user?.role === 'student' ? (
            <StudentDashboard />
          ) : (
            <div style={{padding: '100px 20px', textAlign: 'center'}}>
              <h2>🎓 Student Access Required</h2>
              <p>You need to be logged in as a student to access this page.</p>
              <Link to="/student/login" style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}>
                Student Login
              </Link>
            </div>
          )
        } />
        
        <Route path="/restaurant/dashboard" element={
          isAuthenticated && user?.role === 'restaurant_owner' ? (
            <RestaurantOwnerDashboard />
          ) : (
            <div style={{padding: '100px 20px', textAlign: 'center'}}>
              <h2>🏪 Restaurant Owner Access Required</h2>
              <p>You need to be logged in as a restaurant owner to access this page.</p>
              <Link to="/restaurant/login" style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}>
                Restaurant Login
              </Link>
            </div>
          )
        } />
        
        <Route path="/delivery/dashboard" element={
          isAuthenticated && user?.role === 'delivery_partner' ? (
            <DeliveryPartnerDashboard />
          ) : (
            <div style={{padding: '100px 20px', textAlign: 'center'}}>
              <h2>🏍️ Delivery Partner Access Required</h2>
              <p>You need to be logged in as a delivery partner to access this page.</p>
              <Link to="/delivery/login" style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block'}}>
                Delivery Login
              </Link>
            </div>
          )
        } />
        
        {/* Orders Route */}
        <Route path="/orders" element={<OrdersPage />} />
        
        {/* Cart Route */}
        <Route path="/cart" element={<CartPage />} />
        
        {/* Favorites Route */}
        <Route path="/favorites" element={
          <FavoritesPage 
            onRestaurantClick={(restaurant) => {
              setSelectedRestaurantForDetail(restaurant);
              setShowRestaurantDetail(true);
            }}
            onItemAddToCart={(item) => {
              addToCart(item);
            }}
          />
        } />
        
        {/* Restaurant Owner Menu Management */}
        <Route path="/owner/menu" element={<RestaurantOwnerPanel />} />
        
        {/* Home Route */}
        <Route path="/" element={
          <>
            {/* Enhanced Hero Section */}
            <section className="hero" style={{ backgroundImage: 'url(/bg.jpg)' }}>
              <div className="hero-overlay">
                <div className="hero-content">
                  {/* Hero Badge */}
                  <div className="hero-badge">
                    <span className="badge-icon">🎓</span>
                    <span className="badge-text">Campus Food Delivery</span>
                  </div>
                  
                  {/* Hero Title with Animation */}
                  <h1 className="hero-title">
                    <span className="title-line">Delicious Food,</span>
                    <span className="title-line highlight">Delivered Fast</span>
                  </h1>
                  
                  {/* Hero Subtitle */}
                  <p className="hero-subtitle">
                    Order from your favorite campus restaurants and get it delivered by fellow students
                  </p>
                  
                  {/* Advanced Search Bar */}
                  <div className="hero-search-container">
                    <div className="search-wrapper">
                      <span className="search-icon">🔍</span>
                      <input 
                        className="search-food-input" 
                        type="text" 
                        placeholder="Search for food, restaurants, or cuisines..." 
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onClick={() => setShowSearchPage(true)}
                        onFocus={() => {
                          setShowSearchPage(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearchButtonClick();
                          }
                        }}
                      />
                      {searchQuery && (
                        <button 
                          className="search-clear-btn"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            setShowSearchResults(false);
                          }}
                        >
                          ✕
                        </button>
                      )}
                      <button 
                        className="search-food-btn"
                        onClick={() => setShowSearchPage(true)}
                      >
                        <span>Search</span>
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchQuery && (
                      <div className="search-results-dropdown">
                        {isSearching ? (
                          // Show skeleton loaders while searching
                          <div className="search-loading">
                            <div className="search-section">
                              <div className="search-section-header">
                                <span className="section-icon">🍔</span>
                                <h3>Food Items</h3>
                              </div>
                              {Array.from({ length: 3 }).map((_, index) => (
                                <SearchResultSkeleton key={`food-skeleton-${index}`} />
                              ))}
                            </div>
                            <div className="search-section">
                              <div className="search-section-header">
                                <span className="section-icon">🏪</span>
                                <h3>Restaurants</h3>
                              </div>
                              {Array.from({ length: 2 }).map((_, index) => (
                                <SearchResultSkeleton key={`restaurant-skeleton-${index}`} />
                              ))}
                            </div>
                          </div>
                        ) : (searchResults.foodItems?.length > 0 || searchResults.restaurants?.length > 0) ? (
                          <>
                            {/* Food Items Results */}
                            {searchResults.foodItems?.length > 0 && (
                              <div className="search-section">
                                <div className="search-section-header">
                                  <span className="section-icon">🍔</span>
                                  <h3>Food Items</h3>
                                </div>
                                {searchResults.foodItems.map((item) => (
                                  <div 
                                    key={item._id || item.name} 
                                    className="search-result-item"
                                    onClick={() => scrollToResult('food', item._id)}
                                  >
                                    <img
                                      src={item.images?.[0]?.url || item.image || item.img || 'https://via.placeholder.com/80x80?text=Dish'} 
                                      alt={item.name} 
                                      className="result-image"
                                      loading="lazy"
                                    />
                                    <div className="result-info">
                                      <p className="result-name">{item.name}</p>
                                      <p className="result-restaurant">{item.restaurant?.name}</p>
                                    </div>
                                    <span className="result-price">₹{item.price}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Restaurant Results */}
                            {searchResults.restaurants?.length > 0 && (
                              <div className="search-section">
                                <div className="search-section-header">
                                  <span className="section-icon">🏪</span>
                                  <h3>Restaurants</h3>
                                </div>
                                {searchResults.restaurants.map((restaurant) => (
                                  <div 
                                    key={restaurant._id || restaurant.name} 
                                    className="search-result-item"
                                    onClick={() => scrollToResult('restaurant', restaurant._id || restaurant.name)}
                                  >
                                    <img
                                      src={restaurant.images?.[0]?.url || restaurant.image || restaurant.img || 'https://via.placeholder.com/80x80?text=Restaurant'} 
                                      alt={restaurant.name} 
                                      className="result-image"
                                      loading="lazy"
                                    />
                                    <div className="result-info">
                                      <p className="result-name">{restaurant.name}</p>
                                  <p className="result-restaurant">
                                    {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine}
                                  </p>
                                </div>
                                <span className="result-rating">⭐ {restaurant.rating || '4.5'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NoSearchResults 
                        searchQuery={searchQuery}
                        onClearSearch={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowSearchResults(false);
                        }}
                      />
                    )}
                      </div>
                    )}
                  </div>

                  {/* Hero Stats */}
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-icon">🍽️</span>
                      <div className="stat-content">
                        <span className="stat-number">{restaurantData.length}+</span>
                        <span className="stat-label">Restaurants</span>
                      </div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-icon">🛵</span>
                      <div className="stat-content">
                        <span className="stat-number">15 min</span>
                        <span className="stat-label">Avg Delivery</span>
                      </div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <div className="stat-content">
                        <span className="stat-number">4.8</span>
                        <span className="stat-label">Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Partner CTA */}
                  {!isAuthenticated && (
                    <div className="hero-cta">
                      <button 
                        className="partner-btn" 
                        onClick={() => { setModal('partner'); setPartnerThankYou(false); }}
                      >
                        <span className="partner-icon">🏍️</span>
                        <span>Become a Delivery Partner</span>
                        <span className="partner-badge">Earn Money</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Popular Restaurants Section */}
            <section className="popular-section" id="restaurants">
              <div className="section-header">
                <div className="section-badge">
                  <span className="badge-icon">🍽️</span>
                  <span>Top Rated</span>
                </div>
                <h2 className="popular-title">Popular Restaurants</h2>
                <p className="popular-desc">Discover amazing food from top-rated restaurants near your campus</p>
              </div>
              
              <div className="category-filters">
                {restaurantCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn${selectedRestaurantCategory === cat ? ' active' : ''}`}
                    onClick={() => setSelectedRestaurantCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Restaurant Cards Grid */}
              <div className="restaurant-grid">
                {restaurantsLoading ? (
                  // Show skeleton loaders while loading
                  <SkeletonGrid count={6} Component={RestaurantCardSkeleton} />
                ) : (
                  // Show actual restaurants once loaded
                  (filteredRestaurants.length > 0 ? filteredRestaurants : [
                  {
                    name: "Spice Garden",
                    cuisine: ["Indian", "Biryani"],
                    rating: 4.8,
                    deliveryTime: "25-30 min",
                    distance: "1.2 km",
                    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
                    tag: "🔥 Trending",
                    offers: "50% OFF",
                    isOpen: true
                  },
                  {
                    name: "Dragon Wok",
                    cuisine: ["Chinese", "Asian"],
                    rating: 4.6,
                    deliveryTime: "30-35 min",
                    distance: "2.1 km",
                    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
                    tag: "⚡ Fast Delivery",
                    offers: "Free Delivery",
                    isOpen: true
                  },
                  {
                    name: "Pizza Paradise",
                    cuisine: ["Italian", "Pizza"],
                    rating: 4.7,
                    deliveryTime: "20-25 min",
                    distance: "0.8 km",
                    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
                    tag: "⭐ Popular",
                    offers: "Buy 1 Get 1",
                    isOpen: true
                  },
                  {
                    name: "Burger Hub",
                    cuisine: ["Fast Food", "Burgers"],
                    rating: 4.5,
                    deliveryTime: "15-20 min",
                    distance: "1.5 km",
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
                    tag: "💰 Budget Friendly",
                    offers: "30% OFF",
                    isOpen: true
                  },
                  {
                    name: "Sushi Station",
                    cuisine: ["Japanese", "Sushi"],
                    rating: 4.9,
                    deliveryTime: "35-40 min",
                    distance: "3.2 km",
                    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
                    tag: "⭐ Premium",
                    offers: "20% OFF",
                    isOpen: true
                  },
                  {
                    name: "Taco Fiesta",
                    cuisine: ["Mexican", "Tacos"],
                    rating: 4.4,
                    deliveryTime: "25-30 min",
                    distance: "1.8 km",
                    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
                    tag: "🌮 New",
                    offers: "Free Nachos",
                    isOpen: true
                  }
                  ]).map((r, i) => (
                    <ScrollInCard
                    className="restaurant-card-modern"
                    key={r._id || r.name + i}
                    delay={i * 100}
                    onClick={() => handleRestaurantClick(r)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="restaurant-image-container">
                      <RestaurantImage 
                        src={r.images?.[0]?.url || r.image || r.img || 'https://via.placeholder.com/400x300?text=Restaurant'} 
                        alt={r.name} 
                        className="restaurant-img-modern" 
                      />
                      <div className="restaurant-overlay">
                        <button className="quick-view-btn" onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantDetailView(r, e);
                        }}>ℹ️ Details</button>
                        <button className="quick-view-btn" onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantClick(r);
                        }} style={{ marginLeft: '8px' }}>View Menu →</button>
                      </div>
                      {r.tag && <span className="restaurant-tag-modern">{r.tag}</span>}
                      {r.offers && <span className="restaurant-offer-badge">{r.offers}</span>}
                      
                      {/* Favorite Button */}
                      <FavoriteButton 
                        type="restaurant"
                        itemData={r}
                        position="absolute"
                        size="medium"
                      />
                    </div>
                    <div className="restaurant-info-modern">
                      <div className="restaurant-header">
                        <h3 className="restaurant-name-modern">{r.name}</h3>
                        <div className="restaurant-rating-badge">
                          <span className="rating-star">★</span>
                          <span className="rating-value">{r.rating}</span>
                        </div>
                      </div>
                      <p className="restaurant-cuisine-modern">
                        {Array.isArray(r.cuisine) ? r.cuisine.join(' • ') : r.cuisine}
                      </p>
                      <div className="restaurant-footer">
                        <div className="restaurant-details">
                          <span className="detail-item">
                            <span className="detail-icon">🕐</span>
                            {r.deliveryTime || '25-30 min'}
                          </span>
                          <span className="detail-item">
                            <span className="detail-icon">📍</span>
                            {r.distance || '1.5 km'}
                          </span>
                        </div>
                        {r.isOpen !== false && <span className="open-badge">● Open Now</span>}
                      </div>
                    </div>
                  </ScrollInCard>
                  ))
                )}
              </div>
            </section>

            {/* Menu Section */}
            <section className="menu-section" id="menu">
              <div className="section-header">
                <div className="section-badge">
                  <span className="badge-icon">🍕</span>
                  <span>Delicious Menu</span>
                </div>
                <h2 className="menu-title">
                  {showRestaurantMenu && selectedRestaurant ? selectedRestaurant.name : 'Menu'}
                </h2>
                <p className="menu-desc">
                  {showRestaurantMenu && selectedRestaurant 
                    ? `Browse dishes from ${selectedRestaurant.name}`
                    : 'Explore our delicious food items and add them to your cart!'}
                </p>
                {showRestaurantMenu && selectedRestaurant && (
                  <button 
                    className="back-to-all-btn"
                    onClick={() => {
                      setShowRestaurantMenu(false);
                      setSelectedRestaurant(null);
                    }}
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    ← View All Restaurants
                  </button>
                )}
              </div>
              
              <div className="category-filters food-category-filters">
                {foodCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn${selectedFoodCategory === cat ? ' active' : ''}`}
                    onClick={() => setSelectedFoodCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="food-grid-modern">
                {menuLoading ? (
                  // Show skeleton loaders while loading menu
                  <SkeletonGrid count={8} Component={MenuItemSkeleton} />
                ) : (() => {
                  // Use filtered items from API or fallback to local data
                  let items = filteredFoodItems.length > 0 ? filteredFoodItems : [
                      {
                        name: "Chicken Biryani",
                        category: "Indian",
                        price: 249,
                        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop",
                        restaurant: { name: "Spice Garden" },
                        rating: 4.8,
                        isVeg: false,
                        badge: "🔥 Bestseller",
                        description: "Aromatic basmati rice with tender chicken"
                      },
                      {
                        name: "Margherita Pizza",
                        category: "Italian",
                        price: 299,
                        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop",
                        restaurant: { name: "Pizza Paradise" },
                        rating: 4.7,
                        isVeg: true,
                        badge: "⭐ Popular",
                        description: "Classic pizza with fresh mozzarella"
                      },
                      {
                        name: "Chicken Hakka Noodles",
                        category: "Chinese",
                        price: 199,
                        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop",
                        restaurant: { name: "Dragon Wok" },
                        rating: 4.6,
                        isVeg: false,
                        badge: "⚡ Quick",
                        description: "Stir-fried noodles with veggies"
                      },
                      {
                        name: "Paneer Tikka",
                        category: "Indian",
                        price: 229,
                        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop",
                        restaurant: { name: "Spice Garden" },
                        rating: 4.7,
                        isVeg: true,
                        badge: "🌱 Veg Special",
                        description: "Grilled cottage cheese with spices"
                      },
                      {
                        name: "Classic Burger",
                        category: "Fast Food",
                        price: 159,
                        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop",
                        restaurant: { name: "Burger Hub" },
                        rating: 4.5,
                        isVeg: false,
                        badge: "💰 Value",
                        description: "Juicy beef patty with cheese"
                      },
                      {
                        name: "California Roll",
                        category: "Japanese",
                        price: 349,
                        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop",
                        restaurant: { name: "Sushi Station" },
                        rating: 4.9,
                        isVeg: false,
                        badge: "⭐ Premium",
                        description: "Fresh sushi with avocado"
                      },
                      {
                        name: "Chicken Tacos",
                        category: "Mexican",
                        price: 189,
                        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop",
                        restaurant: { name: "Taco Fiesta" },
                        rating: 4.4,
                        isVeg: false,
                        badge: "🌮 Spicy",
                        description: "Soft tacos with grilled chicken"
                      },
                      {
                        name: "Pasta Alfredo",
                        category: "Italian",
                        price: 269,
                        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
                        restaurant: { name: "Pizza Paradise" },
                        rating: 4.6,
                        isVeg: true,
                        badge: "🧀 Creamy",
                        description: "Creamy white sauce pasta"
                      },
                      {
                        name: "Masala Dosa",
                        category: "Indian",
                        price: 129,
                        image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop",
                        restaurant: { name: "Spice Garden" },
                        rating: 4.8,
                        isVeg: true,
                        badge: "💰 Budget",
                        description: "Crispy dosa with potato filling"
                      }
                    ];
                  
                  // Filter by selected restaurant if one is selected
                  if (showRestaurantMenu && selectedRestaurant) {
                    items = items.filter(item => 
                      item.restaurant?.name === selectedRestaurant.name
                    );
                  }
                  
                  // Show message if no items for this restaurant
                  if (items.length === 0 && showRestaurantMenu && selectedRestaurant) {
                    return (
                      <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#636e72'
                      }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No menu items found</h3>
                        <p>This restaurant doesn't have any dishes available yet.</p>
                      </div>
                    );
                  }
                  
                  return items.map((item, idx) => (
                  <ScrollInCard
                    className="food-card-modern"
                    key={item._id || item.name + idx}
                    delay={idx * 80}
                  >
                    <div className="food-image-wrapper">
                      <MenuItemImage 
                        src={item.images?.[0]?.url || item.image || item.img || 'https://via.placeholder.com/400x400?text=Dish'} 
                        alt={item.name} 
                        className="food-img-modern" 
                      />
                      {item.badge && <span className="food-badge">{item.badge}</span>}
                      {item.isVeg !== undefined && (
                        <span className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
                          <span className="veg-dot"></span>
                        </span>
                      )}
                      
                      {/* Favorite Button for Menu Items */}
                      <FavoriteButton 
                        type="item"
                        itemData={item}
                        position="absolute"
                        size="medium"
                      />
                      
                      <div className="food-overlay-actions">
                        {getItemQuantity(item._id) > 0 ? (
                          <div className="quantity-control-overlay">
                            <button 
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item, getItemQuantity(item._id) - 1);
                              }}
                            >
                              −
                            </button>
                            <span className="quantity-display">{getItemQuantity(item._id)}</span>
                            <button 
                              className="quantity-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item, getItemQuantity(item._id) + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button className="quick-add-btn" onClick={() => handleAddToCart({
                            ...item,
                            restaurantId: item.restaurant?._id || item.restaurant,
                            img: item.image || item.img,
                            _id: item._id
                          })}>
                            <span className="cart-icon">🛒</span>
                            Quick Add
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="food-info-modern">
                      <div className="food-header">
                        <h3 className="food-name-modern">{item.name}</h3>
                        {item.rating && (
                          <div className="food-rating">
                            <span className="star-icon">★</span>
                            <span>{item.rating}</span>
                          </div>
                        )}
                      </div>
                      {item.description && (
                        <p className="food-description">{item.description}</p>
                      )}
                      {item.restaurant && (
                        <p className="food-restaurant-name">
                          <span className="restaurant-icon">🏪</span>
                          {item.restaurant.name}
                        </p>
                      )}
                      <div className="food-footer-modern">
                        <div className="food-price-tag">
                          <span className="currency">₹</span>
                          <span className="price-value">{item.price}</span>
                        </div>
                        {getItemQuantity(item._id) > 0 ? (
                          <div className="quantity-control-footer">
                            <button 
                              className="quantity-btn-footer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item, getItemQuantity(item._id) - 1);
                              }}
                            >
                              −
                            </button>
                            <span className="quantity-display-footer">{getItemQuantity(item._id)}</span>
                            <button 
                              className="quantity-btn-footer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(item, getItemQuantity(item._id) + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="add-to-cart-btn-modern" 
                            onClick={() => handleAddToCart({
                              ...item,
                              restaurantId: item.restaurant?._id || item.restaurant,
                              img: item.image || item.img,
                              _id: item._id
                            })}
                          >
                            <span className="btn-icon">+</span>
                            <span className="btn-text">Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </ScrollInCard>
                  ));
                  })()}
              </div>
            </section>

            {/* Contact Heading and Footer Section */}
            <div className="contact-heading-wrapper">
              <h2 className="contact-main-heading">Contact</h2>
            </div>
            <footer className="footer-section" id="contact">
              <div className="footer-content">
                <div className="footer-logo-col">
                  <span className="footer-logo">UniEats</span>
                </div>
                <div className="footer-links-col">
                  <div className="footer-col">
                    <div className="footer-heading">Eternal</div>
                    <a href="#" className="footer-link">UniEats</a>
                    <a href="#" className="footer-link">Campus Eats</a>
                    <a href="#" className="footer-link">Student Deals</a>
                    <a href="#" className="footer-link">Hyperlocal</a>
                    <a href="#" className="footer-link">Cafeteria</a>
                    <a href="#" className="footer-link">Investor Relations</a>
                  </div>
                  <div className="footer-col">
                    <div className="footer-heading">For Restaurants</div>
                    <a href="#" className="footer-link">Partner With Us</a>
                    <a href="#" className="footer-link">Apps For You</a>
                  </div>
                  <div className="footer-col">
                    <div className="footer-heading">For Delivery Partners</div>
                    <a href="#" className="footer-link">Partner With Us</a>
                    <a href="#" className="footer-link">Apps For You</a>
                  </div>
                  <div className="footer-col">
                    <div className="footer-heading">Learn More</div>
                    <a href="#" className="footer-link">Privacy</a>
                    <a href="#" className="footer-link">Security</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Help & Support</a>
                    <a href="#" className="footer-link">Report a Fraud</a>
                    <a href="#" className="footer-link">Blog</a>
                  </div>
                  <div className="footer-col footer-social-col">
                    <div className="footer-heading">Social Links</div>
                    <div className="footer-social-icons">
                      <a href="#" className="footer-social-icon" title="LinkedIn">🔗</a>
                      <a href="#" className="footer-social-icon" title="Instagram">📸</a>
                      <a href="#" className="footer-social-icon" title="YouTube">▶️</a>
                      <a href="#" className="footer-social-icon" title="Facebook">📘</a>
                      <a href="#" className="footer-social-icon" title="X">✖️</a>
                    </div>
                    <div className="footer-app-badges">
                      <a href="#" className="footer-app-badge">
                        <span role="img" aria-label="App Store"></span> App Store
                      </a>
                      <a href="#" className="footer-app-badge">
                        <span role="img" aria-label="Google Play">▶️</span> Google Play
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </>
        } />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
      </Suspense>
      {/* Modal Overlay for Login/Signup/Partner */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            {modal === 'login' ? <LoginModal onSwitch={() => setModal('signup')} closeModal={() => setModal(null)} /> :
             modal === 'signup' ? <SignupModal onSwitch={() => setModal('login')} closeModal={() => setModal(null)} /> :
             modal === 'checkout' ? <CheckoutModal closeModal={() => setModal(null)} /> :
             <PartnerModal thankYou={partnerThankYou} setThankYou={setPartnerThankYou} />}
          </div>
        </div>
      )}
      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            {/* Cart Header */}
            <div className="cart-sidebar-header">
              <h2 className="cart-sidebar-title">
                <span className="cart-title-icon">🛒</span>
                Your Cart
                {cartItems.length > 0 && (
                  <span className="cart-items-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                )}
              </h2>
              <button className="cart-sidebar-close" onClick={() => setCartOpen(false)}>&times;</button>
            </div>
            
            {cartItems.length === 0 ? (
              <EmptyCart onBrowseRestaurants={() => {
                setCartOpen(false);
                const restaurantsSection = document.getElementById('restaurants');
                if (restaurantsSection) {
                  restaurantsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }} />
            ) : (
              <>
                {/* Restaurant Info */}
                {restaurant && (
                  <div className="cart-restaurant-info">
                    <h3 className="cart-restaurant-name">📍 {restaurant.name}</h3>
                    <p className="cart-restaurant-cuisine">{restaurant.cuisine}</p>
                  </div>
                )}

                {/* Free Delivery Progress Bar */}
                {cartItems.length > 0 && (
                  <div className="free-delivery-progress">
                    {(() => {
                      const subtotal = getCartTotal();
                      const target = 300;
                      const progress = Math.min((subtotal / target) * 100, 100);
                      const remaining = Math.max(target - subtotal, 0);
                      
                      return (
                        <>
                          <div className="progress-text">
                            {progress >= 100 ? (
                              <span className="success">🎉 You've unlocked FREE delivery!</span>
                            ) : (
                              <span>Add ₹{remaining} more for FREE delivery 🚚</span>
                            )}
                          </div>
                          <div className="progress-bar-container">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${progress}%` }}
                            />
                            <div className="progress-icon" style={{ left: `${Math.min(progress, 95)}%` }}>
                              🚚
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Cart Items */}
                <div className="cart-sidebar-items">
                  {cartItems.map((item, index) => (
                    <div 
                      className={`cart-sidebar-item ${removingItemId === item._id ? 'removing' : ''}`} 
                      key={item._id} 
                      style={{ '--item-index': index }}
                    >
                      <img src={item.images?.[0]?.url || item.img || item.image || 'https://via.placeholder.com/80x80?text=Dish'} alt={item.name} className="cart-sidebar-img" />
                      <div className="cart-sidebar-info">
                        <div className="cart-sidebar-name">{item.name}</div>
                        
                        {/* Customization details */}
                        {(item.size || item.addons?.length > 0 || item.spiceLevel || item.notes) && (
                          <div className="cart-item-customizations">
                            {item.size && (
                              <span className="customization-badge">
                                {item.size}
                              </span>
                            )}
                            {item.spiceLevel && (
                              <span className="customization-badge">
                                🌶️ {item.spiceLevel}
                              </span>
                            )}
                            {item.addons?.map((addon, idx) => (
                              <span key={idx} className="customization-badge">
                                + {addon.name || addon}
                              </span>
                            ))}
                            {item.notes && (
                              <span className="customization-badge" title={item.notes}>
                                📝 Notes
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="cart-sidebar-meta">
                          <span className="cart-sidebar-price">₹{item.price}</span>
                          <div className="cart-sidebar-qty">
                            <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>−</button>
                            <span className={updatingItemId === item._id ? 'updating' : ''}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                      </div>
                      <button className="cart-sidebar-remove" onClick={() => removeFromCart(item._id)} title="Remove">&times;</button>
                    </div>
                  ))}
                </div>

                {/* Suggested Items Section */}
                {cartItems.length > 0 && restaurant && (
                  <div className="cart-suggested-items">
                    <h4>🤔 Frequently bought together</h4>
                    <div className="suggested-items-grid">
                      {(() => {
                        // Get suggested items from the same restaurant
                        const suggestedItems = menuItems
                          .filter(item => {
                            // Same restaurant
                            const itemRestaurantName = item.restaurant?.name || '';
                            const cartRestaurantName = restaurant?.name || '';
                            if (itemRestaurantName !== cartRestaurantName) return false;
                            
                            // Not already in cart
                            const isInCart = cartItems.some(cartItem => cartItem._id === item._id);
                            if (isInCart) return false;
                            
                            // Popular items (rating > 4.0)
                            if (item.rating && item.rating < 4.0) return false;
                            
                            return true;
                          })
                          .slice(0, 5); // Limit to 5 suggestions

                        if (suggestedItems.length === 0) return null;

                        return suggestedItems.map(item => (
                          <div key={item._id} className="suggested-item-card">
                            <img 
                              src={item.images?.[0]?.url || item.img || item.image || 'https://via.placeholder.com/100x100?text=Dish'} 
                              alt={item.name} 
                            />
                            <div className="suggested-item-info">
                              <span className="suggested-item-name" title={item.name}>
                                {item.name}
                              </span>
                              <span className="suggested-item-price">₹{item.price}</span>
                            </div>
                            <button 
                              onClick={() => {
                                addToCart(item);
                              }}
                              className="suggested-item-add"
                            >
                              + Add
                            </button>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Coupon Section */}
                <CouponSection
                  cartTotal={getCartTotal()}
                  appliedCoupon={appliedCoupon}
                  onCouponApply={(coupon) => setAppliedCoupon(coupon)}
                  onCouponRemove={() => setAppliedCoupon(null)}
                />

                {/* Pricing Breakdown */}
                <div className="cart-pricing-breakdown">
                  {(() => {
                    const pricing = getPricingBreakdown();
                    return (
                      <>
                        <div className="pricing-row">
                          <span>Subtotal</span>
                          <span>₹{pricing.subtotal}</span>
                        </div>
                        {pricing.deliveryFee > 0 && (
                          <div className="pricing-row">
                            <span>Delivery Fee</span>
                            <span>₹{pricing.deliveryFee}</span>
                          </div>
                        )}
                        <div className="pricing-row">
                          <span>Platform Fee</span>
                          <span>₹{pricing.platformFee}</span>
                        </div>
                        <div className="pricing-row">
                          <span>Tax (5%)</span>
                          <span>₹{pricing.tax}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="pricing-row discount">
                            <span>🎉 Coupon Discount ({appliedCoupon.code})</span>
                            <span style={{ color: '#28a745' }}>-₹{appliedCoupon.discountAmount}</span>
                          </div>
                        )}
                        {pricing.subtotal > 300 && (
                          <div className="pricing-row free-delivery">
                            <span>🎉 Free Delivery!</span>
                            <span>-₹40</span>
                          </div>
                        )}
                        <div className="pricing-row total">
                          <span>Total Amount</span>
                          <span className={priceUpdated ? 'price-updated' : ''}>
                            ₹{pricing.total - (appliedCoupon?.discountAmount || 0)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Checkout Button */}
                <div className="cart-sidebar-footer">
                  {isAuthenticated ? (
                    <>
                      {/* Quick Checkout with saved address */}
                      {selectedDeliveryAddress && (
                        <button 
                          className="cart-quick-checkout" 
                          onClick={async () => {
                            try {
                              const result = await checkout(
                                selectedDeliveryAddress, 
                                'cash', // Default payment method
                                'Quick checkout'
                              );
                              
                              if (result.success) {
                                setCartOpen(false);
                                toast.success('🎉 Order placed successfully!');
                              }
                            } catch (error) {
                              toast.error(error.message || 'Quick checkout failed');
                            }
                          }}
                          disabled={isCheckingOut}
                        >
                          <span className="cart-quick-checkout-icon">⚡</span>
                          <div className="cart-quick-checkout-text">
                            <span className="cart-quick-checkout-label">Quick Checkout</span>
                            <span className="cart-quick-checkout-address">
                              To: {selectedDeliveryAddress.street}, {selectedDeliveryAddress.city}
                            </span>
                          </div>
                        </button>
                      )}
                      
                      {/* Regular Checkout Button */}
                      <button 
                        className="cart-sidebar-checkout" 
                        onClick={() => {
                          setCartOpen(false);
                          setModal('checkout');
                        }}
                        disabled={isCheckingOut}
                      >
                        {isCheckingOut ? '⏳ Processing...' : selectedDeliveryAddress ? '📝 Change Address & Checkout' : '🎉 Proceed to Checkout'}
                      </button>
                    </>
                  ) : (
                    <div className="cart-auth-required">
                      <p>Please login to proceed with checkout</p>
                      <button 
                        className="cart-login-btn" 
                        onClick={() => {
                          setCartOpen(false);
                          setModal('login');
                        }}
                      >
                        🔐 Login Now
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Notification Bar (Swiggy-style) */}
      {cartItems.length > 0 && !cartOpen && location.pathname !== '/cart' && (
        <div className="floating-cart-bar">
          <div className="floating-cart-content">
            <div className="floating-cart-info">
              <span className="floating-cart-count">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} added</span>
              {restaurant && <span className="floating-cart-restaurant">from {restaurant.name}</span>}
            </div>
            <button className="floating-cart-view-btn" onClick={() => navigate('/cart')}>
              VIEW CART <span className="floating-cart-amount">₹{getCartTotal()}</span>
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Search Page */}
      {showSearchPage && (
        <SearchPage
          onClose={() => setShowSearchPage(false)}
          menuItems={menuItems}
          restaurantData={restaurantData}
          onSelectItem={(type, item) => {
            if (type === 'dish') {
              // Find the restaurant for this dish
              const restaurant = restaurantData.find(r => 
                r.menu?.some(menuItem => menuItem.name === item.name)
              );
              if (restaurant) {
                setSelectedRestaurant(restaurant);
                setShowRestaurantMenu(true);
              }
            } else if (type === 'restaurant') {
              setSelectedRestaurant(item);
              setShowRestaurantMenu(true);
            }
            setShowSearchPage(false);
          }}
        />
      )}

      {/* Menu Customization Modal */}
      <MenuCustomizationModal
        item={selectedMenuItemForCustomization}
        isOpen={showMenuCustomization}
        onClose={() => {
          setShowMenuCustomization(false);
          setSelectedMenuItemForCustomization(null);
        }}
        onAddToCart={handleCustomizedAddToCart}
      />

      {/* Restaurant Detail Modal */}
      <RestaurantDetailModal
        restaurant={selectedRestaurantForDetail}
        isOpen={showRestaurantDetail}
        onClose={() => {
          setShowRestaurantDetail(false);
          setSelectedRestaurantForDetail(null);
        }}
        onViewMenu={handleViewMenuFromDetail}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          // Apply filters to restaurant list here
          // This will be connected to your restaurant filtering logic
        }}
      />

      {/* Rating & Review Modal */}
      {showRatingModal && orderToRate && (
        <RatingReviewModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setOrderToRate(null);
          }}
          order={orderToRate}
          onSubmitReview={(reviewData) => {
            console.log('Review submitted:', reviewData);
            // Handle review submission - send to backend
            setShowRatingModal(false);
            setOrderToRate(null);
          }}
        />
      )}

      {/* Dark Mode Toggle - Fixed Position */}
      <DarkModeToggle position="fixed" />
    </div>
  );
}

// Checkout Modal Component
function CheckoutModal({ closeModal }) {
  const { checkout, getPricingBreakdown, cartItems, restaurant, isCheckingOut } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '',
    landmark: '',
    paymentMethod: 'cod',
    specialInstructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pricing = getPricingBreakdown();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initiateRazorpayPayment = async (orderId, amount) => {
    try {
      // Create Razorpay order
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount,
          currency: 'INR'
        })
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Configure Razorpay options
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'UniEats',
        description: `Order Payment - Order #${orderId}`,
        order_id: orderData.data.razorpayOrderId,
        handler: async function (paymentResponse) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderId: orderId
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert(`Payment successful! Order ${verifyData.data.orderNumber} confirmed.`);
              closeModal();
              window.location.href = '/orders';
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: user?.email || '',
          contact: formData.phone
        },
        theme: {
          color: '#ff6b1a'
        },
        modal: {
          ondismiss: async function() {
            console.log('Payment cancelled');
            await fetch('http://localhost:5000/api/payment/payment-failed', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                orderId: orderId,
                error: 'Payment cancelled by user'
              })
            });
            alert('Payment was cancelled.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async function (response) {
        console.error('Payment failed:', response.error);
        await fetch('http://localhost:5000/api/payment/payment-failed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            orderId: orderId,
            error: response.error.description
          })
        });
        alert(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.street || !formData.zipCode) {
        throw new Error('Please fill in all required fields');
      }

      const deliveryAddress = {
        name: formData.name,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        landmark: formData.landmark
      };

      const result = await checkout(deliveryAddress, formData.paymentMethod, formData.specialInstructions);
      
      if (result.success) {
        // If payment method is online (not COD), initiate Razorpay
        if (formData.paymentMethod !== 'cod') {
          await initiateRazorpayPayment(result.order._id, pricing.total);
        } else {
          // COD order - show success message
          alert('Order placed successfully! Order ID: ' + result.order.orderNumber);
          closeModal();
          window.location.href = '/orders';
        }
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-modal">
      <h2 className="checkout-title">Checkout</h2>
      
      {/* Order Summary */}
      <div className="checkout-order-summary">
        <h3>Order Summary</h3>
        <div className="checkout-restaurant">
          <strong>{restaurant?.name}</strong>
          <span className="checkout-restaurant-cuisine">{restaurant?.cuisine}</span>
        </div>
        
        <div className="checkout-items">
          {cartItems.map(item => (
            <div key={item._id} className="checkout-item">
              <span className="checkout-item-name">{item.name} x {item.quantity}</span>
              <span className="checkout-item-price">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="checkout-pricing">
          <div className="pricing-row">
            <span>Subtotal:</span>
            <span>₹{pricing.subtotal}</span>
          </div>
          {pricing.deliveryFee > 0 && (
            <div className="pricing-row">
              <span>Delivery Fee:</span>
              <span>₹{pricing.deliveryFee}</span>
            </div>
          )}
          <div className="pricing-row">
            <span>Platform Fee:</span>
            <span>₹{pricing.platformFee}</span>
          </div>
          <div className="pricing-row">
            <span>Tax (5%):</span>
            <span>₹{pricing.tax}</span>
          </div>
          <div className="pricing-row total">
            <span><strong>Total:</strong></span>
            <span><strong>₹{pricing.total}</strong></span>
          </div>
        </div>
      </div>

      {/* Delivery Address Form */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Delivery Address</h3>
        <div className="checkout-form-row">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            className="checkout-input"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            className="checkout-input"
            required
          />
        </div>
        
        <input
          type="text"
          name="street"
          placeholder="Street Address *"
          value={formData.street}
          onChange={handleChange}
          className="checkout-input"
          required
        />
        
        <div className="checkout-form-row">
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={formData.city}
            onChange={handleChange}
            className="checkout-input"
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="ZIP Code *"
            value={formData.zipCode}
            onChange={handleChange}
            className="checkout-input"
            required
          />
        </div>
        
        <input
          type="text"
          name="landmark"
          placeholder="Landmark (Optional)"
          value={formData.landmark}
          onChange={handleChange}
          className="checkout-input"
        />

        <h3>Payment Method</h3>
        <div className="checkout-payment-methods">
          <label className="checkout-payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleChange}
            />
            <span>💵 Cash on Delivery</span>
          </label>
          <label className="checkout-payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
            />
            <span>💳 Pay Online (Card/UPI/Net Banking)</span>
          </label>
        </div>
        {formData.paymentMethod !== 'cod' && (
          <div className="checkout-payment-note">
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              💡 You will be redirected to Razorpay secure payment gateway
            </p>
          </div>
        )}

        <h3>Special Instructions</h3>
        <textarea
          name="specialInstructions"
          placeholder="Any special instructions for the restaurant or delivery partner..."
          value={formData.specialInstructions}
          onChange={handleChange}
          className="checkout-textarea"
          rows="3"
        />

        {error && <div className="checkout-error">{error}</div>}

        <button 
          type="submit" 
          className="checkout-place-order-btn"
          disabled={loading || isCheckingOut}
        >
          {loading || isCheckingOut ? 'Placing Order...' : `Place Order - ₹${pricing.total}`}
        </button>
      </form>
    </div>
  );
}


// Modal versions of Login/Signup - Now showing role selection
function LoginModal({ onSwitch, closeModal }) {
  const navigate = useNavigate();

  const roleOptions = [
    {
      role: 'student',
      icon: '🎓',
      title: 'Student',
      description: 'Order delicious food',
      color: '#3b82f6',
      loginPath: '/student/login',
      signupPath: '/student/signup'
    },
    {
      role: 'restaurant',
      icon: '🏪',
      title: 'Restaurant Owner',
      description: 'Manage your restaurant',
      color: '#10b981',
      loginPath: '/restaurant/login',
      signupPath: '/restaurant/signup'
    },
    {
      role: 'delivery',
      icon: '🏍️',
      title: 'Delivery Partner',
      description: 'Deliver orders and earn',
      color: '#8b5cf6',
      loginPath: '/delivery/login',
      signupPath: '/delivery/signup'
    }
  ];

  const handleRoleClick = (path) => {
    closeModal();
    navigate(path);
  };

  return (
    <div className="auth-card" style={{ maxWidth: '600px', padding: '32px' }}>
      <h2 className="auth-title" style={{ marginBottom: '12px' }}>Login to UniEats</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '14px' }}>
        Choose your role to continue
      </p>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {roleOptions.map((option) => (
          <div
            key={option.role}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
            onClick={() => handleRoleClick(option.loginPath)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = option.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              fontSize: '36px',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${option.color}20`,
              borderRadius: '12px'
            }}>
              {option.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {option.title}
              </h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '13px',
                margin: 0
              }}>
                {option.description}
              </p>
            </div>
            <div style={{
              color: option.color,
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              →
            </div>
          </div>
        ))}
      </div>

      <div className="auth-switch" style={{ marginTop: '24px' }}>
        Don&apos;t have an account? <button className="auth-link" onClick={onSwitch}>Sign Up</button>
      </div>
    </div>
  );
}
function SignupModal({ onSwitch, closeModal }) {
  const navigate = useNavigate();

  const roleOptions = [
    {
      role: 'student',
      icon: '🎓',
      title: 'Student',
      description: 'Order delicious food',
      color: '#3b82f6',
      loginPath: '/student/login',
      signupPath: '/student/signup'
    },
    {
      role: 'restaurant',
      icon: '🏪',
      title: 'Restaurant Owner',
      description: 'Manage your restaurant',
      color: '#10b981',
      loginPath: '/restaurant/login',
      signupPath: '/restaurant/signup'
    },
    {
      role: 'delivery',
      icon: '🏍️',
      title: 'Delivery Partner',
      description: 'Deliver orders and earn',
      color: '#8b5cf6',
      loginPath: '/delivery/login',
      signupPath: '/delivery/signup'
    }
  ];

  const handleRoleClick = (path) => {
    closeModal();
    navigate(path);
  };

  return (
    <div className="auth-card" style={{ maxWidth: '600px', padding: '32px' }}>
      <h2 className="auth-title" style={{ marginBottom: '12px' }}>Join UniEats</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', fontSize: '14px' }}>
        Choose your role to get started
      </p>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {roleOptions.map((option) => (
          <div
            key={option.role}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
            onClick={() => handleRoleClick(option.signupPath)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = option.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              fontSize: '36px',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${option.color}20`,
              borderRadius: '12px'
            }}>
              {option.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {option.title}
              </h3>
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '13px',
                margin: 0
              }}>
                {option.description}
              </p>
            </div>
            <div style={{
              color: option.color,
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              →
            </div>
          </div>
        ))}
      </div>

      <div className="auth-switch" style={{ marginTop: '24px' }}>
        Already have an account? <button className="auth-link" onClick={onSwitch}>Login</button>
      </div>
    </div>
  );
}

function PartnerModal({ thankYou, setThankYou }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    id: null,
    reason: ''
  });
  const [error, setError] = useState('');
  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.id) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    setThankYou(true);
  }
  if (thankYou) return <div style={{textAlign:'center',padding:'32px 0'}}><h2>Thank you for applying!</h2><p>We have received your application.<br/>Our team will contact you soon.</p></div>;
  return (
    <div className="auth-card">
      <h2 className="auth-title">Become a Delivery Partner</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" className="auth-input" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="College Email" className="auth-input" value={form.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" className="auth-input" value={form.phone} onChange={handleChange} required />
        <label className="auth-upload-label">College ID Card Proof:</label>
        <input type="file" name="id" accept="image/*,.pdf" className="auth-upload-input" onChange={handleChange} required />
        <textarea name="reason" className="auth-input" placeholder="Why do you want to join? (optional)" value={form.reason} onChange={handleChange} rows={3} style={{resize:'vertical'}} />
        {error && <div style={{color:'#ff6a1a',marginBottom:8}}>{error}</div>}
        <button className="auth-btn" type="submit">Apply</button>
      </form>
    </div>
  );
}

export default App;
