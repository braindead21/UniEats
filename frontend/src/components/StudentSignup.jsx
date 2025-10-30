import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import './RoleLogin.css';
import './auth-enhanced.css';
import './auth-viewport-fit.css';
import './auth-unified-signup.css';

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
  const [currentStep, setCurrentStep] = useState(1);

  // Generate floating icons
  const generateIcons = () => {
    const icons = ['📚', '🎓', '📖', '✏️', '🍕', '🍔', '🌮', '🍜'];
    return Array.from({ length: 15 }, (_, i) => ({
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
    <div className="role-login-page student-theme has-multi-step">
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

      <div className="role-container signup-container">
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
            <span className="title-text">Student Registration</span>
          </h1>
          <p className="role-subtitle">Create your account to start ordering food</p>
        </div>

        {/* Signup Card */}
        <div className="role-card-wrapper">
          <div className="role-login-card student-card signup-card">
            {/* Progress Indicator */}
            <div className="signup-progress">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Personal</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Academic</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
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
                        placeholder="John Doe" 
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
                </div>

                <button 
                  type="button" 
                  className="step-btn next-btn student-btn"
                  onClick={() => setCurrentStep(2)}
                >
                  <span>Next Step</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>

              {/* Step 2: Academic Information */}
              <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="step-header">
                  <h3>🎓 Academic Information</h3>
                  <p>Your student details</p>
                </div>

                <div className="form-grid">
                  <div className="role-form-group">
                    <label htmlFor="studentId" className="role-label">
                      <span className="label-icon">🆔</span>
                      Student ID
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="studentId"
                        name="studentId"
                        placeholder="STU123456" 
                        className="role-input"
                        value={formData.studentId}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="course" className="role-label">
                      <span className="label-icon">📚</span>
                      Course/Department
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="course"
                        name="course"
                        placeholder="Computer Science" 
                        className="role-input"
                        value={formData.course}
                        onChange={handleChange}
                        required 
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="year" className="role-label">
                      <span className="label-icon">📅</span>
                      Academic Year
                    </label>
                    <div className="role-input-wrapper">
                      <select 
                        id="year"
                        name="year"
                        className="role-input"
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
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="hostelBlock" className="role-label">
                      <span className="label-icon">🏠</span>
                      Hostel Block
                    </label>
                    <div className="role-input-wrapper">
                      <select 
                        id="hostelBlock"
                        name="hostelBlock"
                        className="role-input"
                        value={formData.hostelBlock}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Block</option>
                        <option value="A">Block A</option>
                        <option value="B">Block B</option>
                        <option value="C">Block C</option>
                        <option value="D">Block D</option>
                        <option value="E">Block E</option>
                      </select>
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="role-form-group">
                    <label htmlFor="roomNumber" className="role-label">
                      <span className="label-icon">🚪</span>
                      Room Number
                    </label>
                    <div className="role-input-wrapper">
                      <input 
                        type="text" 
                        id="roomNumber"
                        name="roomNumber"
                        placeholder="201" 
                        className="role-input"
                        value={formData.roomNumber}
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
                    className="step-btn next-btn student-btn"
                    onClick={() => setCurrentStep(3)}
                  >
                    <span>Next Step</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Security */}
              <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
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
                    onClick={() => setCurrentStep(2)}
                  >
                    <span className="btn-arrow">←</span>
                    <span>Back</span>
                  </button>
                  <button 
                    className={`role-submit-btn student-btn ${loading ? 'loading' : ''}`}
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="btn-spinner"></span>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🎉</span>
                        <span>Create Account</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="signup-section">
              <p>Already have a student account?</p>
              <Link to="/student/login" className="signup-link student-signup">
                <span>🚀</span>
                <span>Login as Student</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="section-divider">
              <span>Join as Different Role</span>
            </div>

            {/* Other Roles */}
            <div className="other-roles-grid">
              <Link to="/restaurant/signup" className="other-role-card restaurant-card">
                <div className="other-role-icon">🏪</div>
                <div className="other-role-text">
                  <span className="other-role-name">Restaurant</span>
                  <span className="other-role-desc">Register business</span>
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

export default StudentSignup;
