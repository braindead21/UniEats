const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');

// List all menu items with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, restaurant, search, available } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (restaurant) {
      filter.restaurant = restaurant;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    // Get menu items with restaurant info
    const menuItems = await MenuItem.find(filter)
      .populate('restaurant', 'name cuisine rating image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: menuItems.length,
      menu: menuItems
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
});

// Get menu items for a specific restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category, available } = req.query;

    // Build filter
    const filter = { restaurant: restaurantId };
    
    if (category) {
      filter.category = category;
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    // Get menu items
    const menuItems = await MenuItem.find(filter)
      .populate('restaurant', 'name cuisine rating image')
      .sort({ category: 1, name: 1 });

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      restaurant: restaurant,
      count: menuItems.length,
      menu: menuItems
    });

  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant menu',
      error: error.message
    });
  }
});

// Get single menu item
router.get('/:itemId', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId)
      .populate('restaurant', 'name cuisine rating image address');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      menuItem
    });

  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
});

// Add a menu item (restaurant owner or admin)
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurant,
      image,
      ingredients,
      allergens,
      nutritionInfo,
      variants,
      customizations,
      preparationTime,
      spiceLevel,
      isVeg,
      isVegan,
      available
    } = req.body;

    // Verify user can add menu items to this restaurant
    if (req.user.role !== 'admin') {
      const restaurantDoc = await Restaurant.findById(restaurant);
      if (!restaurantDoc || restaurantDoc.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only add menu items to your own restaurant.'
        });
      }
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      restaurant,
      image,
      ingredients,
      allergens,
      nutritionInfo,
      variants,
      customizations,
      preparationTime,
      spiceLevel,
      isVeg,
      isVegan,
      available
    });

    // Populate restaurant info
    await menuItem.populate('restaurant', 'name cuisine rating image');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      menuItem
    });

  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
});

// Update menu item (restaurant owner or admin)
router.put('/:itemId', protect, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Verify user can update this menu item
    if (req.user.role !== 'admin' && menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update menu item
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true, runValidators: true }
    ).populate('restaurant', 'name cuisine rating image');

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
});

// Delete menu item (restaurant owner or admin)
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Verify user can delete this menu item
    if (req.user.role !== 'admin' && menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await MenuItem.findByIdAndDelete(req.params.itemId);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
});

// Toggle menu item availability (restaurant owner or admin)
router.patch('/:itemId/availability', protect, async (req, res) => {
  try {
    const { available } = req.body;
    
    const menuItem = await MenuItem.findById(req.params.itemId).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Verify user can update this menu item
    if (req.user.role !== 'admin' && menuItem.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    menuItem.available = available;
    await menuItem.save();

    res.json({
      success: true,
      message: `Menu item ${available ? 'enabled' : 'disabled'} successfully`,
      menuItem
    });

  } catch (error) {
    console.error('Error updating menu item availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu item availability',
      error: error.message
    });
  }
});

module.exports = router; 