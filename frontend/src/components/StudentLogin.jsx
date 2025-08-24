import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-home">← Back to Home</Link>
          <h1>🎓 Student Login</h1>
          <p>Access your food ordering dashboard</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>📧 Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your university email" 
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
              {loading ? '🔄 Signing In...' : '🚀 Login as Student'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/student/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
          </div>

          <div className="auth-switch">
            <p>Don't have a student account?</p>
            <Link to="/student/signup" className="switch-link">
              📝 Create Student Account
            </Link>
          </div>

          <div className="other-logins">
            <p>Login as different role:</p>
            <div className="role-links">
              <Link to="/restaurant/login" className="role-link restaurant">
                🏪 Restaurant Owner
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

export default StudentLogin;
