const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
    max: [3000, 'Price must be under $3000']
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage must be positive']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other'],
    default: 'Gasoline'
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['Manual', 'Automatic', 'CVT'],
    default: 'Automatic'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
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
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find available cars
carSchema.statics.findAvailable = function() {
  return this.find({ isAvailable: true }).sort({ createdAt: -1 });
};

// Static method to search cars
carSchema.statics.search = function(query) {
  const searchQuery = { isAvailable: true };
  
  if (query.make) {
    searchQuery.make = new RegExp(query.make, 'i');
  }
  
  if (query.model) {
    searchQuery.model = new RegExp(query.model, 'i');
  }
  
  if (query.year) {
    searchQuery.year = query.year;
  }
  
  if (query.minPrice || query.maxPrice) {
    searchQuery.price = {};
    if (query.minPrice) searchQuery.price.$gte = query.minPrice;
    if (query.maxPrice) searchQuery.price.$lte = query.maxPrice;
  }
  
  if (query.fuelType) {
    searchQuery.fuelType = query.fuelType;
  }
  
  if (query.transmission) {
    searchQuery.transmission = query.transmission;
  }
  
  return this.find(searchQuery).sort({ createdAt: -1 });
};

// Method to get formatted price
carSchema.methods.getFormattedPrice = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.price);
};

// Method to get car title
carSchema.methods.getTitle = function() {
  return `${this.year} ${this.make} ${this.model}`;
};

module.exports = mongoose.model('Car', carSchema);