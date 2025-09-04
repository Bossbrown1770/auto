const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    req.flash('error', errorMessages);
    return res.redirect('back');
  }
  
  next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number')
];

/**
 * User login validation
 */
const validateUserLogin = [
  body('login')
    .notEmpty()
    .withMessage('Email or phone is required'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Car creation/update validation
 */
const validateCar = [
  body('make')
    .trim()
    .notEmpty()
    .withMessage('Make is required')
    .isLength({ max: 50 })
    .withMessage('Make cannot exceed 50 characters'),
    
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required')
    .isLength({ max: 50 })
    .withMessage('Model cannot exceed 50 characters'),
    
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),
    
  body('price')
    .isFloat({ min: 1, max: 3000 })
    .withMessage('Price must be between $1 and $3000'),
    
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
    
  body('fuelType')
    .isIn(['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'])
    .withMessage('Please select a valid fuel type'),
    
  body('transmission')
    .isIn(['Manual', 'Automatic', 'CVT'])
    .withMessage('Please select a valid transmission type'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters')
];

/**
 * Order creation validation
 */
const validateOrder = [
  body('customerInfo.name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
    
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
    
  body('customerInfo.phone')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
    
  body('customerInfo.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
    
  body('paymentMethod')
    .isIn(['Cash App', 'Chime', 'Zelle', 'Apple Pay', 'PayPal', 'Varo', 'Gift Cards'])
    .withMessage('Please select a valid payment method')
];

/**
 * Search validation
 */
const validateSearch = [
  body('make')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Make cannot exceed 50 characters'),
    
  body('model')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Model cannot exceed 50 characters'),
    
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),
    
  body('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be positive'),
    
  body('maxPrice')
    .optional()
    .isFloat({ min: 0, max: 3000 })
    .withMessage('Maximum price must be between $0 and $3000')
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateCar,
  validateOrder,
  validateSearch
};