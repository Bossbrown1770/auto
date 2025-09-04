# 🚀 Car Dealership Website - Deployment Guide

This comprehensive guide covers deploying the Car Dealership Website to various hosting platforms.

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set secure session secrets
- [ ] Configure email service credentials
- [ ] Set up Telegram bot (optional)
- [ ] Configure domain and SSL certificates

### Code Optimization
- [ ] Remove console.logs from production code
- [ ] Optimize images and assets
- [ ] Enable gzip compression
- [ ] Set up error monitoring
- [ ] Configure logging system

## 🌐 Deployment Options

## Option 1: Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

### Step 1: Prepare Application
```bash
# Add Procfile
echo "web: node server.js" > Procfile

# Update package.json engines
npm install --save-dev @heroku/node-js-utils
```

### Step 2: MongoDB Setup
```bash
# Add MongoDB Atlas add-on
heroku addons:create mongolab:sandbox
```

### Step 3: Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET="your-secure-session-secret"
heroku config:set ADMIN_EMAIL="frankrooney474@gmail.com"
heroku config:set ADMIN_PHONE="+14704998139"
heroku config:set ADMIN_PASSWORD="Frankrooney474@"
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASS="your-app-password"
```

### Step 4: Deploy
```bash
# Initialize Heroku app
heroku create your-car-dealership-app

# Deploy
git push heroku main

# Run setup
heroku run npm run setup
```

## Option 2: DigitalOcean Droplet

### Prerequisites
- DigitalOcean account
- SSH access to droplet
- Domain name (optional)

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 2: Application Deployment
```bash
# Clone repository
git clone https://your-repo-url.git car-dealership
cd car-dealership

# Install dependencies
npm install --production

# Create environment file
sudo nano .env
```

### Step 3: Environment Configuration
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-dealership
SESSION_SECRET=your-super-secure-session-secret-here

ADMIN_EMAIL=frankrooney474@gmail.com
ADMIN_PHONE=+14704998139
ADMIN_PASSWORD=Frankrooney474@

EMAIL_USER=frankrooney474@gmail.com
EMAIL_PASS=your-gmail-app-password

TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

NOTIFICATION_PHONE=+14704998139
NOTIFICATION_EMAIL=sac5awosangrooney
TELEGRAM_CHANNEL=https://t.me/carsforsaleunder3000
```

### Step 4: Process Management
```bash
# Start with PM2
pm2 start server.js --name "car-dealership"

# Save PM2 config
pm2 save
pm2 startup

# Run setup
npm run setup
```

### Step 5: Nginx Configuration
```bash
# Install Nginx
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/car-dealership
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/car-dealership /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Option 3: AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04)
- Security groups configured

### Step 1: Instance Setup
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: MongoDB Setup (AWS DocumentDB Alternative)
```bash
# Install MongoDB
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Application Deployment
Follow similar steps as DigitalOcean deployment.

### Step 4: Security Groups
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0  
- SSH (22): Your IP only
- Custom TCP (3000): For development only

## Option 4: Railway Deployment

### Prerequisites
- Railway account
- GitHub repository

### Step 1: Setup Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

### Step 2: Initialize Project
```bash
# In your project directory
railway init

# Add MongoDB service
railway add mongodb
```

### Step 3: Environment Variables
```bash
railway variables:set NODE_ENV=production
railway variables:set SESSION_SECRET="your-secure-secret"
railway variables:set ADMIN_EMAIL="frankrooney474@gmail.com"
railway variables:set ADMIN_PHONE="+14704998139"
railway variables:set ADMIN_PASSWORD="Frankrooney474@"
```

### Step 4: Deploy
```bash
# Deploy current directory
railway up
```

## 🔧 Production Configuration

### Environment Variables Template
```env
# Application
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/car-dealership

# Security
SESSION_SECRET=generate-a-long-random-string-here

# Admin Credentials
ADMIN_EMAIL=frankrooney474@gmail.com
ADMIN_PHONE=+14704998139
ADMIN_PASSWORD=create-a-strong-password

# Email Service (Gmail)
EMAIL_USER=frankrooney474@gmail.com
EMAIL_PASS=your-gmail-app-specific-password
EMAIL_SERVICE=gmail

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# SMS Service (Optional - Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Notification Recipients
NOTIFICATION_PHONE=+14704998139
NOTIFICATION_EMAIL=sac5awosangrooney
TELEGRAM_CHANNEL=https://t.me/carsforsaleunder3000
```

### Production Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "setup": "node setup.js",
    "migrate": "node migrations/migrate.js",
    "seed": "node seeds/seed.js"
  }
}
```

## 🔒 Security Hardening

### Server Security
```bash
# UFW Firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Fail2Ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### Application Security
- Use HTTPS only in production
- Set secure session cookies
- Enable CORS properly
- Use helmet.js for security headers
- Implement rate limiting
- Validate all inputs
- Use parameterized queries

### Environment Security
- Never commit .env files
- Use strong, unique passwords
- Enable 2FA where possible
- Regularly update dependencies
- Monitor for vulnerabilities

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs car-dealership

# Monitor performance
pm2 monit

# Restart application
pm2 restart car-dealership
```

### Error Logging
```javascript
// Add to server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to server
      run: |
        # Add deployment commands
```

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

**Permission Errors**
```bash
# Fix uploads directory permissions
sudo chown -R www-data:www-data uploads/
sudo chmod -R 755 uploads/
```

**Port Issues**
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 PID
```

### Performance Issues
- Enable gzip compression
- Optimize database queries
- Use CDN for static assets
- Implement caching
- Monitor memory usage

## 📞 Support Information

**Business Contact:**
- **Phone**: +1 (470) 499-8139
- **Email**: frankrooney474@gmail.com
- **Telegram**: https://t.me/carsforsaleunder3000

**Technical Support:**
- Check logs first: `pm2 logs car-dealership`
- Monitor system resources: `htop`
- Database issues: Check MongoDB logs
- Network issues: Check firewall settings

---

**Remember to always backup your database before major deployments!**