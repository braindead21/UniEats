const express = require('express');
const router = express.Router();

// List all restaurants
router.get('/', (req, res) => {
  res.json({ message: 'List all restaurants (not implemented yet)' });
});

// Add a restaurant (admin)
router.post('/', (req, res) => {
  res.json({ message: 'Add restaurant endpoint (not implemented yet)' });
});

module.exports = router; 