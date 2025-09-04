const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    address: {
      type: String,
      required: [true, 'Customer address is required'],
      trim: true
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Cash App', 'Chime', 'Zelle', 'Apple Pay', 'PayPal', 'Varo', 'Gift Cards']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount must be positive']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Populate car and user information
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'carId',
    select: 'make model year price images'
  }).populate({
    path: 'userId',
    select: 'username email'
  });
  next();
});

// Static method to get recent orders
orderSchema.statics.getRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Method to get formatted total amount
orderSchema.methods.getFormattedAmount = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.totalAmount);
};

// Method to get order summary
orderSchema.methods.getSummary = function() {
  const car = this.carId;
  return {
    orderNumber: this._id.toString().slice(-8),
    carTitle: car ? `${car.year} ${car.make} ${car.model}` : 'Car not available',
    customerName: this.customerInfo.name,
    amount: this.getFormattedAmount(),
    status: this.status,
    date: this.createdAt.toLocaleDateString()
  };
};

module.exports = mongoose.model('Order', orderSchema);