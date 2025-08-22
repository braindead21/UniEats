const express = require('express');
const router = express.Router();

// Submit delivery partner application
router.post('/', (req, res) => {
  res.json({ message: 'Delivery partner application endpoint (not implemented yet)' });
});

// List all applications (admin)
router.get('/', (req, res) => {
  res.json({ message: 'List all delivery partner applications (not implemented yet)' });
});

module.exports = router; 