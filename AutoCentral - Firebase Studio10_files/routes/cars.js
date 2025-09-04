const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

/**
 * List all available cars (inventory page)
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12; // Show 12 cars per page
    const skip = (page - 1) * limit;
    
    // Get filter parameters
    const filters = {
      make: req.query.make,
      year: req.query.year ? parseInt(req.query.year) : null,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      fuelType: req.query.fuelType,
      transmission: req.query.transmission
    };
    
    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });
    
    // Get filtered cars
    const cars = await Car.search(filters).skip(skip).limit(limit);
    
    // Get total count for pagination
    const totalCars = await Car.search(filters).countDocuments();
    const totalPages = Math.ceil(totalCars / limit);
    
    // Get unique values for filters
    const makes = await Car.distinct('make', { isAvailable: true });
    const years = await Car.distinct('year', { isAvailable: true });
    const fuelTypes = await Car.distinct('fuelType', { isAvailable: true });
    const transmissions = await Car.distinct('transmission', { isAvailable: true });
    
    res.render('cars/index', {
      title: 'Car Inventory - Cars Under $3000',
      cars,
      filters: req.query,
      filterOptions: {
        makes: makes.sort(),
        years: years.sort((a, b) => b - a), // Latest years first
        fuelTypes: fuelTypes.sort(),
        transmissions: transmissions.sort()
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalCars,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Car listing error:', error);
    req.flash('error', 'Error loading cars');
    res.render('cars/index', {
      title: 'Car Inventory - Cars Under $3000',
      cars: [],
      filters: {},
      filterOptions: {},
      pagination: {}
    });
  }
});

/**
 * View individual car details
 */
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      req.flash('error', 'Car not found');
      return res.redirect('/cars');
    }
    
    if (!car.isAvailable) {
      req.flash('error', 'This car is no longer available');
      return res.redirect('/cars');
    }
    
    // Get similar cars (same make or similar price range)
    const similarCars = await Car.find({
      $and: [
        { _id: { $ne: car._id } },
        { isAvailable: true },
        {
          $or: [
            { make: car.make },
            { 
              price: { 
                $gte: car.price - 500, 
                $lte: car.price + 500 
              } 
            }
          ]
        }
      ]
    }).limit(4);
    
    res.render('cars/view', {
      title: `${car.year} ${car.make} ${car.model} - Cars Under $3000`,
      car,
      similarCars
    });
    
  } catch (error) {
    console.error('Car view error:', error);
    req.flash('error', 'Error loading car details');
    res.redirect('/cars');
  }
});

module.exports = router;