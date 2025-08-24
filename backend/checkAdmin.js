require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');

connectDB();

const checkAdmin = async () => {
  try {
    console.log('🔍 Checking admin user...');
    
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
      isVerified: admin.isVerified,
      hasPassword: !!admin.password,
      passwordLength: admin.password ? admin.password.length : 0
    });
    
    // Test password comparison
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('🔐 Password test result:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    // Test the matchPassword method
    const isMatchMethod = await admin.matchPassword(testPassword);
    console.log('🔐 matchPassword method result:', isMatchMethod ? '✅ MATCH' : '❌ NO MATCH');
    
    // Test if password was correctly hashed during seeding
    const salt = await bcrypt.genSalt(10);
    const expectedHash = await bcrypt.hash(testPassword, salt);
    console.log('🔐 Password hash comparison:', {
      storedHash: admin.password.substring(0, 20) + '...',
      expectedHashStart: expectedHash.substring(0, 20) + '...',
      bothStartWith$2a: admin.password.startsWith('$2a$') && expectedHash.startsWith('$2a$')
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error);
    process.exit(1);
  }
};

checkAdmin();
