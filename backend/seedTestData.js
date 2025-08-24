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

    // Create Restaurants
    const restaurants = await Restaurant.create([
      {
        name: 'Spice Garden',
        email: 'contact@spicegarden.com',
        phone: '+91 98765 43213',
        address: '123 Food Street, Mumbai',
        cuisine: ['Indian', 'North Indian'],
        description: 'Authentic Indian cuisine with aromatic spices',
        rating: 4.5,
        image: '/restaurant-placeholder.jpg',
        isActive: true,
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        }
      },
      {
        name: 'Pizza Corner',
        email: 'contact@pizzacorner.com',
        phone: '+91 98765 43214',
        address: '456 Italian Lane, Mumbai',
        cuisine: ['Italian', 'Fast Food'],
        description: 'Delicious pizzas and Italian favorites',
        rating: 4.2,
        image: '/restaurant-placeholder.jpg',
        isActive: true,
        location: {
          type: 'Point',
          coordinates: [72.8877, 19.0860]
        }
      }
    ]);
    console.log('🏪 Restaurants created');

    // Create Restaurant Owners
    const restaurantOwners = await User.create([
      {
        name: 'Raj Patel',
        email: 'raj@spicegarden.com',
        password: hashedPassword,
        role: 'restaurant_owner',
        phone: '+91 98765 43215',
        isVerified: true,
        isActive: true,
        restaurantInfo: {
          restaurantId: restaurants[0]._id,
          businessLicense: 'BL123456',
          fssaiNumber: 'FSSAI123456'
        }
      },
      {
        name: 'Maria Rossi',
        email: 'maria@pizzacorner.com',
        password: hashedPassword,
        role: 'restaurant_owner',
        phone: '+91 98765 43216',
        isVerified: true,
        isActive: true,
        restaurantInfo: {
          restaurantId: restaurants[1]._id,
          businessLicense: 'BL654321',
          fssaiNumber: 'FSSAI654321'
        }
      }
    ]);
    console.log('👨‍🍳 Restaurant owners created');

    // Create Delivery Partners
    const deliveryPartners = await User.create([
      {
        name: 'Arjun Kumar',
        email: 'arjun@delivery.com',
        password: hashedPassword,
        role: 'delivery_partner',
        phone: '+91 98765 43217',
        collegeId: 'DEL001',
        isVerified: true,
        isActive: true,
        deliveryPartnerInfo: {
          vehicleType: 'Motorcycle',
          vehicleNumber: 'MH12AB1234',
          licenseNumber: 'DL123456789',
          aadharNumber: '123456789012',
          address: '789 Delivery Street, Mumbai',
          emergencyContact: 'Raj Kumar',
          emergencyPhone: '+91 98765 43218',
          isAvailable: true
        }
      },
      {
        name: 'Priya Sharma',
        email: 'priya@delivery.com',
        password: hashedPassword,
        role: 'delivery_partner',
        phone: '+91 98765 43219',
        collegeId: 'DEL002',
        isVerified: true,
        isActive: true,
        deliveryPartnerInfo: {
          vehicleType: 'Scooter',
          vehicleNumber: 'MH12CD5678',
          licenseNumber: 'DL987654321',
          aadharNumber: '987654321098',
          address: '101 Rider Road, Mumbai',
          emergencyContact: 'Sita Sharma',
          emergencyPhone: '+91 98765 43220',
          isAvailable: true
        }
      }
    ]);
    console.log('🏍️ Delivery partners created');

    // Create Menu Items
    const menuItems = await MenuItem.create([
      // Spice Garden Menu
      {
        name: 'Butter Chicken',
        description: 'Creamy tomato-based chicken curry with aromatic spices',
        price: 320,
        category: 'Main Course',
        restaurant: restaurants[0]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: false,
        spiceLevel: 'Medium'
      },
      {
        name: 'Paneer Makhani',
        description: 'Rich and creamy cottage cheese curry',
        price: 280,
        category: 'Main Course',
        restaurant: restaurants[0]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: true,
        spiceLevel: 'Medium'
      },
      {
        name: 'Garlic Naan',
        description: 'Fresh baked bread with garlic and butter',
        price: 45,
        category: 'Bread',
        restaurant: restaurants[0]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: true,
        spiceLevel: 'None'
      },
      {
        name: 'Biryani',
        description: 'Aromatic basmati rice with spices and vegetables',
        price: 250,
        category: 'Rice',
        restaurant: restaurants[0]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: true,
        spiceLevel: 'Mild'
      },
      // Pizza Corner Menu
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 299,
        category: 'Pizza',
        restaurant: restaurants[1]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: true,
        spiceLevel: 'None'
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Pizza with spicy pepperoni and mozzarella cheese',
        price: 399,
        category: 'Pizza',
        restaurant: restaurants[1]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: false,
        spiceLevel: 'Mild'
      },
      {
        name: 'Pasta Arrabiata',
        description: 'Penne pasta in spicy tomato sauce',
        price: 249,
        category: 'Pasta',
        restaurant: restaurants[1]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: true,
        spiceLevel: 'Medium'
      },
      {
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter and herbs',
        price: 99,
        category: 'Appetizer',
        restaurant: restaurants[1]._id,
        image: '/food-placeholder.jpg',
        isAvailable: true,
        isVeg: true,
        spiceLevel: 'None'
      }
    ]);
    console.log('🍽️ Menu items created');

    // Create Sample Orders
    const orders = await Order.create([
      {
        orderNumber: 'ORD001',
        user: students[0]._id,
        restaurant: restaurants[0]._id,
        items: [
          {
            menuItem: menuItems[0]._id,
            name: menuItems[0].name,
            quantity: 2,
            price: menuItems[0].price
          },
          {
            menuItem: menuItems[2]._id,
            name: menuItems[2].name,
            quantity: 3,
            price: menuItems[2].price
          }
        ],
        pricing: {
          subtotal: (320 * 2) + (45 * 3),
          deliveryFee: 40,
          platformFee: 20,
          tax: 42,
          total: 777
        },
        deliveryAddress: {
          name: 'John Doe',
          phone: '+91 98765 43211',
          street: '123 College Street, Room 201',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        paymentMethod: 'cod',
        status: 'pending',
        createdAt: new Date(),
        tracking: {}
      },
      {
        orderNumber: 'ORD002',
        user: students[1]._id,
        restaurant: restaurants[1]._id,
        items: [
          {
            menuItem: menuItems[4]._id,
            name: menuItems[4].name,
            quantity: 1,
            price: menuItems[4].price
          },
          {
            menuItem: menuItems[7]._id,
            name: menuItems[7].name,
            quantity: 1,
            price: menuItems[7].price
          }
        ],
        pricing: {
          subtotal: 299 + 99,
          deliveryFee: 40,
          platformFee: 20,
          tax: 23,
          total: 481
        },
        deliveryAddress: {
          name: 'Jane Smith',
          phone: '+91 98765 43212',
          street: '456 Campus Road, Hostel B',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002'
        },
        paymentMethod: 'card',
        status: 'confirmed',
        deliveryPartner: deliveryPartners[0]._id,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        tracking: {
          confirmed: new Date(Date.now() - 1500000)
        }
      },
      {
        orderNumber: 'ORD003',
        user: students[0]._id,
        restaurant: restaurants[0]._id,
        items: [
          {
            menuItem: menuItems[3]._id,
            name: menuItems[3].name,
            quantity: 1,
            price: menuItems[3].price
          }
        ],
        pricing: {
          subtotal: 250,
          deliveryFee: 40,
          platformFee: 20,
          tax: 16,
          total: 326
        },
        deliveryAddress: {
          name: 'John Doe',
          phone: '+91 98765 43211',
          street: '123 College Street, Room 201',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        },
        paymentMethod: 'upi',
        status: 'delivered',
        deliveryPartner: deliveryPartners[1]._id,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        tracking: {
          confirmed: new Date(Date.now() - 6900000),
          preparing: new Date(Date.now() - 6600000),
          readyForPickup: new Date(Date.now() - 6300000),
          pickedUp: new Date(Date.now() - 6000000),
          outForDelivery: new Date(Date.now() - 5400000),
          delivered: new Date(Date.now() - 4800000)
        }
      }
    ]);
    console.log('📦 Sample orders created');

    console.log('✅ Data seeding completed successfully!');
    console.log(`
📊 Summary:
- 1 Admin user
- 2 Students
- 2 Restaurant owners
- 2 Delivery partners
- 2 Restaurants
- 8 Menu items
- 3 Sample orders

🔑 Login credentials (password: password123):
- Admin: admin@unieats.com
- Student: john@student.com, jane@student.com
- Restaurant Owner: raj@spicegarden.com, maria@pizzacorner.com
- Delivery Partner: arjun@delivery.com, priya@delivery.com
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();
