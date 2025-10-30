import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import './RoleLogin.css';
import './auth-enhanced.css';
import './auth-viewport-fit.css';
import './auth-unified-signup.css';
import './auth-compact-signup.css';

const DeliverySignup = () => {
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
    collegeId: '',
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    aadharNumber: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [floatingIcons] = useState(() => {
    const icons = ['🏍️', '📦', '🚴', '⚡', '🛵', '🚚', '📍', '⏱️', '✅', '🎯', '🌟', '💨', '🧭', '🔔', '⚙️'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10
    }));
  });

  useEffect(() => {
    document.body.classList.add('delivery-theme-body');
    return () => document.body.classList.remove('delivery-theme-body');
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
        role: 'delivery_partner',
        phone: formData.phone,
        collegeId: formData.collegeId,
        deliveryPartnerInfo: {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          licenseNumber: formData.licenseNumber,
          aadharNumber: formData.aadharNumber,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone
        }
      });

      if (result.success) {
        navigate('/delivery/dashboard');
      } else {
        console.error('Registration failed:', result);
        const errorMessage = result.message || 'Registration failed';
        if (result.errors && Array.isArray(result.errors)) {
          setError(result.errors.join(', '));
        } else {
          setError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(`Network error: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-login-page delivery-theme has-multi-step">
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
      <div className="glow-orb delivery-orb-1"></div>
      <div className="glow-orb delivery-orb-2"></div>

      <div className="role-container signup-container">
        {/* Header */}
        <div className="role-header-section">
          <Link to="/" className="role-back-btn">
            <span className="back-arrow">←</span>
            <span>Back to Home</span>
          </Link>
          
          <div className="role-icon-wrapper">
            <div className="role-main-icon delivery-icon">
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8V2l4 3-4 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="icon-pulse"></div>
            </div>
          </div>

          <h1 className="role-title">
            <span className="title-text">Delivery Partner Registration</span>
          </h1>
          <p className="role-subtitle">Join our delivery network and start earning</p>
        </div>

        {/* Signup Card */}
        <div className="role-card-wrapper">
          <div className="role-login-card delivery-card signup-card">
            {/* Progress Indicator */}
            <div className="signup-progress">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Personal</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Vehicle</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span>Documents</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <span>Security</span>
              </div>
            </div>

            {/* Form */}
            <form className="role-form signup-form" onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>👤 Personal Information</h3>
                  <p>Tell us about yourself</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="name" className="role-label">
                      <span className="label-icon">👤</span>
                      Full Name
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        placeholder="Enter your full name" 
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
                        placeholder="your.email@example.com" 
                        className="role-input"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="collegeId" className="role-label">
                      <span className="label-icon">🎓</span>
                      College ID
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="collegeId"
                        name="collegeId"
                        placeholder="COL123456" 
                        className="role-input"
                        value={formData.collegeId}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group full-width">
                    <label htmlFor="address" className="role-label">
                      <span className="label-icon">🏠</span>
                      Complete Address
                    </label>
                    <div className="role-input-wrapper">
                      <textarea 
                        id="address"
                        name="address"
                        placeholder="Your complete address" 
                        className="role-input textarea"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="step-btn next-btn delivery-btn"
                  onClick={() => setCurrentStep(2)}
                >
                  <span>Next Step</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              {/* Step 2: Vehicle Information */}
              <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>🚗 Vehicle Information</h3>
                  <p>Your delivery vehicle details</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="vehicleType" className="role-label">
                      <span className="label-icon">🛵</span>
                      Vehicle Type
                    </label>
                    <div className="role-input-wrapper">
                      <select 
                        id="vehicleType"
                        name="vehicleType"
                        className="role-input"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Motorcycle">🏍️ Motorcycle</option>
                        <option value="Scooter">🛵 Scooter</option>
                        <option value="Bicycle">🚴 Bicycle</option>
                        <option value="Car">🚗 Car</option>
                      </select>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="vehicleNumber" className="role-label">
                      <span className="label-icon">🔢</span>
                      Vehicle Number
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="vehicleNumber"
                        name="vehicleNumber"
                        placeholder="MH12AB1234" 
                        className="role-input"
                        value={formData.vehicleNumber}
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
                    className="step-btn next-btn delivery-btn"
                    onClick={() => setCurrentStep(3)}
                  >
                    <span>Next Step</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Documents & Emergency */}
              <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>📄 Documents & Emergency Contact</h3>
                  <p>Required documents and emergency details</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="licenseNumber" className="role-label">
                      <span className="label-icon">🪪</span>
                      License Number
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="licenseNumber"
                        name="licenseNumber"
                        placeholder="DL1234567890" 
                        className="role-input"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="aadharNumber" className="role-label">
                      <span className="label-icon">🆔</span>
                      Aadhar Number
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="aadharNumber"
                        name="aadharNumber"
                        placeholder="1234 5678 9012" 
                        className="role-input"
                        value={formData.aadharNumber}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="emergencyContact" className="role-label">
                      <span className="label-icon">🚨</span>
                      Emergency Contact
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="emergencyContact"
                        name="emergencyContact"
                        placeholder="Contact person name" 
                        className="role-input"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="emergencyPhone" className="role-label">
                      <span className="label-icon">📞</span>
                      Emergency Phone
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="tel" 
                        id="emergencyPhone"
                        name="emergencyPhone"
                        placeholder="+1 (555) 000-0000" 
                        className="role-input"
                        value={formData.emergencyPhone}
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
                    className="step-btn next-btn delivery-btn"
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
                    className={`role-submit-btn delivery-btn ${loading ? 'loading' : ''}`}
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
                        <span className="btn-icon">🏍️</span>
                        <span>Join as Partner</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="signup-section">
              <p>Already a delivery partner?</p>
              <Link to="/delivery/login" className="signup-link delivery-signup">
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
              <Link to="/restaurant/signup" className="other-role-card restaurant-card">
                <div className="other-role-icon">🏪</div>
                <div className="other-role-text">
                  <span className="other-role-name">Restaurant</span>
                  <span className="other-role-desc">Register business</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySignup;
