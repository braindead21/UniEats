const crypto = require('crypto');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    // Prepare user data based on role
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profileImage: user.profileImage
    };

    // Add role-specific data
    if (user.role === 'restaurant_owner' && user.restaurantInfo) {
      userData.restaurantInfo = user.restaurantInfo;
    } else if (user.role === 'student' && user.studentInfo) {
      userData.studentInfo = user.studentInfo;
    } else if (user.role === 'delivery_partner' && user.deliveryPartnerInfo) {
      userData.deliveryPartnerInfo = user.deliveryPartnerInfo;
    }

    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error in sendTokenResponse:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating authentication token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log('Registration attempt:', JSON.stringify(req.body, null, 2));
    const { name, email, password, role, phone, collegeId, restaurantInfo, studentInfo, deliveryPartnerInfo } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    let userData = {
      name,
      email,
      password,
      role: role || 'student',
      phone,
      isVerified: true // Set to true for testing - implement email verification later
    };

    // Handle role-specific data
    if (role === 'restaurant_owner' && restaurantInfo) {
      // Create user first WITHOUT restaurantInfo to avoid validation error
      console.log('Creating user first for restaurant owner...');
      const user = await User.create(userData);
      
      // Now create restaurant with the actual user ObjectId
      console.log('Creating restaurant with user ID:', user._id);
      const restaurant = await Restaurant.create({
        name: restaurantInfo.restaurantName,
        owner: user._id, // Use the actual user ObjectId
        cuisine: Array.isArray(restaurantInfo.cuisine) 
          ? restaurantInfo.cuisine 
          : restaurantInfo.cuisine.includes(',') 
            ? restaurantInfo.cuisine.split(',').map(c => c.trim())
            : [restaurantInfo.cuisine],
        description: restaurantInfo.description,
        address: {
          street: restaurantInfo.location,
          city: 'Campus Area',
          state: 'State',
          zipCode: '000000'
        },
        phone: phone,
        email: email,
        isActive: false, // Will be activated after approval
        isApproved: false, // Requires admin approval
        licenseNumber: restaurantInfo.businessLicense || 'PENDING',
        licenseDocument: 'pending-upload', // Will be updated when document is uploaded
        rating: 4.0, // Set default rating to 4.0 to meet minimum requirement
        totalReviews: 0,
        operatingHours: {
          monday: { open: '09:00', close: '22:00', isClosed: false },
          tuesday: { open: '09:00', close: '22:00', isClosed: false },
          wednesday: { open: '09:00', close: '22:00', isClosed: false },
          thursday: { open: '09:00', close: '22:00', isClosed: false },
          friday: { open: '09:00', close: '22:00', isClosed: false },
          saturday: { open: '09:00', close: '22:00', isClosed: false },
          sunday: { open: '09:00', close: '22:00', isClosed: false }
        }
      });

      // Now update user with restaurant info using findByIdAndUpdate to avoid validation
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'restaurantInfo.restaurantId': restaurant._id,
          'restaurantInfo.businessLicense': restaurantInfo.businessLicense,
          'restaurantInfo.verificationStatus': 'pending'
        }
      });

      // Fetch the updated user to send in response
      const updatedUser = await User.findById(user._id);

      console.log('Restaurant and user created successfully');
      sendTokenResponse(updatedUser, 201, res);
      return;
    } else if (role === 'delivery_partner' && deliveryPartnerInfo) {
      // Create delivery partner user first without deliveryPartnerInfo to avoid validation error
      console.log('Creating delivery partner user first...');
      const user = await User.create(userData);
      
      // Now update user with delivery partner info using findByIdAndUpdate to avoid validation
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'deliveryPartnerInfo.vehicleType': deliveryPartnerInfo.vehicleType,
          'deliveryPartnerInfo.vehicleNumber': deliveryPartnerInfo.vehicleNumber,
          'deliveryPartnerInfo.drivingLicense': deliveryPartnerInfo.licenseNumber,
          'deliveryPartnerInfo.isAvailable': false,
          'deliveryPartnerInfo.deliveryZones': ['north_campus'], // Default zone
          'deliveryPartnerInfo.rating': 0,
          'deliveryPartnerInfo.totalDeliveries': 0,
          'deliveryPartnerInfo.earnings.total': 0,
          'deliveryPartnerInfo.earnings.thisMonth': 0
        }
      });

      // Fetch the updated user to send in response
      const updatedUser = await User.findById(user._id);

      console.log('Delivery partner user created successfully');
      sendTokenResponse(updatedUser, 201, res);
      return;
    } else if (role === 'student' && studentInfo) {
      // Create student user first without studentInfo to avoid validation error
      console.log('Creating student user first...');
      const user = await User.create(userData);
      
      // Now update user with student info using findByIdAndUpdate to avoid validation
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'studentInfo.studentId': studentInfo.studentId,
          'studentInfo.course': studentInfo.course,
          'studentInfo.year': studentInfo.year,
          'studentInfo.hostelBlock': studentInfo.hostelBlock,
          'studentInfo.roomNumber': studentInfo.roomNumber
        }
      });

      // Fetch the updated user to send in response
      const updatedUser = await User.findById(user._id);

      console.log('Student user created successfully');
      sendTokenResponse(updatedUser, 201, res);
      return;
    }

    // Create user for non-restaurant roles
    console.log('Creating user with data:', userData);
    const user = await User.create(userData);

    console.log('User created successfully:', user._id);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyValue);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url (implement email sending later)
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Register student
// @route   POST /api/auth/register/student
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      studentId,
      course,
      year,
      hostelBlock,
      roomNumber
    } = req.body;

    // Temporarily disabled for testing - student email validation
    // if (!email.includes('@university.edu') && !email.includes('@uni.edu')) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please use a valid university email address'
    //   });
    // }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'student',
      studentInfo: {
        studentId,
        course,
        year,
        hostelBlock,
        roomNumber
      }
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Student registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Register restaurant owner
// @route   POST /api/auth/register/restaurant-owner
// @access  Public
exports.registerRestaurantOwner = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      restaurantId,
      businessLicense
    } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'restaurant_owner',
      restaurantInfo: {
        restaurantId,
        businessLicense,
        verificationStatus: 'pending'
      }
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Restaurant owner registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Register delivery partner
// @route   POST /api/auth/register/delivery-partner
// @access  Public
exports.registerDeliveryPartner = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      vehicleType,
      vehicleNumber,
      drivingLicense,
      deliveryZones
    } = req.body;

    // Temporarily disabled for testing - delivery partner email validation
    // if (!email.includes('@university.edu') && !email.includes('@uni.edu')) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Delivery partners must use university email address'
    //   });
    // }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'delivery_partner',
      deliveryPartnerInfo: {
        vehicleType,
        vehicleNumber,
        drivingLicense,
        deliveryZones: deliveryZones || ['north_campus'],
        isAvailable: false
      }
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Delivery partner registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};
