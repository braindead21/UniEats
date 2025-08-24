import './App.css';
import './components/AdminDashboard.css';
import './components/StudentDashboard.css';
import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import { useCart } from './contexts/CartContext.jsx';
import { useRestaurants } from './hooks/useRestaurants.js';
import { api } from './services/api.js';
import AdminDashboard from './components/AdminDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import RestaurantOwnerDashboard from './components/RestaurantOwnerDashboard.jsx';
import DeliveryPartnerDashboard from './components/DeliveryPartnerDashboard.jsx';

// Import all new authentication components
import AdminLogin from './components/AdminLogin.jsx';
import StudentLogin from './components/StudentLogin.jsx';
import StudentSignup from './components/StudentSignup.jsx';
import RestaurantLogin from './components/RestaurantLogin.jsx';
import RestaurantSignup from './components/RestaurantSignup.jsx';
import DeliveryLogin from './components/DeliveryLogin.jsx';
import DeliverySignup from './components/DeliverySignup.jsx';

// ScrollInCard component for animation
function ScrollInCard({ children, delay = 0, className = '', ...props }) {
  const ref = useRef();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('scroll-in');
        } else {
          node.classList.remove('scroll-in');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
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
  const { cartItems, getCartCount, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart, getPricingBreakdown, checkout, isCheckingOut, restaurant } = useCart();
  
  // Dynamic restaurant data
  const { restaurants: restaurantData, loading: restaurantsLoading } = useRestaurants();
  
  // Dynamic menu items
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  
  // Fetch menu items from all restaurants
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuLoading(true);
        console.log('Fetching menu items...');
        const response = await api.get('/menu');
        console.log('Menu response:', response);
        setMenuItems(response.menu || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems([]);
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
  const filteredFoodItems = selectedFoodCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedFoodCategory);

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [modal, setModal] = useState(null); // 'login' | 'signup' | 'partner' | null
  const [cartOpen, setCartOpen] = useState(false);
  const [partnerThankYou, setPartnerThankYou] = useState(false);
  const navigate = useNavigate();
  const [scrollTarget, setScrollTarget] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/ping')
      .then(res => res.json())
      .then(data => console.log('Backend /api/ping:', data))
      .catch(err => console.error('Backend connection error:', err));
  }, []);

  // Prevent background scroll when modal or cart is open
  useEffect(() => {
    if (modal || cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modal, cartOpen]);

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

  // Add to Cart handler
  function handleAddToCart(item) {
    addToCart(item, 1);
  }

  return (
    <div className={`app-container${modal ? ' modal-open' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="logo" className="logo-icon">🍴</span>
          <span className="logo-text">UniEats</span>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link" onClick={handleHomeClick}>Home</a>
          <a href="#restaurants" className="nav-link" onClick={e => handleNavSection(e, 'restaurants')}>Restaurants</a>
          <a href="#menu" className="nav-link" onClick={e => handleNavSection(e, 'menu')}>Menu</a>
          {isAuthenticated && (
            <Link to="/dashboard" className="nav-link">
              {user?.role === 'admin' ? '🛡️ Admin Panel' : 
               user?.role === 'restaurant_owner' ? '🏪 My Restaurant' :
               user?.role === 'delivery_partner' ? '🏍️ Delivery Hub' :
               '👨‍🎓 Dashboard'}
            </Link>
          )}
          <Link to="/orders" className="nav-link">Orders</Link>
        </nav>
        <div className="header-actions">
          <button className="cart-btn" title="Cart" onClick={() => setCartOpen(true)}>
            <span role="img" aria-label="cart">🛒</span>
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </button>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user?.name || 'User'}!</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="header-auth-options">
              <div className="auth-dropdown">
                <button className="auth-dropdown-btn">Login 🔽</button>
                <div className="auth-dropdown-content">
                  <Link to="/admin/login" className="auth-dropdown-link">🛡️ Admin</Link>
                  <Link to="/student/login" className="auth-dropdown-link">🎓 Student</Link>
                  <Link to="/restaurant/login" className="auth-dropdown-link">🏪 Restaurant</Link>
                  <Link to="/delivery/login" className="auth-dropdown-link">🏍️ Delivery Partner</Link>
                </div>
              </div>
              <div className="auth-dropdown">
                <button className="auth-dropdown-btn">Sign Up 🔽</button>
                <div className="auth-dropdown-content">
                  <Link to="/student/signup" className="auth-dropdown-link">🎓 Student Signup</Link>
                  <Link to="/restaurant/signup" className="auth-dropdown-link">🏪 Restaurant Signup</Link>
                  <Link to="/delivery/signup" className="auth-dropdown-link">🏍️ Delivery Signup</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Main page content (always visible) */}
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
        
        {/* Home Route */}
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <section className="hero" style={{ backgroundImage: 'url(/bg.jpg)' }}>
              <div className="hero-overlay">
                <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
                <p className="hero-subtitle">Order from your favorite campus restaurants and get it delivered by fellow students</p>
                <div className="hero-buttons hero-search-bar">
                  <input className="search-food-input" type="text" placeholder="Search for food..." />
                  <button className="search-food-btn">Search</button>
                  {!isAuthenticated && (
                    <button className="partner-btn" onClick={() => { setModal('partner'); setPartnerThankYou(false); }}>🏍️ Become a Delivery Partner</button>
                  )}
                </div>
              </div>
            </section>

            {/* Popular Restaurants Section */}
            <section className="popular-section" id="restaurants">
              <h2 className="popular-title">Popular Restaurants</h2>
              <p className="popular-desc">Discover amazing food from top-rated restaurants near your campus</p>
              
              {/* Debug Info */}
              {restaurantsLoading && <p>Loading restaurants...</p>}
              {!restaurantsLoading && <p>Found {restaurantData.length} restaurants</p>}
              
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
                {filteredRestaurants.map((r, i) => (
                  <ScrollInCard
                    className="restaurant-card"
                    key={r._id || r.name + r.cuisine}
                    delay={i * 80}
                  >
                    <img src={r.image || r.img} alt={r.name} className="restaurant-img" />
                    {r.tag && <span className="restaurant-tag">{r.tag}</span>}
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{r.name}</h3>
                      <div className="restaurant-meta">
                        <span className="restaurant-cuisine">{Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine}</span>
                        <span className="restaurant-rating">⭐ {r.rating}</span>
                      </div>
                    </div>
                  </ScrollInCard>
                ))}
                {/* Fill empty slots to keep grid layout consistent */}
                {Array(Math.max(0, 3 - (filteredRestaurants.length % 3 === 0 ? 3 : filteredRestaurants.length % 3))).fill(0).map((_, i) => (
                  <div className="restaurant-card empty" key={`empty-restaurant-${i}`}></div>
                ))}
              </div>
            </section>

            {/* Menu Section */}
            <section className="menu-section" id="menu">
              <h2 className="menu-title">Menu</h2>
              <p className="menu-desc">Explore our delicious food items and add them to your cart!</p>
              
              {/* Debug Info */}
              {menuLoading && <p>Loading menu items...</p>}
              {!menuLoading && <p>Found {menuItems.length} menu items</p>}
              
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
              <div className="food-grid">
                {filteredFoodItems.map((item, idx) => (
                  <ScrollInCard
                    className="food-card"
                    key={item._id || item.name + item.category}
                    delay={idx * 80}
                  >
                    <img src={item.image || item.img} alt={item.name} className="food-img" />
                    <div className="food-info">
                      <h3 className="food-name">{item.name}</h3>
                      {item.restaurant && (
                        <p className="food-restaurant">From: {item.restaurant.name}</p>
                      )}
                      <div className="food-meta">
                        <span className="food-price">₹{item.price}</span>
                        <button 
                          className="add-cart-btn" 
                          onClick={() => handleAddToCart({
                            ...item,
                            restaurantId: item.restaurant._id || item.restaurant,
                            restaurant: item.restaurant,
                            img: item.image || item.img,
                            _id: item._id
                          })}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </ScrollInCard>
                ))}
                {/* Fill empty slots to keep grid layout consistent */}
                {Array(Math.max(0, 3 - (filteredFoodItems.length % 3 === 0 ? 3 : filteredFoodItems.length % 3))).fill(0).map((_, i) => (
                  <div className="food-card empty" key={`empty-${i}`}></div>
                ))}
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
            <button className="cart-sidebar-close" onClick={() => setCartOpen(false)}>&times;</button>
            <h2 className="cart-sidebar-title">Your Cart</h2>
            
            {cartItems.length === 0 ? (
              <div className="cart-sidebar-empty">
                <p>Your cart is empty.</p>
                <p>Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                {/* Restaurant Info */}
                {restaurant && (
                  <div className="cart-restaurant-info">
                    <h3 className="cart-restaurant-name">{restaurant.name}</h3>
                    <p className="cart-restaurant-cuisine">{restaurant.cuisine}</p>
                  </div>
                )}

                {/* Cart Items */}
                <div className="cart-sidebar-items">
                  {cartItems.map(item => (
                    <div className="cart-sidebar-item" key={item._id}>
                      <img src={item.img || item.image} alt={item.name} className="cart-sidebar-img" />
                      <div className="cart-sidebar-info">
                        <div className="cart-sidebar-name">{item.name}</div>
                        <div className="cart-sidebar-meta">
                          <span className="cart-sidebar-price">₹{item.price}</span>
                          <span className="cart-sidebar-qty">
                            <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>-</button>
                            {item.quantity}
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                          </span>
                        </div>
                      </div>
                      <button className="cart-sidebar-remove" onClick={() => removeFromCart(item._id)} title="Remove">&times;</button>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="cart-pricing-breakdown">
                  {(() => {
                    const pricing = getPricingBreakdown();
                    return (
                      <>
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
                        {pricing.subtotal > 300 && (
                          <div className="pricing-row free-delivery">
                            <span>🎉 Free Delivery!</span>
                            <span>-₹40</span>
                          </div>
                        )}
                        <div className="pricing-row total">
                          <span>Total:</span>
                          <span>₹{pricing.total}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Checkout Button */}
                <div className="cart-sidebar-footer">
                  {isAuthenticated ? (
                    <button 
                      className="cart-sidebar-checkout" 
                      onClick={() => {
                        setCartOpen(false);
                        setModal('checkout');
                      }}
                      disabled={isCheckingOut}
                    >
                      {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
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
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        alert('Order placed successfully! Order ID: ' + result.order.orderNumber);
        closeModal();
        // Optionally redirect to order tracking page
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
            <span>Cash on Delivery</span>
          </label>
          <label className="checkout-payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
            />
            <span>Credit/Debit Card</span>
          </label>
          <label className="checkout-payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === 'upi'}
              onChange={handleChange}
            />
            <span>UPI</span>
          </label>
        </div>

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

// Modal versions of Login/Signup
function LoginModal({ onSwitch, closeModal }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        alert(`Welcome back, ${result.user.name}!`);
        closeModal(); // Close modal
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login to UniEats</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          className="auth-input"
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <div className="auth-password-row">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password"
            placeholder="Password" 
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <button type="button" className="auth-show-btn" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <div style={{color:'#ff6a1a', marginBottom: '10px', fontSize: '0.9rem'}}>{error}</div>}
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Login'}
        </button>
      </form>
      <div className="auth-forgot-row">
        <a href="#" className="auth-link">Forgot password?</a>
      </div>
      <div className="auth-switch">
        Don&apos;t have an account? <button className="auth-link" onClick={onSwitch}>Sign Up</button>
      </div>
    </div>
  );
}
function SignupModal({ onSwitch, closeModal }) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    collegeId: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        collegeId: formData.collegeId
      });

      if (result.success) {
        alert(`Welcome to UniEats, ${result.user.name}!`);
        closeModal(); // Close modal
      } else {
        setError(result.message || 'Registration failed');
        if (result.errors) {
          setError(result.errors.join(', '));
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Create Your UniEats Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name"
          placeholder="Name" 
          className="auth-input" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <input 
          type="email" 
          name="email"
          placeholder="College Email ID" 
          className="auth-input"
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <input 
          type="text" 
          name="collegeId"
          placeholder="College ID" 
          className="auth-input"
          value={formData.collegeId}
          onChange={handleChange}
          required 
        />
        <input 
          type="tel" 
          name="phone"
          placeholder="Phone Number" 
          className="auth-input"
          value={formData.phone}
          onChange={handleChange}
        />
        <div className="auth-password-row">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password"
            placeholder="Password" 
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <button type="button" className="auth-show-btn" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="auth-password-row">
          <input 
            type={showConfirm ? "text" : "password"} 
            name="confirmPassword"
            placeholder="Confirm Password" 
            className="auth-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
          />
          <button type="button" className="auth-show-btn" onClick={() => setShowConfirm(v => !v)}>
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        <div className="auth-upload-row">
          <label className="auth-upload-label">College ID Card Proof:</label>
          <input type="file" accept="image/*,.pdf" className="auth-upload-input" />
          <small style={{color: '#888', fontSize: '0.9rem'}}>File upload will be implemented later</small>
        </div>
        {error && <div style={{color:'#ff6a1a', marginBottom: '10px', fontSize: '0.9rem'}}>{error}</div>}
        <div className="auth-password-note">Password must be at least 6 characters and contain a number.</div>
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div className="auth-switch">
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
