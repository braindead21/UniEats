const express = require('express');
const router = express.Router();

// List all menu items
router.get('/', (req, res) => {
  res.json({ message: 'List all menu items (not implemented yet)' });
});

// Add a menu item (admin)
router.post('/', (req, res) => {
  res.json({ message: 'Add menu item endpoint (not implemented yet)' });
});

module.exports = router; 