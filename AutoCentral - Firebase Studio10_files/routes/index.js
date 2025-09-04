const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Order = require('../models/Order');

/**
 * Homepage Route
 */
router.get('/', async (req, res) => {
  try {
    // Get featured cars (latest 6 available cars)
    const featuredCars = await Car.findAvailable().limit(6);
    
    // Get basic stats for homepage
    const totalCars = await Car.countDocuments({ isAvailable: true });
    const totalOrders = await Order.countDocuments();
    
    res.render('index', {
      title: 'Cars Under $3000 - Affordable Quality Vehicles',
      featuredCars,
      stats: {
        totalCars,
        totalOrders
      }
    });
  } catch (error) {
    console.error('Homepage error:', error);
    req.flash('error', 'Error loading homepage');
    res.render('index', {
      title: 'Cars Under $3000 - Affordable Quality Vehicles',
      featuredCars: [],
      stats: { totalCars: 0, totalOrders: 0 }
    });
  }
});

/**
 * About Page Route
 */
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - Cars Under $3000'
  });
});

/**
 * Contact Page Route
 */
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Cars Under $3000'
  });
});

/**
 * Handle Contact Form Submission
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/contact');
    }
    
    // Here you would typically send an email or save to database
    // For now, we'll just show a success message
    req.flash('success', 'Thank you for your message! We will get back to you soon.');
    res.redirect('/contact');
    
  } catch (error) {
    console.error('Contact form error:', error);
    req.flash('error', 'Error sending message. Please try again.');
    res.redirect('/contact');
  }
});

/**
 * Search Route
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query;
    let cars = [];
    
    if (Object.keys(query).length > 0) {
      // Convert string numbers to actual numbers
      if (query.year) query.year = parseInt(query.year);
      if (query.minPrice) query.minPrice = parseFloat(query.minPrice);
      if (query.maxPrice) query.maxPrice = parseFloat(query.maxPrice);
      
      cars = await Car.search(query);
    }
    
    res.render('search', {
      title: 'Search Cars - Cars Under $3000',
      cars,
      query,
      resultsCount: cars.length
    });
    
  } catch (error) {
    console.error('Search error:', error);
    req.flash('error', 'Error performing search');
    res.render('search', {
      title: 'Search Cars - Cars Under $3000',
      cars: [],
      query: req.query,
      resultsCount: 0
    });
  }
});

module.exports = router;