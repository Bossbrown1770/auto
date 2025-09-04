# Car Dealership Website - Cars Under $3000

A fully functional, secure, and responsive car dealership website specializing in vehicles under $3000, featuring comprehensive inventory management, multiple payment options, and a powerful admin panel.

## 🚗 Features

### Frontend Features
- **Responsive Design**: Mobile-first design using Bootstrap 5
- **Car Inventory**: Browse and filter cars by make, model, year, and price
- **Detailed Car Pages**: Multiple images, specifications, and descriptions
- **User Authentication**: Secure registration and login system
- **Order System**: Complete purchase flow with multiple payment options
- **Contact & About Pages**: Professional business information

### Backend Features
- **Admin Dashboard**: Complete control panel with analytics
- **Car Management**: Full CRUD operations for inventory
- **Order Management**: Track and update order statuses
- **User Management**: Admin can manage user accounts
- **Notification System**: Telegram, SMS, and email notifications

### Payment Options
- Cash App
- Chime
- Zelle
- Apple Pay
- PayPal
- Varo
- Gift Cards

### Security Features
- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- Helmet.js security headers
- Rate limiting
- CSRF protection

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, EJS templates
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express-session with bcrypt
- **File Upload**: Multer for image handling
- **Notifications**: Nodemailer, Telegram API
- **Security**: Helmet, express-validator, rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-dealership-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env .env.local
   ```

   **Required Environment Variables:**
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/car-dealership
   SESSION_SECRET=your-super-secret-session-key-here
   
   # Admin Credentials
   ADMIN_EMAIL=frankrooney474@gmail.com
   ADMIN_PHONE=+14704998139
   ADMIN_PASSWORD=Frankrooney474@
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Telegram Configuration (Optional)
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   TELEGRAM_CHAT_ID=your-telegram-chat-id
   
   # Notification Recipients
   NOTIFICATION_PHONE=+14704998139
   NOTIFICATION_EMAIL=sac5awosangrooney
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

6. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Create admin user**
   Visit `http://localhost:3000/auth/admin-setup` to create the initial admin user.

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set secure session secrets
4. Configure email and notification services

### Production Considerations
- Use PM2 or similar for process management
- Set up SSL certificates (Let's Encrypt recommended)
- Configure reverse proxy (Nginx recommended)
- Set up automated backups for MongoDB
- Monitor logs and performance

## 📱 Admin Panel

### Default Admin Credentials
- **Email**: frankrooney474@gmail.com
- **Phone**: +1 470-499-8139
- **Password**: Frankrooney474@

### Admin Features
- Dashboard with key metrics
- Car inventory management (CRUD)
- Order management and status updates
- User management
- Image upload and management
- Notification settings

## 🔔 Notification System

The system sends notifications for:
- New orders
- Order status changes
- Order cancellations

**Notification Channels:**
- **Telegram**: https://t.me/carsforsaleunder3000
- **SMS**: +1 470-499-8139
- **Email**: sac5awosangrooney

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  phone: String,
  isAdmin: Boolean,
  createdAt: Date
}
```

### Car Collection
```javascript
{
  _id: ObjectId,
  make: String,
  model: String,
  year: Number,
  price: Number, // max $3000
  mileage: Number,
  fuelType: String,
  transmission: String,
  description: String,
  images: [String],
  features: [String],
  isAvailable: Boolean,
  createdAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  carId: ObjectId,
  userId: ObjectId,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  paymentMethod: String,
  totalAmount: Number,
  status: String,
  createdAt: Date
}
```

## 🔧 API Endpoints

### Public Routes
- `GET /` - Homepage
- `GET /cars` - Car inventory
- `GET /cars/:id` - Car details
- `GET /search` - Search cars
- `POST /orders/create/:carId` - Create order
- `GET /about` - About page
- `GET /contact` - Contact page

### Auth Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### Admin Routes (Protected)
- `GET /admin` - Admin dashboard
- `GET /admin/cars` - Manage cars
- `POST /admin/cars/add` - Add new car
- `GET /admin/orders` - Manage orders
- `PATCH /admin/orders/:id/status` - Update order status

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Test specific features
npm run test:auth
npm run test:cars
npm run test:orders
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email frankrooney474@gmail.com or join our Telegram channel: https://t.me/carsforsaleunder3000

## 🚗 Business Information

**Cars Under $3000**
- **Phone**: +1 (470) 499-8139
- **Email**: frankrooney474@gmail.com
- **Telegram**: @carsforsaleunder3000

**Specializing in quality used vehicles under $3000 with flexible payment options.**

---

Built with ❤️ for affordable transportation solutions.