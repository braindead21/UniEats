const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Pincode serviceability data (can be expanded or moved to database)
const serviceablePincodes = {
  // Delhi NCR
  '110001': { city: 'New Delhi', state: 'Delhi', deliveryTime: 30 },
  '110002': { city: 'New Delhi', state: 'Delhi', deliveryTime: 30 },
  '110003': { city: 'New Delhi', state: 'Delhi', deliveryTime: 35 },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', deliveryTime: 40 },
  '201303': { city: 'Noida', state: 'Uttar Pradesh', deliveryTime: 40 },
  '122001': { city: 'Gurgaon', state: 'Haryana', deliveryTime: 45 },
  '122002': { city: 'Gurgaon', state: 'Haryana', deliveryTime: 45 },
  
  // Mumbai
  '400001': { city: 'Mumbai', state: 'Maharashtra', deliveryTime: 35 },
  '400002': { city: 'Mumbai', state: 'Maharashtra', deliveryTime: 35 },
  '400051': { city: 'Mumbai', state: 'Maharashtra', deliveryTime: 40 },
  
  // Bangalore
  '560001': { city: 'Bangalore', state: 'Karnataka', deliveryTime: 35 },
  '560002': { city: 'Bangalore', state: 'Karnataka', deliveryTime: 35 },
  '560038': { city: 'Bangalore', state: 'Karnataka', deliveryTime: 40 },
  
  // Pune
  '411001': { city: 'Pune', state: 'Maharashtra', deliveryTime: 35 },
  '411002': { city: 'Pune', state: 'Maharashtra', deliveryTime: 35 },
  
  // Hyderabad
  '500001': { city: 'Hyderabad', state: 'Telangana', deliveryTime: 35 },
  '500002': { city: 'Hyderabad', state: 'Telangana', deliveryTime: 35 },
  
  // Chennai
  '600001': { city: 'Chennai', state: 'Tamil Nadu', deliveryTime: 35 },
  '600002': { city: 'Chennai', state: 'Tamil Nadu', deliveryTime: 35 },
  
  // Kolkata
  '700001': { city: 'Kolkata', state: 'West Bengal', deliveryTime: 35 },
  '700002': { city: 'Kolkata', state: 'West Bengal', deliveryTime: 35 }
};

/**
 * @route   POST /api/address/validate
 * @desc    Validate delivery address
 * @access  Public
 */
router.post('/validate', async (req, res) => {
  try {
    const { pincode, restaurantId } = req.body;

    // Validate pincode format
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit pincode'
      });
    }

    // Check if pincode is serviceable
    const pincodeData = serviceablePincodes[pincode];
    if (!pincodeData) {
      return res.status(400).json({
        success: false,
        serviceable: false,
        message: 'Sorry, we do not deliver to this pincode yet'
      });
    }

    // If restaurant ID is provided, check restaurant-specific delivery zones
    if (restaurantId) {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found'
        });
      }

      // Check if restaurant delivers to this area
      // This is a simplified check - you can expand with actual delivery zones
      const restaurantDeliveryZones = restaurant.deliveryZones || [];
      if (restaurantDeliveryZones.length > 0 && !restaurantDeliveryZones.includes(pincode)) {
        return res.status(400).json({
          success: false,
          serviceable: false,
          message: `${restaurant.name} does not deliver to this location`
        });
      }
    }

    // Address is valid and serviceable
    res.json({
      success: true,
      serviceable: true,
      message: 'Delivery available at this location',
      data: {
        pincode,
        city: pincodeData.city,
        state: pincodeData.state,
        estimatedDeliveryTime: pincodeData.deliveryTime,
        estimatedDeliveryTimeRange: `${pincodeData.deliveryTime}-${pincodeData.deliveryTime + 15} mins`
      }
    });
  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate address',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/address/check-serviceability/:pincode
 * @desc    Quick check if pincode is serviceable
 * @access  Public
 */
router.get('/check-serviceability/:pincode', (req, res) => {
  try {
    const { pincode } = req.params;

    // Validate pincode format
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit pincode'
      });
    }

    const pincodeData = serviceablePincodes[pincode];
    
    res.json({
      success: true,
      serviceable: !!pincodeData,
      data: pincodeData || null
    });
  } catch (error) {
    console.error('Serviceability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check serviceability'
    });
  }
});

/**
 * @route   GET /api/address/serviceable-areas
 * @desc    Get all serviceable areas
 * @access  Public
 */
router.get('/serviceable-areas', (req, res) => {
  try {
    const areas = Object.entries(serviceablePincodes).map(([pincode, data]) => ({
      pincode,
      ...data
    }));

    // Group by city
    const groupedByCity = areas.reduce((acc, area) => {
      if (!acc[area.city]) {
        acc[area.city] = {
          city: area.city,
          state: area.state,
          pincodes: []
        };
      }
      acc[area.city].pincodes.push(area.pincode);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        areas,
        cities: Object.values(groupedByCity),
        totalPincodes: areas.length
      }
    });
  } catch (error) {
    console.error('Serviceable areas error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch serviceable areas'
    });
  }
});

/**
 * @route   GET /api/address/restaurant-delivery-zones/:restaurantId
 * @desc    Get delivery zones for a specific restaurant
 * @access  Public
 */
router.get('/restaurant-delivery-zones/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId).select('name deliveryZones deliveryRadius');
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get delivery zones or default to all serviceable pincodes
    const deliveryZones = restaurant.deliveryZones || Object.keys(serviceablePincodes);

    res.json({
      success: true,
      data: {
        restaurantId,
        restaurantName: restaurant.name,
        deliveryZones,
        deliveryRadius: restaurant.deliveryRadius || '5 km',
        totalZones: deliveryZones.length
      }
    });
  } catch (error) {
    console.error('Restaurant delivery zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant delivery zones'
    });
  }
});

/**
 * @route   POST /api/address/calculate-delivery-fee
 * @desc    Calculate delivery fee based on address
 * @access  Public
 */
router.post('/calculate-delivery-fee', async (req, res) => {
  try {
    const { pincode, restaurantId, orderValue } = req.body;

    // Validate pincode
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit pincode'
      });
    }

    const pincodeData = serviceablePincodes[pincode];
    if (!pincodeData) {
      return res.status(400).json({
        success: false,
        message: 'Delivery not available at this pincode'
      });
    }

    // Calculate delivery fee
    let deliveryFee = 40; // Base delivery fee
    
    // Free delivery for orders above ₹200
    if (orderValue >= 200) {
      deliveryFee = 0;
    }
    // Surge pricing for longer distances (example logic)
    else if (pincodeData.deliveryTime > 40) {
      deliveryFee = 60;
    }

    res.json({
      success: true,
      data: {
        deliveryFee,
        freeDeliveryThreshold: 200,
        estimatedDeliveryTime: pincodeData.deliveryTime,
        isFreeDelivery: deliveryFee === 0
      }
    });
  } catch (error) {
    console.error('Delivery fee calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate delivery fee'
    });
  }
});

module.exports = router;
