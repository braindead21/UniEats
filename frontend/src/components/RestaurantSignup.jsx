import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import './RoleLogin.css';
import './auth-enhanced.css';
import './auth-viewport-fit.css';
import './auth-unified-signup.css';
import './auth-compact-signup.css';

const RestaurantSignup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    restaurantName: '',
    cuisine: '',
    location: '',
    description: '',
    businessLicense: '',
    fssaiNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [floatingIcons] = useState(() => {
    const icons = ['🍕', '🍔', '🌮', '🍜', '🍱', '🍝', '🥘', '🍛', '🥗', '🍲', '🌯', '🥙', '🍖', '🍗', '🥩'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10
    }));
  });

  useEffect(() => {
    document.body.classList.add('restaurant-theme-body');
    return () => document.body.classList.remove('restaurant-theme-body');
  }, []);

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

    // Validation
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
        role: 'restaurant_owner',
        phone: formData.phone,
        restaurantInfo: {
          restaurantName: formData.restaurantName,
          cuisine: formData.cuisine,
          location: formData.location,
          description: formData.description,
          businessLicense: formData.businessLicense,
          fssaiNumber: formData.fssaiNumber
        }
      });

      if (result.success) {
        navigate('/restaurant/dashboard');
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
    <div className="role-login-page restaurant-theme has-multi-step">
      {/* Animated Background */}
      <div className="role-bg-gradient"></div>
      <div className="role-grid-overlay"></div>
      
      {/* Floating Icons */}
      <div className="floating-icons-container">
        {floatingIcons.map(item => (
          <div
            key={item.id}
            className="floating-icon"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="glow-orb restaurant-orb-1"></div>
      <div className="glow-orb restaurant-orb-2"></div>

      <div className="role-container signup-container">
        {/* Header */}
        <div className="role-header-section">
          <Link to="/" className="role-back-btn">
            <span className="back-arrow">←</span>
            <span>Back to Home</span>
          </Link>
          
          <div className="role-icon-wrapper">
            <div className="role-main-icon restaurant-icon">
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="15" cy="15" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="icon-pulse"></div>
            </div>
          </div>

          <h1 className="role-title">
            <span className="title-text">Restaurant Registration</span>
          </h1>
          <p className="role-subtitle">Join our platform and reach thousands of students</p>
        </div>

        {/* Signup Card */}
        <div className="role-card-wrapper">
          <div className="role-login-card restaurant-card signup-card">
            {/* Progress Indicator */}
            <div className="signup-progress">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Owner</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Restaurant</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span>Legal</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <span>Security</span>
              </div>
            </div>

            {/* Form */}
            <form className="role-form signup-form" onSubmit={handleSubmit}>
              {/* Step 1: Owner Information */}
              <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>👤 Owner Information</h3>
                  <p>Business owner details</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="name" className="role-label">
                      <span className="label-icon">👤</span>
                      Owner Name
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        placeholder="Enter owner's full name" 
                        className="role-input"
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="phone" className="role-label">
                      <span className="label-icon">📱</span>
                      Phone Number
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 000-0000" 
                        className="role-input"
                        value={formData.phone}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group full-width">
                    <label htmlFor="email" className="role-label">
                      <span className="label-icon">📧</span>
                      Email Address
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        placeholder="owner@restaurant.com" 
                        className="role-input"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="step-btn next-btn restaurant-btn"
                  onClick={() => setCurrentStep(2)}
                >
                  <span>Next Step</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              {/* Step 2: Restaurant Information */}
              <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>🏪 Restaurant Information</h3>
                  <p>Your restaurant details</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="restaurantName" className="role-label">
                      <span className="label-icon">🏪</span>
                      Restaurant Name
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="restaurantName"
                        name="restaurantName"
                        placeholder="e.g., Tasty Corner" 
                        className="role-input"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="cuisine" className="role-label">
                      <span className="label-icon">🍽️</span>
                      Cuisine Type
                    </label>
                    <div className="role-input-wrapper">
                      <select 
                        id="cuisine"
                        name="cuisine"
                        className="role-input"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Indian">🇮🇳 Indian</option>
                        <option value="Chinese">🇨🇳 Chinese</option>
                        <option value="Italian">🇮🇹 Italian</option>
                        <option value="Fast Food">🍔 Fast Food</option>
                        <option value="South Indian">🍛 South Indian</option>
                        <option value="North Indian">🍗 North Indian</option>
                        <option value="Continental">🍽️ Continental</option>
                        <option value="Multi-Cuisine">🌍 Multi-Cuisine</option>
                      </select>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group full-width">
                    <label htmlFor="location" className="role-label">
                      <span className="label-icon">📍</span>
                      Restaurant Location
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="location"
                        name="location"
                        placeholder="Near campus gate, Main road" 
                        className="role-input"
                        value={formData.location}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group full-width">
                    <label htmlFor="description" className="role-label">
                      <span className="label-icon">📝</span>
                      Restaurant Description
                    </label>
                    <div className="role-input-wrapper">
                      <textarea 
                        id="description"
                        name="description"
                        placeholder="Brief description of your restaurant and specialties" 
                        className="role-input textarea"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>
                </div>

                <div className="step-buttons">
                  <button 
                    type="button" 
                    className="step-btn back-btn"
                    onClick={() => setCurrentStep(1)}
                  >
                    <span className="btn-arrow">←</span>
                    <span>Back</span>
                  </button>
                  <button 
                    type="button" 
                    className="step-btn next-btn restaurant-btn"
                    onClick={() => setCurrentStep(3)}
                  >
                    <span>Next Step</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Legal Information */}
              <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>📄 Legal Information</h3>
                  <p>Required business licenses</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="businessLicense" className="role-label">
                      <span className="label-icon">📋</span>
                      Business License
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="businessLicense"
                        name="businessLicense"
                        placeholder="License number" 
                        className="role-input"
                        value={formData.businessLicense}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="fssaiNumber" className="role-label">
                      <span className="label-icon">🏥</span>
                      FSSAI Number
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="fssaiNumber"
                        name="fssaiNumber"
                        placeholder="Food safety license" 
                        className="role-input"
                        value={formData.fssaiNumber}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>
                </div>

                <div className="step-buttons">
                  <button 
                    type="button" 
                    className="step-btn back-btn"
                    onClick={() => setCurrentStep(2)}
                  >
                    <span className="btn-arrow">←</span>
                    <span>Back</span>
                  </button>
                  <button 
                    type="button" 
                    className="step-btn next-btn restaurant-btn"
                    onClick={() => setCurrentStep(4)}
                  >
                    <span>Next Step</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Step 4: Security */}
              <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>🔒 Account Security</h3>
                  <p>Create a secure password</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="password" className="role-label">
                      <span className="label-icon">🔒</span>
                      Password
                    </label>
                    <div className="role-input-wrapper password-wrapper">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="password"
                        name="password"
                        placeholder="Create strong password" 
                        className="role-input"
                        value={formData.password}
                        onChange={handleChange}
                        required 
                      />
                      <button 
                        type="button" 
                        className="role-password-toggle" 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeWidth="2"/>
                            <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/>
                          </svg>
                        )}
                      </button>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="confirmPassword" className="role-label">
                      <span className="label-icon">🔒</span>
                      Confirm Password
                    </label>
                    <div className="role-input-wrapper password-wrapper">
                      <input 
                        type={showConfirm ? "text" : "password"} 
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password" 
                        className="role-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required 
                      />
                      <button 
                        type="button" 
                        className="role-password-toggle" 
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirm ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeWidth="2"/>
                            <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/>
                          </svg>
                        )}
                      </button>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="password-hint full-width">
                    <small>💡 Password must be at least 6 characters long</small>
                  </div>
                </div>

                {error && (
                  <div className="role-error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="step-buttons">
                  <button 
                    type="button" 
                    className="step-btn back-btn"
                    onClick={() => setCurrentStep(3)}
                  >
                    <span className="btn-arrow">←</span>
                    <span>Back</span>
                  </button>
                  <button 
                    className={`role-submit-btn restaurant-btn ${loading ? 'loading' : ''}`}
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🏪</span>
                        <span>Register Restaurant</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="signup-section">
              <p>Already have a restaurant account?</p>
              <Link to="/restaurant/login" className="signup-link restaurant-signup">
                <span>🚀</span>
                <span>Login to Dashboard</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="section-divider">
              <span>Join as Different Role</span>
            </div>

            {/* Other Roles */}
            <div className="other-roles-grid">
              <Link to="/student/signup" className="other-role-card student-card">
                <div className="other-role-icon">🎓</div>
                <div className="other-role-text">
                  <span className="other-role-name">Student</span>
                  <span className="other-role-desc">Order food</span>
                </div>
              </Link>
              <Link to="/delivery/signup" className="other-role-card delivery-card">
                <div className="other-role-icon">🏍️</div>
                <div className="other-role-text">
                  <span className="other-role-name">Delivery</span>
                  <span className="other-role-desc">Become partner</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignup;
