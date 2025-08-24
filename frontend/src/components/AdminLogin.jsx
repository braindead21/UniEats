import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

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
    <div className="auth-page admin-auth">
      <div className="auth-container">
        <div className="auth-header admin-header">
          <Link to="/" className="back-home">← Back to Home</Link>
          <h1>🛡️ Admin Portal</h1>
          <p>Secure access to platform administration</p>
        </div>

        <div className="auth-card admin-card">
          <div className="admin-lock">
            <div className="lock-icon">🔐</div>
            <h3>Authorized Personnel Only</h3>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>🛡️ Admin Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter admin email address" 
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>🔒 Admin Password</label>
              <div className="password-input">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Enter admin password" 
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

            {error && <div className="error-message admin-error">{error}</div>}

            <button className="auth-btn admin-btn" type="submit" disabled={loading}>
              {loading ? '🔄 Verifying...' : '🛡️ Access Admin Panel'}
            </button>
          </form>

          <div className="admin-security-note">
            <p>⚠️ This portal is for authorized administrators only</p>
            <p>All access attempts are logged and monitored</p>
          </div>

          <div className="public-access">
            <p>Looking for public access?</p>
            <div className="role-links">
              <Link to="/student/login" className="role-link student">
                🎓 Student Login
              </Link>
              <Link to="/restaurant/login" className="role-link restaurant">
                🏪 Restaurant Login
              </Link>
              <Link to="/delivery/login" className="role-link delivery">
                🏍️ Delivery Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
