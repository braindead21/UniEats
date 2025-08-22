const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validatePasswordUpdate,
  validateProfileUpdate,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validateProfileUpdate, handleValidationErrors, updateDetails);
router.put('/updatepassword', protect, validatePasswordUpdate, handleValidationErrors, updatePassword);

module.exports = router; 