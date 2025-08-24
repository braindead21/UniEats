import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const DeliverySignup = () => {
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-home">← Back to Home</Link>
          <h1>🏍️ Delivery Partner Registration</h1>
          <p>Join our delivery network and start earning money</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="section-title">👤 Personal Information</div>
            
            <div className="form-row">
              <div className="input-group">
                <label>👤 Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter your full name" 
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
                  placeholder="Your phone number" 
                  className="auth-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>🎓 College ID</label>
                <input 
                  type="text" 
                  name="collegeId"
                  placeholder="Your college ID number" 
                  className="auth-input"
                  value={formData.collegeId}
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
                placeholder="your.email@example.com" 
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>🏠 Address</label>
              <textarea 
                name="address"
                placeholder="Your complete address" 
                className="auth-input textarea"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="section-title">🚗 Vehicle Information</div>

            <div className="form-row">
              <div className="input-group">
                <label>🚗 Vehicle Type</label>
                <select 
                  name="vehicleType"
                  className="auth-input"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Car">Car</option>
                </select>
              </div>
              <div className="input-group">
                <label>🔢 Vehicle Number</label>
                <input 
                  type="text" 
                  name="vehicleNumber"
                  placeholder="e.g., MH12AB1234" 
                  className="auth-input"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="section-title">📄 Documents</div>

            <div className="form-row">
              <div className="input-group">
                <label>🪪 Driving License Number</label>
                <input 
                  type="text" 
                  name="licenseNumber"
                  placeholder="Your driving license number" 
                  className="auth-input"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>🆔 Aadhar Number</label>
                <input 
                  type="text" 
                  name="aadharNumber"
                  placeholder="12-digit Aadhar number" 
                  className="auth-input"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="section-title">🚨 Emergency Contact</div>

            <div className="form-row">
              <div className="input-group">
                <label>👤 Emergency Contact Name</label>
                <input 
                  type="text" 
                  name="emergencyContact"
                  placeholder="Contact person name" 
                  className="auth-input"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>📱 Emergency Phone</label>
                <input 
                  type="tel" 
                  name="emergencyPhone"
                  placeholder="Emergency contact number" 
                  className="auth-input"
                  value={formData.emergencyPhone}
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
              {loading ? '🔄 Registering Partner...' : '🏍️ Join as Delivery Partner'}
            </button>
          </form>

          <div className="auth-switch">
            <p>Already a delivery partner?</p>
            <Link to="/delivery/login" className="switch-link">
              🚀 Login to Dashboard
            </Link>
          </div>

          <div className="other-logins">
            <p>Join as different role:</p>
            <div className="role-links">
              <Link to="/student/signup" className="role-link student">
                🎓 Register as Student
              </Link>
              <Link to="/restaurant/signup" className="role-link restaurant">
                🏪 Register Restaurant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySignup;
