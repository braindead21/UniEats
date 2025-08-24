import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const RestaurantSignup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-home">← Back to Home</Link>
          <h1>🏪 Restaurant Registration</h1>
          <p>Join our platform and reach thousands of hungry students</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="section-title">👤 Owner Information</div>
            
            <div className="form-row">
              <div className="input-group">
                <label>👤 Owner Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter owner's full name" 
                  className="auth-input"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>📱 Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Owner's phone number" 
                  className="auth-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>📧 Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="owner@restaurant.com" 
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="section-title">🏪 Restaurant Information</div>

            <div className="form-row">
              <div className="input-group">
                <label>🏪 Restaurant Name</label>
                <input 
                  type="text" 
                  name="restaurantName"
                  placeholder="e.g., Tasty Corner" 
                  className="auth-input"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>🍽️ Cuisine Type</label>
                <select 
                  name="cuisine"
                  className="auth-input"
                  value={formData.cuisine}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Cuisine Type</option>
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Continental">Continental</option>
                  <option value="Multi-Cuisine">Multi-Cuisine</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>📍 Restaurant Location</label>
              <input 
                type="text" 
                name="location"
                placeholder="Near campus gate, Main road" 
                className="auth-input"
                value={formData.location}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>📝 Restaurant Description</label>
              <textarea 
                name="description"
                placeholder="Brief description of your restaurant and specialties" 
                className="auth-input textarea"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="section-title">📄 Legal Information</div>

            <div className="form-row">
              <div className="input-group">
                <label>📋 Business License Number</label>
                <input 
                  type="text" 
                  name="businessLicense"
                  placeholder="Your business license number" 
                  className="auth-input"
                  value={formData.businessLicense}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>🏥 FSSAI Number</label>
                <input 
                  type="text" 
                  name="fssaiNumber"
                  placeholder="Food safety license number" 
                  className="auth-input"
                  value={formData.fssaiNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="section-title">🔒 Account Security</div>

            <div className="form-row">
              <div className="input-group">
                <label>🔒 Password</label>
                <div className="password-input">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Create a strong password" 
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
              <div className="input-group">
                <label>🔒 Confirm Password</label>
                <div className="password-input">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    name="confirmPassword"
                    placeholder="Confirm your password" 
                    className="auth-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="password-requirements">
              <small>Password must be at least 6 characters long</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="auth-btn primary" type="submit" disabled={loading}>
              {loading ? '🔄 Registering Restaurant...' : '🏪 Register Restaurant'}
            </button>
          </form>

          <div className="auth-switch">
            <p>Already have a restaurant account?</p>
            <Link to="/restaurant/login" className="switch-link">
              🚀 Login to Dashboard
            </Link>
          </div>

          <div className="other-logins">
            <p>Join as different role:</p>
            <div className="role-links">
              <Link to="/student/signup" className="role-link student">
                🎓 Register as Student
              </Link>
              <Link to="/delivery/signup" className="role-link delivery">
                🏍️ Become Delivery Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSignup;
