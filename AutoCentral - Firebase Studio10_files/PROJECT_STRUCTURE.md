# 🚗 Car Dealership Website - Project Structure

This document outlines the complete file structure and organization of the Car Dealership Website project.

## 📁 Root Directory Structure

```
car-dealership-website/
├── 📂 middleware/              # Custom middleware functions
│   ├── auth.js                # Authentication middleware
│   ├── upload.js              # File upload handling
│   └── validation.js          # Input validation middleware
├── 📂 models/                 # MongoDB models (Mongoose schemas)
│   ├── Car.js                 # Car model with business logic
│   ├── Order.js               # Order model with status tracking
│   └── User.js                # User model with authentication
├── 📂 public/                 # Static assets served to clients
│   ├── 📂 css/                # Stylesheets
│   │   └── style.css          # Custom CSS styles
│   ├── 📂 js/                 # Client-side JavaScript
│   │   └── main.js            # Main frontend functionality
│   └── 📂 images/             # Static images (to be created)
├── 📂 routes/                 # Express route handlers
│   ├── admin.js               # Admin panel routes
│   ├── auth.js                # Authentication routes
│   ├── cars.js                # Car inventory routes
│   ├── index.js               # Homepage and general routes
│   └── orders.js              # Order management routes
├── 📂 uploads/                # User uploaded files (car images)
│   └── .gitkeep              # Ensures directory exists in Git
├── 📂 utils/                  # Utility functions
│   └── notifications.js       # Email/SMS/Telegram notifications
├── 📂 views/                  # EJS template files
│   ├── 📂 admin/              # Admin panel views
│   │   ├── 📂 cars/           # Car management views
│   │   │   ├── add.ejs        # Add new car form
│   │   │   └── list.ejs       # Car inventory list
│   │   └── dashboard.ejs      # Admin dashboard
│   ├── 📂 auth/               # Authentication views
│   │   ├── login.ejs          # Login form
│   │   └── register.ejs       # Registration form
│   ├── 📂 cars/               # Car-related views
│   │   ├── index.ejs          # Car inventory page
│   │   └── view.ejs           # Individual car details
│   ├── 📂 orders/             # Order-related views
│   │   ├── confirmation.ejs   # Order confirmation page
│   │   └── create.ejs         # Order creation form
│   ├── about.ejs              # About us page
│   ├── contact.ejs            # Contact page
│   ├── error.ejs              # Error page template
│   ├── index.ejs              # Homepage template
│   ├── layout.ejs             # Main layout template
│   └── search.ejs             # Search results page
├── .env                       # Environment variables (not in Git)
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js dependencies and scripts
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Project documentation
├── server.js                  # Main application entry point
└── setup.js                   # Database setup script
```

## 🏗️ Architecture Overview

### MVC Pattern Implementation
- **Models** (`/models/`): Database schemas and business logic
- **Views** (`/views/`): EJS templates for rendering HTML
- **Controllers** (`/routes/`): Request handling and business logic

### Middleware Layer (`/middleware/`)
- **Authentication**: Session management and user verification
- **File Upload**: Image handling with Multer
- **Validation**: Input sanitization and validation rules

### Utilities (`/utils/`)
- **Notifications**: Multi-channel notification system

### Static Assets (`/public/`)
- **CSS**: Custom styling and responsive design
- **JavaScript**: Client-side functionality and interactions

## 📋 Key Features by Directory

### `/models/` - Data Layer
```javascript
User.js      // User management, authentication, admin roles
Car.js       // Car inventory, search, pricing logic  
Order.js     // Order processing, status tracking, payments
```

### `/routes/` - API Endpoints
```javascript
index.js     // /, /about, /contact, /search
auth.js      // /auth/login, /auth/register, /auth/logout
cars.js      // /cars, /cars/:id (public car viewing)
orders.js    // /orders/create, /orders/confirmation
admin.js     // /admin/* (protected admin routes)
```

