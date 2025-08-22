import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

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
  return (
    <div className="orders-page" style={{padding:'64px 0', textAlign:'center'}}>
      <h2>Your Orders</h2>
      <p>All your past and current orders will appear here.</p>
    </div>
  );
}

function App() {
  // Simulate cart count for badge
  // Restaurant data
  const restaurantData = [
    { name: 'Burger Palace', cuisine: 'Fast Food', rating: 4.7, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80', tag: 'Top Rated' },
    { name: 'Spice Villa', cuisine: 'Indian', rating: 4.8, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dragon Express', cuisine: 'Chinese', rating: 4.6, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pasta House', cuisine: 'Italian', rating: 4.5, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Campus Café', cuisine: 'Cafe', rating: 4.4, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  ];
  const restaurantCategories = ['All', 'Indian', 'Chinese', 'Italian', 'Fast Food'];
  const [selectedRestaurantCategory, setSelectedRestaurantCategory] = useState('All');
  const filteredRestaurants = selectedRestaurantCategory === 'All'
    ? restaurantData
    : restaurantData.filter(r => r.cuisine === selectedRestaurantCategory);

  // Food items for the menu
  const foodItems = [
    { name: 'Classic Cheeseburger', price: 129, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80', category: 'Burgers' },
    { name: 'Paneer Tikka', price: 99, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', category: 'Biryani' },
    { name: 'Veg Hakka Noodles', price: 89, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', category: 'Rolls' },
    { name: 'Margherita Pizza', price: 149, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', category: 'Pizzas' },
    { name: 'Café Mocha', price: 59, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', category: 'Beverages' },
    { name: 'French Fries', price: 49, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', category: 'Snacks' },
    { name: 'Farmhouse Pizza', price: 179, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', category: 'Pizzas' },
    { name: 'Chicken Biryani', price: 159, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', category: 'Biryani' },
    { name: 'Paneer Roll', price: 79, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', category: 'Rolls' },
  ];
  const foodCategories = ['All', 'Pizzas', 'Biryani', 'Rolls', 'Burgers', 'Beverages', 'Snacks'];
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('All');
  const filteredFoodItems = selectedFoodCategory === 'All'
    ? foodItems
    : foodItems.filter(item => item.category === selectedFoodCategory);

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [modal, setModal] = useState(null); // 'login' | 'signup' | 'partner' | null
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]); // [{name, price, img, qty}]
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
    setCart(prev => {
      const idx = prev.findIndex(f => f.name === item.name && f.price === item.price);
      if (idx !== -1) {
        // Increase quantity
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  // Remove from Cart handler
  function handleRemoveFromCart(name, price) {
    setCart(prev => prev.filter(f => !(f.name === name && f.price === price)));
  }

  // Update quantity
  function handleUpdateQty(name, price, qty) {
    setCart(prev => prev.map(f => (f.name === name && f.price === price ? { ...f, qty } : f)));
  }

  // Cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
          <Link to="/orders" className="nav-link">Orders</Link>
        </nav>
        <div className="header-actions">
          <button className="cart-btn" title="Cart" onClick={() => setCartOpen(true)}>
            <span role="img" aria-label="cart">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="login-btn" onClick={() => setModal('login')}>Login</button>
          <button className="signup-btn" onClick={() => setModal('signup')}>Sign Up</button>
        </div>
      </header>
      {/* Main page content (always visible) */}
      <Routes>
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
                  <button className="partner-btn" onClick={() => { setModal('partner'); setPartnerThankYou(false); }}>🏍️ Become a Delivery Partner</button>
                </div>
              </div>
            </section>

            {/* Popular Restaurants Section */}
            <section className="popular-section" id="restaurants">
              <h2 className="popular-title">Popular Restaurants</h2>
              <p className="popular-desc">Discover amazing food from top-rated restaurants near your campus</p>
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
                    key={r.name + r.cuisine}
                    delay={i * 80}
                  >
                    <img src={r.img} alt={r.name} className="restaurant-img" />
                    {r.tag && <span className="restaurant-tag">{r.tag}</span>}
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{r.name}</h3>
                      <div className="restaurant-meta">
                        <span className="restaurant-cuisine">{r.cuisine}</span>
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
                    key={item.name + item.category}
                    delay={idx * 80}
                  >
                    <img src={item.img} alt={item.name} className="food-img" />
                    <div className="food-info">
                      <h3 className="food-name">{item.name}</h3>
                      <div className="food-meta">
                        <span className="food-price">₹{item.price}</span>
                        <button className="add-cart-btn" onClick={() => handleAddToCart(item)}>Add to Cart</button>
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
            {modal === 'login' ? <LoginModal onSwitch={() => setModal('signup')} /> :
             modal === 'signup' ? <SignupModal onSwitch={() => setModal('login')} /> :
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
            {cart.length === 0 ? (
              <div className="cart-sidebar-empty">Your cart is empty.</div>
            ) : (
              <div className="cart-sidebar-items">
                {cart.map(item => (
                  <div className="cart-sidebar-item" key={item.name + item.price}>
                    <img src={item.img} alt={item.name} className="cart-sidebar-img" />
                    <div className="cart-sidebar-info">
                      <div className="cart-sidebar-name">{item.name}</div>
                      <div className="cart-sidebar-meta">
                        <span className="cart-sidebar-price">₹{item.price}</span>
                        <span className="cart-sidebar-qty">
                          <button onClick={() => handleUpdateQty(item.name, item.price, Math.max(1, item.qty - 1))}>-</button>
                          {item.qty}
                          <button onClick={() => handleUpdateQty(item.name, item.price, item.qty + 1)}>+</button>
                        </span>
                      </div>
                    </div>
                    <button className="cart-sidebar-remove" onClick={() => handleRemoveFromCart(item.name, item.price)} title="Remove">&times;</button>
                  </div>
                ))}
              </div>
            )}
            <div className="cart-sidebar-footer">
              <div className="cart-sidebar-total-row">
                <span>Total:</span>
                <span className="cart-sidebar-total">₹{cartTotal}</span>
              </div>
              <button className="cart-sidebar-checkout">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal versions of Login/Signup
function LoginModal({ onSwitch }) {
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`Welcome back, ${data.user.name}!`);
        window.location.reload(); // Refresh to update UI
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check if the backend server is running.');
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
function SignupModal({ onSwitch }) {
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          collegeId: formData.collegeId
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful! You can now login.');
        onSwitch(); // Switch to login modal
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check if the backend server is running.');
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
