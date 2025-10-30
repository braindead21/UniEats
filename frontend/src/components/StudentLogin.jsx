import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import './RoleLogin.css';
import './auth-enhanced.css';
import './auth-viewport-fit.css';
import './auth-unified-login.css';

const StudentLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate floating icons
  const generateIcons = () => {
    const icons = ['📚', '🍕', '🍔', '🌮', '🍜', '☕', '🥗', '🍱'];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15
    }));
  };

  const [floatingIcons] = useState(generateIcons());

  useEffect(() => {
    document.body.classList.add('student-page-mounted');
    return () => {
      document.body.classList.remove('student-page-mounted');
    };
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

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (result.user.role === 'student') {
          navigate('/student/dashboard');
        } else {
          setError('Invalid credentials for student login');
        }
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
    <div className="role-login-page student-theme">
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
      <div className="glow-orb student-orb-1"></div>
      <div className="glow-orb student-orb-2"></div>

      <div className="role-container">
        {/* Header */}
        <div className="role-header-section">
          <Link to="/" className="role-back-btn">
            <span className="back-arrow">←</span>
            <span>Back to Home</span>
          </Link>
          
          <div className="role-icon-wrapper">
            <div className="role-main-icon student-icon">
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="icon-pulse"></div>
            </div>
          </div>

          <h1 className="role-title">
            <span className="title-text">Student Portal</span>
          </h1>
          <p className="role-subtitle">Access your food ordering dashboard</p>
        </div>

        {/* Login Card */}
        <div className="role-card-wrapper">
          <div className="role-login-card student-card">
            {/* Welcome Badge */}
            <div className="welcome-badge student-badge">
              <div className="badge-icon-large">🎓</div>
              <div className="badge-content">
                <h3>Welcome Back, Student!</h3>
                <p>Order delicious meals from campus restaurants</p>
              </div>
            </div>

            {/* Form */}
            <form className="role-form" onSubmit={handleSubmit}>
              <div className="role-form-group">
                <label htmlFor="email" className="role-label">
                  <span className="label-icon">📧</span>
                  University Email
                </label>
                <div className="role-input-wrapper">
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="student@university.edu" 
                    className="role-input"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                  <div className="input-focus-line"></div>
                </div>
              </div>

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
                    placeholder="Enter your password" 
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

              <div className="forgot-password-link">
                <Link to="/student/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="role-error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button 
                className={`role-submit-btn student-btn ${loading ? 'loading' : ''}`}
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    <span>Login to Dashboard</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="signup-section">
              <p>Don't have an account?</p>
              <Link to="/student/signup" className="signup-link student-signup">
                <span>📝</span>
                <span>Create Student Account</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="section-divider">
              <span>Other Login Options</span>
            </div>

            {/* Other Roles */}
            <div className="other-roles-grid">
              <Link to="/restaurant/login" className="other-role-card restaurant-card">
                <div className="other-role-icon">🏪</div>
                <div className="other-role-text">
                  <span className="other-role-name">Restaurant</span>
                  <span className="other-role-desc">Manage your menu</span>
                </div>
              </Link>
              <Link to="/delivery/login" className="other-role-card delivery-card">
                <div className="other-role-icon">🏍️</div>
                <div className="other-role-text">
                  <span className="other-role-name">Delivery</span>
                  <span className="other-role-desc">Start delivering</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
