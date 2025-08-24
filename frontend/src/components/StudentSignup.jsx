import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const StudentSignup = () => {
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
    studentId: '',
    hostelBlock: '',
    roomNumber: '',
    course: '',
    year: 1
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
        role: 'student',
        phone: formData.phone,
        collegeId: formData.studentId, // Add collegeId for validation
        studentInfo: {
          studentId: formData.studentId,
          hostelBlock: formData.hostelBlock,
          roomNumber: formData.roomNumber,
          course: formData.course,
          year: parseInt(formData.year) || 1
        }
      });

      if (result.success) {
        navigate('/student/dashboard');
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
          <h1>🎓 Student Registration</h1>
          <p>Create your account to start ordering food</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
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
                  placeholder="Enter your phone number" 
                  className="auth-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>📧 University Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="your.name@university.edu" 
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>🆔 Student ID</label>
                <input 
                  type="text" 
                  name="studentId"
                  placeholder="Your student ID number" 
                  className="auth-input"
                  value={formData.studentId}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="input-group">
                <label>📚 Course/Department</label>
                <input 
                  type="text" 
                  name="course"
                  placeholder="e.g., Computer Science" 
                  className="auth-input"
                  value={formData.course}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>� Academic Year</label>
                <select 
                  name="year"
                  className="auth-input"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                  <option value={5}>5th Year</option>
                </select>
              </div>
              <div className="input-group">
                <label>�🏠 Hostel Block</label>
                <select 
                  name="hostelBlock"
                  className="auth-input"
                  value={formData.hostelBlock}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Hostel Block</option>
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                  <option value="D">Block D</option>
                  <option value="E">Block E</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>🚪 Room Number</label>
                <input 
                  type="text" 
                  name="roomNumber"
                  placeholder="e.g., 201" 
                  className="auth-input"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

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
              {loading ? '🔄 Creating Account...' : '🎉 Create Student Account'}
            </button>
          </form>

          <div className="auth-switch">
            <p>Already have a student account?</p>
            <Link to="/student/login" className="switch-link">
              🚀 Login as Student
            </Link>
          </div>

          <div className="other-logins">
            <p>Join as different role:</p>
            <div className="role-links">
              <Link to="/restaurant/signup" className="role-link restaurant">
                🏪 Register Restaurant
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

export default StudentSignup;
