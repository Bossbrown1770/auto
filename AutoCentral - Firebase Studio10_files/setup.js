const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

/**
 * Setup script for Car Dealership Website
 * This script initializes the database and creates the admin user
 */

async function setupDatabase() {
    try {
        console.log('🚗 Car Dealership Setup Starting...\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully\n');

        // Check if admin user already exists
        console.log('👤 Checking for existing admin user...');
        const existingAdmin = await User.findOne({ isAdmin: true });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log('   Use existing credentials to access admin panel\n');
        } else {
            // Create admin user
            console.log('🔧 Creating admin user...');
            const adminUser = new User({
                username: 'admin',
                email: process.env.ADMIN_EMAIL || 'frankrooney474@gmail.com',
                password: process.env.ADMIN_PASSWORD || 'Frankrooney474@',
                phone: process.env.ADMIN_PHONE || '+14704998139',
                isAdmin: true
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Phone: ${adminUser.phone}`);
            console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Frankrooney474@'}\n`);
        }

        console.log('🎉 Setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Start the server: npm start');
        console.log('2. Visit: http://localhost:3000');
        console.log('3. Access admin panel: http://localhost:3000/admin');
        console.log('4. Add your first car to the inventory\n');

        console.log('📞 Support Information:');
        console.log('   Phone: +1 (470) 499-8139');
        console.log('   Email: frankrooney474@gmail.com');
        console.log('   Telegram: https://t.me/carsforsaleunder3000\n');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('Please check your MongoDB connection and try again.\n');
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚗 Car Dealership Setup Script

Usage: node setup.js [options]

Options:
  --help, -h    Show this help message
  --force, -f   Force recreation of admin user

Environment Variables:
  MONGODB_URI      MongoDB connection string
  ADMIN_EMAIL      Admin user email
  ADMIN_PASSWORD   Admin user password
  ADMIN_PHONE      Admin user phone number

Example:
  node setup.js
  MONGODB_URI=mongodb://localhost:27017/cars node setup.js
    `);
    process.exit(0);
}

if (args.includes('--force') || args.includes('-f')) {
    console.log('🔄 Force mode enabled - will recreate admin user if exists\n');
    // You can implement force recreation logic here if needed
}

// Run setup
setupDatabase();