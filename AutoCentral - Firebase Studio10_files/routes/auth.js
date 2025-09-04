const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireGuest } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middleware/validation');

/**
 * Registration Routes
 */
router.get('/register', requireGuest, (req, res) => {
  res.render('auth/register', {
    title: 'Register - Cars Under $3000'
  });
});

router.post('/register', 
  requireGuest, 
  validateUserRegistration, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { username, email, password, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
      
      if (existingUser) {
        req.flash('error', 'User with this email or username already exists');
        return res.redirect('/auth/register');
      }
      
      // Create new user
      const user = new User({
        username,
        email,
        password,
        phone,
        isAdmin: false
      });
      
      await user.save();
      
      // Auto-login user after registration
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };
      
      req.flash('success', 'Registration successful! Welcome to Cars Under $3000');
      res.redirect('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 11000) {
        // Handle duplicate key error
        const field = Object.keys(error.keyPattern)[0];
        req.flash('error', `${field} already exists`);
      } else {
        req.flash('error', 'Registration failed. Please try again.');
      }
      
      res.redirect('/auth/register');
    }
  }
);

/**
 * Login Routes
 */
router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Login - Cars Under $3000'
  });
});

router.post('/login', 
  requireGuest, 
  validateUserLogin, 
  handleValidationErrors, 
  async (req, res) => {
    try {
      const { login, password } = req.body;
      
      // Find user by email or phone
      const user = await User.findOne({
        $or: [
          { email: login.toLowerCase() },
          { phone: login }
        ]
      });
      
      if (!user) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/auth/login');
      }
      
      // Check password
      const isValidPassword = await user.comparePassword(password);
      
      if (!isValidPassword) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/auth/login');
      }
      
      // Create session
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };
      
      req.flash('success', `Welcome back, ${user.username}!`);
      
      // Redirect to intended page or home
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
      
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'Login failed. Please try again.');
      res.redirect('/auth/login');
    }
  }
);

/**
 * Logout Route
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      req.flash('error', 'Error logging out');
      return res.redirect('/');
    }
    
    res.redirect('/');
  });
});

/**
 * Admin Setup Route (for initial admin user creation)
 */
router.get('/admin-setup', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (adminExists) {
      req.flash('error', 'Admin user already exists');
      return res.redirect('/auth/login');
    }
    
    res.render('auth/admin-setup', {
      title: 'Admin Setup - Cars Under $3000'
    });
    
  } catch (error) {
    console.error('Admin setup error:', error);
    req.flash('error', 'Error accessing admin setup');
    res.redirect('/');
  }
});

router.post('/admin-setup', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (adminExists) {
      req.flash('error', 'Admin user already exists');
      return res.redirect('/auth/login');
    }
    
    // Create admin user with credentials from .env
    const adminUser = new User({
      username: 'admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      phone: process.env.ADMIN_PHONE,
      isAdmin: true
    });
    
    await adminUser.save();
    
    // Auto-login admin
    req.session.user = {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin
    };
    
    req.flash('success', 'Admin user created successfully!');
    res.redirect('/admin');
    
  } catch (error) {
    console.error('Admin setup error:', error);
    req.flash('error', 'Error creating admin user');
    res.redirect('/auth/admin-setup');
  }
});

module.exports = router;