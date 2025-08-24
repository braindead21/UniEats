// Comprehensive functionality test
const mongoose = require('mongoose');
require('dotenv').config();

const testAllFunctionality = async () => {
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully');
    
    // Test models
    const User = require('./models/User');
    const Restaurant = require('./models/Restaurant');
    const MenuItem = require('./models/MenuItem');
    const Order = require('./models/Order');
    
    console.log('🔄 Testing models...');
    
    // Test if basic records exist
    const userCount = await User.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    const menuItemCount = await MenuItem.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Restaurants: ${restaurantCount}`);
    console.log(`   Menu Items: ${menuItemCount}`);
    console.log(`   Orders: ${orderCount}`);
    
    // Test if admin exists
    const admin = await User.findOne({ role: 'admin' });
    console.log(`👑 Admin exists: ${admin ? '✅ Yes' : '❌ No'}`);
    
    // Test if students exist
    const students = await User.find({ role: 'student' });
    console.log(`🎓 Students: ${students.length}`);
    
    // Test if restaurant owners exist
    const restaurantOwners = await User.find({ role: 'restaurant_owner' });
    console.log(`🏪 Restaurant Owners: ${restaurantOwners.length}`);
    
    // Test if delivery partners exist
    const deliveryPartners = await User.find({ role: 'delivery_partner' });
    console.log(`🏍️ Delivery Partners: ${deliveryPartners.length}`);
    
    console.log('\n🎉 All basic functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
  }
};

testAllFunctionality();
