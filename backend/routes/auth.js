const express = require('express');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint (not implemented yet)' });
});

// Login
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint (not implemented yet)' });
});

module.exports = router; 