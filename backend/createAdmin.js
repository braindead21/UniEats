require('dotenv').config();
require('colors');
const connectDB = require('./config/database');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@university.edu' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      isVerified: true,
      isActive: true
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    console.log('\nYou can now login using these credentials.');
    console.log('IMPORTANT: Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
