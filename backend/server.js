require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const partnerRoutes = require('./routes/partner');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Home route (should be the only accessible root route)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the UniEats API!' });
});

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 