const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Category = require('./models/Category');
const User = require('./models/User');
require('dotenv').config();

const sampleData = {
  categories: [
    { name: 'Fast Food', description: 'Quick and delicious fast food options', type: 'cuisine' },
    { name: 'Indian', description: 'Authentic Indian cuisine', type: 'cuisine' },
    { name: 'Chinese', description: 'Traditional Chinese dishes', type: 'cuisine' },
    { name: 'Italian', description: 'Italian pasta and pizza', type: 'cuisine' },
    { name: 'Cafe', description: 'Coffee and light snacks', type: 'cuisine' },
    { name: 'Burgers', description: 'All types of burgers', type: 'food' },
    { name: 'Pizzas', description: 'Various pizza options', type: 'food' },
    { name: 'Biryani', description: 'Rice dishes with spices', type: 'food' },
    { name: 'Noodles', description: 'Asian noodle dishes', type: 'food' },
    { name: 'Beverages', description: 'Drinks and beverages', type: 'food' },
    { name: 'Snacks', description: 'Light snacks and appetizers', type: 'food' },
    { name: 'Appetizers', description: 'Starters and small plates', type: 'food' }
  ],
  restaurants: [
    {
      name: 'Burger Palace',
      description: 'Home of the best burgers on campus',
      cuisine: 'Fast Food',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '123 Campus Road',
        city: 'University Town',
        state: 'State',
        zipCode: '12345',
        coordinates: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749]
        }
      },
      contact: {
        phone: '+1234567890',
        email: 'orders@burgerpalace.com'
      },
      operatingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '21:00' }
      }
    },
    {
      name: 'Spice Villa',
      description: 'Authentic Indian flavors and aromatic spices',
      cuisine: 'Indian',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '456 University Ave',
        city: 'University Town',
        state: 'State',
        zipCode: '12345',
        coordinates: {
          type: 'Point',
          coordinates: [-122.4294, 37.7849]
        }
      },
      contact: {
        phone: '+1234567891',
        email: 'orders@spicevilla.com'
      },
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '11:00', close: '21:00' }
      }
    },
    {
      name: 'Dragon Express',
      description: 'Fast Chinese food delivery with authentic flavors',
      cuisine: 'Chinese',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '789 Student Plaza',
        city: 'University Town',
        state: 'State',
        zipCode: '12345',
        coordinates: {
          type: 'Point',
          coordinates: [-122.4394, 37.7949]
        }
      },
      contact: {
        phone: '+1234567892',
        email: 'orders@dragonexpress.com'
      },
      operatingHours: {
        monday: { open: '10:00', close: '21:00' },
        tuesday: { open: '10:00', close: '21:00' },
        wednesday: { open: '10:00', close: '21:00' },
        thursday: { open: '10:00', close: '21:00' },
        friday: { open: '10:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '11:00', close: '20:00' }
      }
    },
    {
      name: 'Pasta House',
      description: 'Italian pasta and pizza specialties with fresh ingredients',
      cuisine: 'Italian',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '321 College Street',
        city: 'University Town',
        state: 'State',
        zipCode: '12345',
        coordinates: {
          type: 'Point',
          coordinates: [-122.4494, 37.8049]
        }
      },
      contact: {
        phone: '+1234567893',
        email: 'orders@pastahouse.com'
      },
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      }
    },
    {
      name: 'Campus Café',
      description: 'Coffee, snacks, and light meals for students',
      cuisine: 'Cafe',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      address: {
        street: '654 Library Lane',
        city: 'University Town',
        state: 'State',
        zipCode: '12345',
        coordinates: {
          type: 'Point',
          coordinates: [-122.4594, 37.8149]
        }
      },
      contact: {
        phone: '+1234567894',
        email: 'orders@campuscafe.com'
      },
      operatingHours: {
        monday: { open: '07:00', close: '20:00' },
        tuesday: { open: '07:00', close: '20:00' },
        wednesday: { open: '07:00', close: '20:00' },
        thursday: { open: '07:00', close: '20:00' },
        friday: { open: '07:00', close: '21:00' },
        saturday: { open: '08:00', close: '21:00' },
        sunday: { open: '08:00', close: '19:00' }
      }
    }
  ]
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    // Don't clear users as we need them for authentication
    console.log('Cleared existing data');

    // Create a sample restaurant owner if not exists
    let restaurantOwner = await User.findOne({ email: 'owner@burgerpalace.com' });
    if (!restaurantOwner) {
      restaurantOwner = await User.create({
        name: 'Restaurant Owner',
        email: 'owner@burgerpalace.com',
        password: 'password123',
        role: 'restaurant_owner',
        phone: '+1234567890',
        collegeId: 'OWNER001', // Restaurant owners may need collegeId for campus registration
        isVerified: true
      });
      console.log('Created sample restaurant owner');
    } else {
      console.log('Using existing restaurant owner');
    }

    // Create categories
    const createdCategories = await Category.insertMany(sampleData.categories);
    console.log('Created categories:', createdCategories.length);

    // Update restaurant data with required fields
    const restaurantsWithOwner = sampleData.restaurants.map(restaurant => ({
      ...restaurant,
      owner: restaurantOwner._id,
      phone: restaurant.contact.phone,
      email: restaurant.contact.email,
      cuisine: [restaurant.cuisine],
      licenseNumber: 'LIC' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      licenseDocument: 'https://example.com/license-document.pdf',
      images: [{
        url: restaurant.image,
        alt: restaurant.name + ' image'
      }],
      isActive: true,
      isApproved: true
    }));

    // Remove the contact field and image field as they're restructured
    restaurantsWithOwner.forEach(restaurant => {
      delete restaurant.contact;
      delete restaurant.image;
    });

    // Create restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurantsWithOwner);
    console.log('Created restaurants:', createdRestaurants.length);

    // Create sample menu items for each restaurant
    const menuItems = [];
    for (const restaurant of createdRestaurants) {
      let items = [];
      
      if (restaurant.cuisine.includes('Fast Food')) {
        items = [
          {
            name: 'Classic Cheeseburger',
            description: 'Juicy beef patty with cheese, lettuce, tomato, and our special sauce',
            price: 129,
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
            category: 'Burgers',
            restaurant: restaurant._id,
            isVegetarian: false,
            isVegan: false,
            isAvailable: true
          },
          {
            name: 'Veggie Burger',
            description: 'Plant-based patty with fresh vegetables and vegan mayo',
            price: 119,
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
            category: 'Burgers',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: true,
            isAvailable: true
          },
          {
            name: 'French Fries',
            description: 'Crispy golden fries with sea salt',
            price: 49,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
            category: 'Snacks',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: true,
            isAvailable: true
          }
        ];
      } else if (restaurant.cuisine.includes('Indian')) {
        items = [
          {
            name: 'Paneer Tikka',
            description: 'Grilled cottage cheese with aromatic spices',
            price: 99,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
            category: 'Appetizers',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: false,
            isAvailable: true
          },
          {
            name: 'Chicken Biryani',
            description: 'Fragrant basmati rice with tender chicken and spices',
            price: 159,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
            category: 'Biryani',
            restaurant: restaurant._id,
            isVegetarian: false,
            isVegan: false,
            isAvailable: true
          }
        ];
      } else if (restaurant.cuisine.includes('Chinese')) {
        items = [
          {
            name: 'Veg Hakka Noodles',
            description: 'Stir-fried noodles with fresh vegetables',
            price: 89,
            image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
            category: 'Chinese',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: true,
            isAvailable: true
          }
        ];
      } else if (restaurant.cuisine.includes('Italian')) {
        items = [
          {
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 149,
            image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
            category: 'Pizzas',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: false,
            isAvailable: true
          },
          {
            name: 'Farmhouse Pizza',
            description: 'Pizza loaded with fresh vegetables and herbs',
            price: 179,
            image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
            category: 'Pizzas',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: false,
            isAvailable: true
          }
        ];
      } else if (restaurant.cuisine.includes('Cafe')) {
        items = [
          {
            name: 'Café Mocha',
            description: 'Rich coffee with chocolate and steamed milk',
            price: 59,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
            category: 'Beverages',
            restaurant: restaurant._id,
            isVegetarian: true,
            isVegan: false,
            isAvailable: true
          }
        ];
      }
      
      menuItems.push(...items);
    }

    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log('Created menu items:', createdMenuItems.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
