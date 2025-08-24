require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');

connectDB();

const testAdminLogin = async () => {
  try {
    console.log('🔍 Testing admin login process...');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@unieats.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      process.exit(1);
    }
    
    console.log('✅ Admin user found:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      isVerified: admin.isVerified
    });
    
    // Test password comparison
    const testPassword = 'password123';
    const isMatch = await admin.matchPassword(testPassword);
    console.log('🔐 Password verification:', isMatch ? '✅ CORRECT' : '❌ INCORRECT');
    
    if (!isMatch) {
      console.log('🔧 Fixing admin password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      await User.findByIdAndUpdate(admin._id, {
        password: hashedPassword
      });
      
      console.log('✅ Admin password updated');
      
      // Test again
      const updatedAdmin = await User.findOne({ email: 'admin@unieats.com' }).select('+password');
      const isMatchAfterUpdate = await updatedAdmin.matchPassword(testPassword);
      console.log('🔐 Password verification after update:', isMatchAfterUpdate ? '✅ CORRECT' : '❌ INCORRECT');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAdminLogin();
