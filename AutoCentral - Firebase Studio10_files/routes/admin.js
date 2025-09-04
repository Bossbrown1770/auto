const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Order = require('../models/Order');
const { requireAdmin } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { validateCar, handleValidationErrors } = require('../middleware/validation');

/**
 * Admin Dashboard
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get dashboard statistics
    const stats = {
      totalCars: await Car.countDocuments(),
      availableCars: await Car.countDocuments({ isAvailable: true }),
      totalOrders: await Order.countDocuments(),
      pendingOrders: await Order.countDocuments({ status: 'pending' }),
      totalUsers: await User.countDocuments(),
      completedOrders: await Order.countDocuments({ status: 'completed' })
    };
    
    // Get recent orders
    const recentOrders = await Order.getRecent(5);
    
    // Get recently added cars
    const recentCars = await Car.find().sort({ createdAt: -1 }).limit(5);
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats,
      recentOrders,
      recentCars
    });
    
  } catch (error) {
    console.error('Admin dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {},
      recentOrders: [],
      recentCars: []
    });
  }
});

/**
 * Car Management Routes
 */

// List all cars
router.get('/cars', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalCars = await Car.countDocuments();
    const totalPages = Math.ceil(totalCars / limit);
    
    res.render('admin/cars/list', {
      title: 'Manage Cars',
      cars,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Car list error:', error);
    req.flash('error', 'Error loading cars');
    res.render('admin/cars/list', {
      title: 'Manage Cars',
      cars: [],
      pagination: {}
    });
  }
});

// Add new car form
router.get('/cars/add', requireAdmin, (req, res) => {
  res.render('admin/cars/add', {
    title: 'Add New Car'
  });
});

// Create new car
router.post('/cars/add', 
  requireAdmin,
  upload.array('images', 10),
  handleMulterError,
  validateCar,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { make, model, year, price, mileage, fuelType, transmission, description, features } = req.body;
      
      // Check if images were uploaded
      if (!req.files || req.files.length === 0) {
        req.flash('error', 'At least one image is required');
        return res.redirect('/admin/cars/add');
      }
      
      // Process uploaded images
      const images = req.files.map(file => file.filename);
      
      // Process features (convert comma-separated string to array)
      const featuresArray = features ? features.split(',').map(f => f.trim()).filter(f => f) : [];
      
      const car = new Car({
        make,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        mileage: parseInt(mileage),
        fuelType,
        transmission,
        description,
        images,
        features: featuresArray
      });
      
      await car.save();
      
      req.flash('success', 'Car added successfully!');
      res.redirect('/admin/cars');
      
    } catch (error) {
      console.error('Add car error:', error);
      req.flash('error', 'Error adding car');
      res.redirect('/admin/cars/add');
    }
  }
);

// Edit car form
router.get('/cars/edit/:id', requireAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      req.flash('error', 'Car not found');
      return res.redirect('/admin/cars');
    }
    
    res.render('admin/cars/edit', {
      title: 'Edit Car',
      car
    });
    
  } catch (error) {
    console.error('Edit car form error:', error);
    req.flash('error', 'Error loading car');
    res.redirect('/admin/cars');
  }
});

// Update car
router.post('/cars/edit/:id',
  requireAdmin,
  upload.array('images', 10),
  handleMulterError,
  validateCar,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { make, model, year, price, mileage, fuelType, transmission, description, features } = req.body;
      
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        req.flash('error', 'Car not found');
        return res.redirect('/admin/cars');
      }
      
      // Update car fields
      car.make = make;
      car.model = model;
      car.year = parseInt(year);
      car.price = parseFloat(price);
      car.mileage = parseInt(mileage);
      car.fuelType = fuelType;
      car.transmission = transmission;
      car.description = description;
      car.features = features ? features.split(',').map(f => f.trim()).filter(f => f) : [];
      
      // Update images if new ones were uploaded
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.filename);
        car.images = [...car.images, ...newImages];
      }
      
      await car.save();
      
      req.flash('success', 'Car updated successfully!');
      res.redirect('/admin/cars');
      
    } catch (error) {
      console.error('Update car error:', error);
      req.flash('error', 'Error updating car');
      res.redirect(`/admin/cars/edit/${req.params.id}`);
    }
  }
);

// Delete car
router.delete('/cars/:id', requireAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    
    if (!car) {
      req.flash('error', 'Car not found');
      return res.redirect('/admin/cars');
    }
    
    req.flash('success', 'Car deleted successfully!');
    res.redirect('/admin/cars');
    
  } catch (error) {
    console.error('Delete car error:', error);
    req.flash('error', 'Error deleting car');
    res.redirect('/admin/cars');
  }
});

// Toggle car availability
router.patch('/cars/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    car.isAvailable = !car.isAvailable;
    await car.save();
    
    res.json({ success: true, isAvailable: car.isAvailable });
    
  } catch (error) {
    console.error('Toggle car availability error:', error);
    res.status(500).json({ error: 'Error updating car availability' });
  }
});

/**
 * Order Management Routes
 */

// List all orders
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);
    
    res.render('admin/orders/list', {
      title: 'Manage Orders',
      orders,
      currentStatus: status,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Order list error:', error);
    req.flash('error', 'Error loading orders');
    res.render('admin/orders/list', {
      title: 'Manage Orders',
      orders: [],
      pagination: {}
    });
  }
});

// View order details
router.get('/orders/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/admin/orders');
    }
    
    res.render('admin/orders/view', {
      title: 'Order Details',
      order
    });
    
  } catch (error) {
    console.error('Order view error:', error);
    req.flash('error', 'Error loading order');
    res.redirect('/admin/orders');
  }
});

// Update order status
router.patch('/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ success: true, status });
    
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

/**
 * User Management Routes
 */

// List all users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.render('admin/users/list', {
      title: 'Manage Users',
      users,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('User list error:', error);
    req.flash('error', 'Error loading users');
    res.render('admin/users/list', {
      title: 'Manage Users',
      users: [],
      pagination: {}
    });
  }
});

// Delete user
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }
    
    // Prevent deleting admin users
    if (user.isAdmin) {
      req.flash('error', 'Cannot delete admin users');
      return res.redirect('/admin/users');
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    req.flash('success', 'User deleted successfully!');
    res.redirect('/admin/users');
    
  } catch (error) {
    console.error('Delete user error:', error);
    req.flash('error', 'Error deleting user');
    res.redirect('/admin/users');
  }
});

module.exports = router;