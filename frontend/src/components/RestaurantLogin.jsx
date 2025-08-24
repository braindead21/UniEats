import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const RestaurantLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
        if (result.user.role === 'restaurant_owner') {
          navigate('/restaurant/dashboard');
        } else {
          setError('Invalid credentials for restaurant owner login');
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-home">← Back to Home</Link>
          <h1>🏪 Restaurant Owner Login</h1>
          <p>Access your restaurant management dashboard</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>📧 Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your restaurant email" 
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>🔒 Password</label>
              <div className="password-input">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Enter your password" 
                  className="auth-input"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="auth-btn primary" type="submit" disabled={loading}>
              {loading ? '🔄 Signing In...' : '🏪 Login to Dashboard'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/restaurant/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
          </div>

          <div className="auth-switch">
            <p>Want to register your restaurant?</p>
            <Link to="/restaurant/signup" className="switch-link">
              📝 Register Restaurant
            </Link>
          </div>

          <div className="other-logins">
            <p>Login as different role:</p>
            <div className="role-links">
              <Link to="/student/login" className="role-link student">
                🎓 Student
              </Link>
              <Link to="/delivery/login" className="role-link delivery">
                🏍️ Delivery Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
