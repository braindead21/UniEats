require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');

// Models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

connectDB();

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@unieats.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      isVerified: true,
      isActive: true
    });
    console.log('👑 Admin created');

    // Create Restaurant Owner
    const restaurantOwner = await User.create({
      name: 'Restaurant Owner',
      email: 'owner@restaurant.com',
      password: hashedPassword,
      role: 'restaurant_owner',
      phone: '+91 98765 43220',
      isVerified: true,
      isActive: true,
      restaurantInfo: {
        businessName: 'Spice Paradise',
        ownerName: 'Restaurant Owner',
        licenseNumber: 'LIC001',
        gstNumber: 'GST001'
      }
    });
    console.log('🏪 Restaurant Owner created');

    // Create Delivery Partner
    const deliveryPartner = await User.create({
      name: 'Delivery Partner',
      email: 'delivery@partner.com',
      password: hashedPassword,
      role: 'delivery_partner',
      phone: '+91 98765 43230',
      collegeId: 'DEL001',
      isVerified: true,
      isActive: true,
      deliveryPartnerInfo: {
        vehicleType: 'motorcycle',
        vehicleNumber: 'MH12AB1234',
        licenseNumber: 'DL123456789',
        aadharNumber: '123456789012',
        address: '789 Delivery Street, Mumbai',
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '+91 98765 43240',
        isAvailable: true
      }
    });
    console.log('🏍️ Delivery Partner created');

    // Create Students
    const students = await User.create([
      {
        name: 'John Doe',
        email: 'john@student.com',
        password: hashedPassword,
        role: 'student',
        phone: '+91 98765 43211',
        collegeId: 'STU001',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.com',
        password: hashedPassword,
        role: 'student',
        phone: '+91 98765 43212',
        collegeId: 'STU002',
        isVerified: true,
        isActive: true
      }
    ]);
    console.log('🎓 Students created');

    // Create Restaurant
    const restaurant = await Restaurant.create({
      name: 'Spice Paradise',
      description: 'Authentic Indian cuisine with traditional flavors',
      cuisine: ['Indian', 'North Indian'],
      owner: restaurantOwner._id,
      images: [{ url: '/restaurant1.jpg', alt: 'Spice Paradise' }],
      address: {
        street: '123 Campus Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        coordinates: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        }
      },
      phone: '+91 98765 43213',
      email: 'contact@spiceparadise.com',
      operatingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '22:00' },
        saturday: { open: '09:00', close: '22:00' },
        sunday: { open: '09:00', close: '22:00' }
      },
      isActive: true,
      isApproved: true,
      rating: 4.3,
      totalReviews: 125
    });
    console.log('🏪 Restaurant created');

    // Update restaurant owner with restaurant ID
    await User.findByIdAndUpdate(restaurantOwner._id, {
      'restaurantInfo.restaurantId': restaurant._id
    });
    console.log('🔗 Restaurant linked to owner');

    // Create Menu Items
    const menuItems = await MenuItem.create([
      {
        name: 'Butter Chicken',
        description: 'Creamy tomato-based chicken curry',
        price: 320,
        category: 'Main Course',
        restaurant: restaurant._id,
        image: '/food1.jpg',
        isAvailable: true,
        ingredients: ['Chicken', 'Tomato', 'Cream', 'Spices'],
        preparationTime: 20,
        isVegetarian: false,
        spiceLevel: 'Medium'
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Rich and creamy paneer curry',
        price: 280,
        category: 'Main Course',
        restaurant: restaurant._id,
        image: '/food2.jpg',
        isAvailable: true,
        ingredients: ['Paneer', 'Tomato', 'Cream', 'Spices'],
        preparationTime: 15,
        isVegetarian: true,
        spiceLevel: 'Medium'
      },
      {
        name: 'Garlic Naan',
        description: 'Fresh baked bread with garlic',
        price: 45,
        category: 'North Indian',
        restaurant: restaurant._id,
        image: '/food3.jpg',
        isAvailable: true,
        ingredients: ['Flour', 'Garlic', 'Butter'],
        preparationTime: 10,
        isVegetarian: true,
        spiceLevel: 'Mild'
      },
      {
        name: 'Biryani',
        description: 'Aromatic basmati rice with spices',
        price: 350,
        category: 'Main Course',
        restaurant: restaurant._id,
        image: '/food4.jpg',
        isAvailable: true,
        ingredients: ['Basmati Rice', 'Chicken', 'Spices'],
        preparationTime: 30,
        isVegetarian: false,
        spiceLevel: 'Medium'
      }
    ]);
    console.log('🍽️ Menu items created');

    // Create Sample Orders
    const orders = await Order.create([
      {
        orderNumber: 'ORD001',
        user: students[0]._id,
        restaurant: restaurant._id,
        items: [
          {
            menuItem: menuItems[0]._id,
            name: menuItems[0].name,
            price: menuItems[0].price,
            quantity: 2,
            subtotal: 640
          },
          {
            menuItem: menuItems[2]._id,
            name: menuItems[2].name,
            price: menuItems[2].price,
            quantity: 3,
            subtotal: 135
          }
        ],
        pricing: {
          subtotal: 775,
          deliveryFee: 40,
          platformFee: 5,
          tax: 41,
          total: 861
        },
        deliveryAddress: {
          name: 'John Doe',
          phone: '+91 98765 43211',
          street: '123 College Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        status: 'pending',
        paymentInfo: {
          method: 'cod'
        },
        tracking: {}
      },
      {
        orderNumber: 'ORD002',
        user: students[1]._id,
        restaurant: restaurant._id,
        items: [
          {
            menuItem: menuItems[1]._id,
            name: menuItems[1].name,
            price: menuItems[1].price,
            quantity: 1,
            subtotal: 280
          },
          {
            menuItem: menuItems[2]._id,
            name: menuItems[2].name,
            price: menuItems[2].price,
            quantity: 2,
            subtotal: 90
          }
        ],
        pricing: {
          subtotal: 370,
          deliveryFee: 40,
          platformFee: 5,
          tax: 21,
          total: 436
        },
        deliveryAddress: {
          name: 'Jane Smith',
          phone: '+91 98765 43212',
          street: '456 Campus Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002'
        },
        status: 'confirmed',
        paymentInfo: {
          method: 'cod'
        },
        tracking: {
          confirmed: new Date()
        }
      },
      {
        orderNumber: 'ORD003',
        user: students[0]._id,
        restaurant: restaurant._id,
        items: [
          {
            menuItem: menuItems[3]._id,
            name: menuItems[3].name,
            price: menuItems[3].price,
            quantity: 1,
            subtotal: 350
          }
        ],
        pricing: {
          subtotal: 350,
          deliveryFee: 40,
          platformFee: 5,
          tax: 20,
          total: 415
        },
        deliveryAddress: {
          name: 'John Doe',
          phone: '+91 98765 43211',
          street: '123 College Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        status: 'ready_for_pickup',
        paymentInfo: {
          method: 'cod'
        },
        tracking: {
          confirmed: new Date(Date.now() - 1800000),
          preparing: new Date(Date.now() - 900000),
          readyForPickup: new Date()
        }
      }
    ]);
    console.log('📦 Sample orders created');

    console.log('✅ Data seeding completed successfully!');
    console.log('🔐 Default login credentials:');
    console.log('Admin: admin@unieats.com / password123');
    console.log('Restaurant Owner: owner@restaurant.com / password123');
    console.log('Delivery Partner: delivery@partner.com / password123');
    console.log('Student: john@student.com / password123');
    console.log('Student: jane@student.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
