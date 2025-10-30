import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import './AdminLogin.css';
import './auth-enhanced.css';
import './auth-viewport-fit.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particlesActive, setParticlesActive] = useState(true);

  // Generate floating particles
  const generateParticles = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15
    }));
  };

  const [particles] = useState(generateParticles());

  useEffect(() => {
    // Add mounted class for animations
    document.body.classList.add('admin-page-mounted');
    return () => {
      document.body.classList.remove('admin-page-mounted');
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
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin credentials required.');
        }
      } else {
        setError(result.message || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Animated Background */}
      <div className="admin-bg-gradient"></div>
      <div className="admin-grid-overlay"></div>
      
      {/* Floating Particles */}
      {particlesActive && (
        <div className="particles-container">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Glowing Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-3"></div>

      <div className="admin-container">
        {/* Header Section */}
        <div className="admin-header-section">
          <Link to="/" className="admin-back-btn">
            <span className="back-icon">←</span>
            <span>Back to Home</span>
          </Link>
          
          <div className="admin-logo-container">
            <div className="shield-wrapper">
              <div className="shield-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7V11C3 15.55 6.84 19.74 12 21C17.16 19.74 21 15.55 21 11V7L12 2Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="shield-pulse"></div>
            </div>
          </div>

          <h1 className="admin-title">
            <span className="title-gradient">Admin Portal</span>
          </h1>
          <p className="admin-subtitle">Secure Access to Platform Administration</p>
        </div>

        {/* Login Card */}
        <div className="admin-card-wrapper">
          <div className="admin-login-card">
            {/* Security Badge */}
            <div className="security-badge">
              <div className="badge-icon">🔐</div>
              <div className="badge-text">
                <h3>Authorized Personnel Only</h3>
                <p>All access attempts are monitored</p>
              </div>
            </div>

            {/* Login Form */}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">�</span>
                  Admin Email
                </label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="admin@unieats.com" 
                    className="admin-input"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                  <div className="input-line"></div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  Admin Password
                </label>
                <div className="input-wrapper password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password"
                    name="password"
                    placeholder="Enter your secure password" 
                    className="admin-input"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
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
                  <div className="input-line"></div>
                </div>
              </div>

              {error && (
                <div className="admin-error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button 
                className={`admin-submit-btn ${loading ? 'loading' : ''}`} 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛡️</span>
                    <span>Access Admin Panel</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="security-notice">
              <div className="notice-icon">⚠️</div>
              <p>This portal is restricted to authorized administrators only. Unauthorized access attempts are logged and may result in legal action.</p>
            </div>

            {/* Other Login Options */}
            <div className="other-logins">
              <div className="divider">
                <span>Other Login Options</span>
              </div>
              <div className="role-links-grid">
                <Link to="/student/login" className="role-link-modern student-link">
                  <div className="role-icon">🎓</div>
                  <div className="role-text">
                    <span className="role-name">Student</span>
                    <span className="role-desc">Access your account</span>
                  </div>
                </Link>
                <Link to="/restaurant/login" className="role-link-modern restaurant-link">
                  <div className="role-icon">🏪</div>
                  <div className="role-text">
                    <span className="role-name">Restaurant</span>
                    <span className="role-desc">Manage your menu</span>
                  </div>
                </Link>
                <Link to="/delivery/login" className="role-link-modern delivery-link">
                  <div className="role-icon">🏍️</div>
                  <div className="role-text">
                    <span className="role-name">Delivery</span>
                    <span className="role-desc">Start delivering</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
