const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Order = require('../models/Order');
const { validateOrder, handleValidationErrors } = require('../middleware/validation');
const { sendNotification } = require('../utils/notifications');

/**
 * Create order page
 */
router.get('/create/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    
    if (!car) {
      req.flash('error', 'Car not found');
      return res.redirect('/cars');
    }
    
    if (!car.isAvailable) {
      req.flash('error', 'This car is no longer available');
      return res.redirect('/cars');
    }
    
    res.render('orders/create', {
      title: `Order ${car.year} ${car.make} ${car.model}`,
      car,
      paymentMethods: ['Cash App', 'Chime', 'Zelle', 'Apple Pay', 'PayPal', 'Varo', 'Gift Cards']
    });
    
  } catch (error) {
    console.error('Order creation page error:', error);
    req.flash('error', 'Error loading order page');
    res.redirect('/cars');
  }
});

/**
 * Process order creation
 */
router.post('/create/:carId',
  validateOrder,
  handleValidationErrors,
  async (req, res) => {
    try {
      const car = await Car.findById(req.params.carId);
      
      if (!car) {
        req.flash('error', 'Car not found');
        return res.redirect('/cars');
      }
      
      if (!car.isAvailable) {
        req.flash('error', 'This car is no longer available');
        return res.redirect('/cars');
      }
      
      const { customerInfo, paymentMethod, notes } = req.body;
      
      // Create new order
      const order = new Order({
        carId: car._id,
        userId: req.session.user ? req.session.user.id : null,
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address
        },
        paymentMethod,
        totalAmount: car.price,
        notes: notes || '',
        status: 'pending'
      });
      
      await order.save();
      
      // Mark car as unavailable
      car.isAvailable = false;
      await car.save();
      
      // Send notifications
      try {
        await sendNotification({
          type: 'new_order',
          order: await Order.findById(order._id), // Get populated order
          car
        });
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
        // Don't fail the order creation if notifications fail
      }
      
      req.flash('success', 'Order placed successfully! We will contact you soon.');
      res.redirect(`/orders/confirmation/${order._id}`);
      
    } catch (error) {
      console.error('Order creation error:', error);
      req.flash('error', 'Error creating order. Please try again.');
      res.redirect(`/orders/create/${req.params.carId}`);
    }
  }
);

/**
 * Order confirmation page
 */
router.get('/confirmation/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/');
    }
    
    res.render('orders/confirmation', {
      title: 'Order Confirmation',
      order
    });
    
  } catch (error) {
    console.error('Order confirmation error:', error);
    req.flash('error', 'Error loading order confirmation');
    res.redirect('/');
  }
});

/**
 * View order status (for customers)
 */
router.get('/status/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/');
    }
    
    // Allow access if user is the order owner or admin
    if (req.session.user && 
        (req.session.user.id === order.userId?.toString() || req.session.user.isAdmin)) {
      // User has access
    } else {
      // For guest orders, we could implement a simple token-based access
      req.flash('error', 'Access denied');
      return res.redirect('/');
    }
    
    res.render('orders/status', {
      title: 'Order Status',
      order
    });
    
  } catch (error) {
    console.error('Order status error:', error);
    req.flash('error', 'Error loading order status');
    res.redirect('/');
  }
});

/**
 * Cancel order (customer side)
 */
router.post('/cancel/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/');
    }
    
    // Check if user can cancel this order
    if (!req.session.user || 
        (req.session.user.id !== order.userId?.toString() && !req.session.user.isAdmin)) {
      req.flash('error', 'Access denied');
      return res.redirect('/');
    }
    
    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      req.flash('error', 'Cannot cancel this order');
      return res.redirect(`/orders/status/${order._id}`);
    }
    
    // Update order status
    order.status = 'cancelled';
    await order.save();
    
    // Make car available again
    const car = await Car.findById(order.carId);
    if (car) {
      car.isAvailable = true;
      await car.save();
    }
    
    // Send cancellation notification
    try {
      await sendNotification({
        type: 'order_cancelled',
        order,
        car
      });
    } catch (notificationError) {
      console.error('Cancellation notification error:', notificationError);
    }
    
    req.flash('success', 'Order cancelled successfully');
    res.redirect(`/orders/status/${order._id}`);
    
  } catch (error) {
    console.error('Order cancellation error:', error);
    req.flash('error', 'Error cancelling order');
    res.redirect('/');
  }
});

module.exports = router;