const User = require('../models/User');

/**
 * Middleware to check if user is authenticated
 */
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  req.flash('error', 'You must be logged in to access this page');
  return res.redirect('/auth/login');
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  
  req.flash('error', 'Admin access required');
  return res.redirect('/auth/login');
};

/**
 * Middleware to check if user is guest (not logged in)
 */
const requireGuest = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  return next();
};

/**
 * Middleware to load user data into session
 */
const loadUser = async (req, res, next) => {
  if (req.session && req.session.user) {
    try {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        req.session.destroy();
        return res.redirect('/auth/login');
      }
      
      // Update session with latest user data
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };
      
      res.locals.user = req.session.user;
    } catch (error) {
      console.error('Error loading user:', error);
      req.session.destroy();
      return res.redirect('/auth/login');
    }
  }
  
  next();
};

/**
 * Middleware to validate user permissions for specific resources
 */
const validateUserAccess = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  
  // Admin has access to all resources
  if (req.session.user.isAdmin) {
    return next();
  }
  
  // Regular users can only access their own resources
  if (userId && userId !== req.session.user.id) {
    req.flash('error', 'Access denied');
    return res.redirect('/');
  }
  
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireGuest,
  loadUser,
  validateUserAccess
};