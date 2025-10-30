require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');

// Models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

connectDB();

const seedMultipleRestaurants = async () => {
  try {
    console.log('🌱 Starting multiple restaurants seeding...');

    // Don't clear users, just restaurants and menu items
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🗑️ Cleared existing restaurants and menu items');

    const plainPassword = 'password123';

    // Create multiple restaurant owners and their restaurants
    const restaurantsData = [
      {
        ownerName: 'Spice Garden Owner',
        ownerEmail: 'owner1@restaurant.com',
        restaurantName: 'Spice Garden',
        description: 'Authentic Indian cuisine with traditional flavors and aromatic biryani',
        cuisine: ['Indian', 'North Indian'],
        rating: 4.8,
        totalReviews: 245,
        deliveryTime: '25-30 min',
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
        tag: '🔥 Trending',
        offers: '50% OFF',
        menuItems: [
          {
            name: 'Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken and traditional spices',
            price: 249,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Medium',
            preparationTime: 25,
            badge: '🔥 Bestseller'
          },
          {
            name: 'Paneer Tikka',
            description: 'Grilled cottage cheese marinated with aromatic spices',
            price: 229,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Medium',
            preparationTime: 20,
            badge: '🌱 Veg Special'
          },
          {
            name: 'Masala Dosa',
            description: 'Crispy dosa filled with spiced potato filling',
            price: 129,
            category: 'South Indian',
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 15,
            badge: '💰 Budget'
          },
          {
            name: 'Butter Chicken',
            description: 'Creamy tomato-based chicken curry with rich flavors',
            price: 320,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Medium',
            preparationTime: 30,
            badge: '⭐ Popular'
          }
        ]
      },
      {
        ownerName: 'Dragon Wok Owner',
        ownerEmail: 'owner2@restaurant.com',
        restaurantName: 'Dragon Wok',
        description: 'Authentic Chinese and Asian cuisine with fresh ingredients',
        cuisine: ['Chinese', 'Thai'],
        rating: 4.6,
        totalReviews: 189,
        deliveryTime: '30-35 min',
        distance: '2.1 km',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
        tag: '⚡ Fast Delivery',
        offers: 'Free Delivery',
        menuItems: [
          {
            name: 'Chicken Hakka Noodles',
            description: 'Stir-fried noodles with vegetables and savory sauces',
            price: 199,
            category: 'Chinese',
            image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Medium',
            preparationTime: 20,
            badge: '⚡ Quick'
          },
          {
            name: 'Veg Fried Rice',
            description: 'Classic fried rice with mixed vegetables',
            price: 159,
            category: 'Chinese',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 15,
            badge: '🌱 Veg'
          },
          {
            name: 'Manchurian Dry',
            description: 'Crispy vegetable balls in spicy Manchurian sauce',
            price: 179,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Hot',
            preparationTime: 20,
            badge: '🔥 Spicy'
          }
        ]
      },
      {
        ownerName: 'Pizza Paradise Owner',
        ownerEmail: 'owner3@restaurant.com',
        restaurantName: 'Pizza Paradise',
        description: 'Delicious Italian pizzas and pasta with authentic flavors',
        cuisine: ['Italian', 'Fast Food'],
        rating: 4.7,
        totalReviews: 312,
        deliveryTime: '20-25 min',
        distance: '0.8 km',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        tag: '⭐ Popular',
        offers: 'Buy 1 Get 1',
        menuItems: [
          {
            name: 'Margherita Pizza',
            description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
            price: 299,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 20,
            badge: '⭐ Popular'
          },
          {
            name: 'Pasta Alfredo',
            description: 'Creamy white sauce pasta with herbs',
            price: 269,
            category: 'Continental',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 18,
            badge: '🧀 Creamy'
          },
          {
            name: 'Pepperoni Pizza',
            description: 'Classic pepperoni pizza with extra cheese',
            price: 349,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Mild',
            preparationTime: 22,
            badge: '🔥 Bestseller'
          }
        ]
      },
      {
        ownerName: 'Burger Hub Owner',
        ownerEmail: 'owner4@restaurant.com',
        restaurantName: 'Burger Hub',
        description: 'Juicy burgers and fast food favorites',
        cuisine: ['Fast Food', 'Continental'],
        rating: 4.5,
        totalReviews: 278,
        deliveryTime: '15-20 min',
        distance: '1.5 km',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        tag: '💰 Budget Friendly',
        offers: '30% OFF',
        menuItems: [
          {
            name: 'Classic Burger',
            description: 'Juicy beef patty with cheese, lettuce, and special sauce',
            price: 159,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Mild',
            preparationTime: 12,
            badge: '💰 Value'
          },
          {
            name: 'Veg Burger',
            description: 'Crispy vegetable patty with fresh veggies',
            price: 129,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 10,
            badge: '🌱 Veg'
          },
          {
            name: 'French Fries',
            description: 'Crispy golden fries with seasoning',
            price: 89,
            category: 'Snacks',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 8,
            badge: '⚡ Quick'
          }
        ]
      },
      {
        ownerName: 'Sushi Station Owner',
        ownerEmail: 'owner5@restaurant.com',
        restaurantName: 'Sushi Station',
        description: 'Premium Japanese sushi and authentic Asian cuisine',
        cuisine: ['Japanese', 'Thai'],
        rating: 4.9,
        totalReviews: 156,
        deliveryTime: '35-40 min',
        distance: '3.2 km',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        tag: '⭐ Premium',
        offers: '20% OFF',
        menuItems: [
          {
            name: 'California Roll',
            description: 'Fresh sushi roll with avocado, cucumber, and crab',
            price: 349,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Mild',
            preparationTime: 25,
            badge: '⭐ Premium'
          },
          {
            name: 'Veg Sushi Platter',
            description: 'Assorted vegetarian sushi rolls',
            price: 299,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 20,
            badge: '🌱 Veg Special'
          }
        ]
      },
      {
        ownerName: 'Taco Fiesta Owner',
        ownerEmail: 'owner6@restaurant.com',
        restaurantName: 'Taco Fiesta',
        description: 'Authentic Mexican tacos and flavorful dishes',
        cuisine: ['Mexican', 'Fast Food'],
        rating: 4.4,
        totalReviews: 167,
        deliveryTime: '25-30 min',
        distance: '1.8 km',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        tag: '🌮 New',
        offers: 'Free Nachos',
        menuItems: [
          {
            name: 'Chicken Tacos',
            description: 'Soft tacos filled with grilled chicken and fresh toppings',
            price: 189,
            category: 'Snacks',
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop',
            isVegetarian: false,
            spiceLevel: 'Medium',
            preparationTime: 15,
            badge: '🌮 Spicy'
          },
          {
            name: 'Veg Burrito',
            description: 'Large tortilla wrap with beans, rice, and vegetables',
            price: 179,
            category: 'Snacks',
            image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Mild',
            preparationTime: 18,
            badge: '🌱 Veg'
          },
          {
            name: 'Nachos Supreme',
            description: 'Crispy nachos with cheese, salsa, and toppings',
            price: 149,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=400&fit=crop',
            isVegetarian: true,
            spiceLevel: 'Medium',
            preparationTime: 10,
            badge: '⚡ Quick'
          }
        ]
      }
    ];

    // Create restaurants and their menu items
    for (const restaurantData of restaurantsData) {
      // Check if owner exists, if not create one
      let owner = await User.findOne({ email: restaurantData.ownerEmail });
      
      if (!owner) {
        owner = await User.create({
          name: restaurantData.ownerName,
          email: restaurantData.ownerEmail,
          password: plainPassword,
          role: 'restaurant_owner',
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          isVerified: true,
          isActive: true,
          restaurantInfo: {
            businessName: restaurantData.restaurantName,
            ownerName: restaurantData.ownerName,
            licenseNumber: `LIC${Math.floor(Math.random() * 10000)}`,
            gstNumber: `GST${Math.floor(Math.random() * 10000)}`
          }
        });
        console.log(`👤 Created owner: ${restaurantData.ownerName}`);
      }

      // Create restaurant
      const restaurant = await Restaurant.create({
        name: restaurantData.restaurantName,
        description: restaurantData.description,
        cuisine: restaurantData.cuisine,
        owner: owner._id,
        images: [{ url: restaurantData.image, alt: restaurantData.restaurantName }],
        address: {
          street: `${Math.floor(Math.random() * 999) + 1} Campus Road`,
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          coordinates: {
            type: 'Point',
            coordinates: [72.8777 + (Math.random() * 0.1 - 0.05), 19.0760 + (Math.random() * 0.1 - 0.05)]
          }
        },
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `contact@${restaurantData.restaurantName.toLowerCase().replace(/\s+/g, '')}.com`,
        operatingHours: {
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '09:00', close: '23:00' },
          sunday: { open: '09:00', close: '23:00' }
        },
        isActive: true,
        isApproved: true,
        rating: restaurantData.rating,
        totalReviews: restaurantData.totalReviews,
        estimatedDeliveryTime: parseInt(restaurantData.deliveryTime)
      });
      console.log(`🏪 Created restaurant: ${restaurantData.restaurantName}`);

      // Update owner with restaurant ID
      await User.findByIdAndUpdate(owner._id, {
        'restaurantInfo.restaurantId': restaurant._id
      });

      // Create menu items for this restaurant
      const menuItemsToCreate = restaurantData.menuItems.map(item => ({
        ...item,
        images: item.image ? [{ url: item.image, alt: item.name }] : [],
        restaurant: restaurant._id,
        isAvailable: true,
        ingredients: ['Fresh ingredients'],
        allergens: []
      }));

      await MenuItem.create(menuItemsToCreate);
      console.log(`🍽️ Created ${menuItemsToCreate.length} menu items for ${restaurantData.restaurantName}`);
    }

    console.log('\n✅ Multiple restaurants seeded successfully!');
    console.log(`📊 Total restaurants: ${restaurantsData.length}`);
    console.log('\n📝 Test credentials:');
    restaurantsData.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.ownerEmail} / password123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedMultipleRestaurants();