### `/views/` - User Interface
```
layout.ejs          // Base template with navigation, footer
index.ejs           // Homepage with featured cars
cars/index.ejs      // Car inventory with filtering
cars/view.ejs       // Individual car details page
orders/create.ejs   // Order form with payment options
admin/dashboard.ejs // Admin analytics and quick actions
```

### `/middleware/` - Security & Validation
```javascript
auth.js        // requireAuth, requireAdmin, requireGuest
upload.js      // File upload handling and validation
validation.js  // Form validation rules and sanitization
```

## 🔧 Configuration Files

### Environment Variables (`.env`)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-dealership
SESSION_SECRET=your-secret-key
ADMIN_EMAIL=frankrooney474@gmail.com
ADMIN_PHONE=+14704998139
ADMIN_PASSWORD=Frankrooney474@
```

### Package Configuration (`package.json`)
- **Dependencies**: Express, MongoDB, security packages
- **Scripts**: start, dev, setup, test
- **Metadata**: Project information and licensing

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Setup Database
```bash
npm run setup
```

### 3. Start Development
```bash
npm run dev
```

### 4. Access Application
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 🔐 Security Implementation

### Authentication Flow
1. **Registration** → Hash password → Create session
2. **Login** → Verify credentials → Create session  
3. **Authorization** → Check session → Grant access

### File Upload Security
- **Type validation**: Images only
- **Size limits**: 5MB per file, max 10 files
- **Secure storage**: Dedicated uploads directory

### Input Validation
- **Server-side**: Express-validator middleware
- **Client-side**: HTML5 validation + custom JS
- **Sanitization**: XSS protection and data cleaning

## 📊 Database Schema

### Collections
```javascript
users: {
  username, email, password (hashed), 
  phone, isAdmin, createdAt
}

cars: {
  make, model, year, price, mileage, 
  fuelType, transmission, description,
  images[], features[], isAvailable, 
  createdAt, updatedAt
}

orders: {
  carId, userId, customerInfo{}, 
  paymentMethod, totalAmount, status,
  notes, createdAt, updatedAt
}
```

## 🌐 Frontend Technology Stack

- **Template Engine**: EJS (Embedded JavaScript)
- **CSS Framework**: Bootstrap 5.3.2
- **Icons**: Bootstrap Icons 1.11.2
- **JavaScript**: Vanilla JS with modern ES6+
- **Responsive Design**: Mobile-first approach

## 🔧 Backend Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express-session + bcryptjs
- **File Upload**: Multer
- **Security**: Helmet, express-rate-limit
- **Validation**: express-validator
- **Notifications**: Nodemailer, Axios (Telegram)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 768px  
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

### Mobile-First Features
- Collapsible navigation
- Touch-friendly buttons
- Optimized image sizes
- Simplified forms on mobile

## 🎨 Styling Architecture

### CSS Organization
```css
style.css
├── Root variables (colors, fonts)
├── Global styles (body, typography)
├── Component styles (cards, buttons)
├── Layout styles (hero, sections)
├── Responsive breakpoints
└── Utility classes
```

## 📈 Performance Optimizations

### Frontend
- **Lazy loading**: Images load on scroll
- **Minification**: CSS and JS optimization
- **Caching**: Browser caching headers
- **Compression**: Gzip compression

### Backend
- **Database indexing**: Optimized queries
- **Session storage**: MongoDB session store
- **Rate limiting**: API protection
- **Security headers**: Helmet.js

## 🚦 Development Workflow

### 1. Local Development
```bash
npm run dev     # Start with nodemon
```

### 2. Database Setup
```bash
npm run setup   # Initialize admin user
```

### 3. Testing
```bash
npm test        # Run test suite (when implemented)
```

### 4. Production Deployment
```bash
NODE_ENV=production npm start
```

## 📞 Support & Contact

**Business Information:**
- **Phone**: +1 (470) 499-8139
- **Email**: frankrooney474@gmail.com  
- **Telegram**: https://t.me/carsforsaleunder3000

**Payment Methods Supported:**
Cash App • Chime • Zelle • Apple Pay • PayPal • Varo • Gift Cards

---

**Built with ❤️ for affordable transportation solutions**