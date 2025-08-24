require('dotenv').config();
require('colors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route files
const authRoutes = require('./routes/auth');
const partnerRoutes = require('./routes/partner');
const restaurantRoutes = require('./routes/restaurants');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const restaurantOwnerRoutes = require('./routes/restaurantOwner');
const deliveryPartnerRoutes = require('./routes/deliveryPartner');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurant-owner', restaurantOwnerRoutes);
app.use('/api/deliveryPartner', deliveryPartnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);

// Home route (should be the only accessible root route)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the UniEats API!',
    version: '1.0.0',
    status: 'Connected to database'
  });
});

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
}); 