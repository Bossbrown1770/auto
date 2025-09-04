const nodemailer = require('nodemailer');
const axios = require('axios');

/**
 * Email transporter configuration
 */
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send email notification
 */
const sendEmailNotification = async (subject, message, recipient = null) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured');
      return;
    }
    
    const transporter = createEmailTransporter();
    const to = recipient || process.env.NOTIFICATION_EMAIL;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: message
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
    
  } catch (error) {
    console.error('Email notification error:', error);
  }
};

/**
 * Send Telegram notification
 */
const sendTelegramNotification = async (message) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.log('Telegram credentials not configured');
      return;
    }
    
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    
    console.log('Telegram notification sent successfully');
    
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};

/**
 * Send SMS notification (using Twilio or similar service)
 */
const sendSMSNotification = async (message, phoneNumber = null) => {
  try {
    // This is a placeholder for SMS implementation
    // You would integrate with Twilio, AWS SNS, or another SMS provider
    const recipient = phoneNumber || process.env.NOTIFICATION_PHONE;
    
    console.log(`SMS notification would be sent to ${recipient}: ${message}`);
    
    // Example Twilio integration:
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient
    });
    */
    
  } catch (error) {
    console.error('SMS notification error:', error);
  }
};

/**
 * Format order notification message
 */
const formatOrderMessage = (type, order, car) => {
  const orderSummary = order.getSummary();
  
  const messages = {
    new_order: {
      subject: `🚗 New Car Order - ${orderSummary.carTitle}`,
      email: `
        <h2>New Car Order Received!</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h3>Order Details:</h3>
          <ul>
            <li><strong>Order #:</strong> ${orderSummary.orderNumber}</li>
            <li><strong>Car:</strong> ${orderSummary.carTitle}</li>
            <li><strong>Price:</strong> ${orderSummary.amount}</li>
            <li><strong>Payment Method:</strong> ${order.paymentMethod}</li>
            <li><strong>Date:</strong> ${orderSummary.date}</li>
          </ul>
          
          <h3>Customer Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${order.customerInfo.name}</li>
            <li><strong>Email:</strong> ${order.customerInfo.email}</li>
            <li><strong>Phone:</strong> ${order.customerInfo.phone}</li>
            <li><strong>Address:</strong> ${order.customerInfo.address}</li>
          </ul>
          
          ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
        
        <p><strong>Telegram:</strong> <a href="${process.env.TELEGRAM_CHANNEL}">Check Telegram Channel</a></p>
      `,
      telegram: `
🚗 <b>NEW CAR ORDER!</b>

📋 <b>Order #:</b> ${orderSummary.orderNumber}
🚙 <b>Car:</b> ${orderSummary.carTitle}
💰 <b>Price:</b> ${orderSummary.amount}
💳 <b>Payment:</b> ${order.paymentMethod}
📅 <b>Date:</b> ${orderSummary.date}

👤 <b>Customer Info:</b>
• Name: ${order.customerInfo.name}
• Email: ${order.customerInfo.email}
• Phone: ${order.customerInfo.phone}
• Address: ${order.customerInfo.address}

${order.notes ? `📝 Notes: ${order.notes}` : ''}

🔗 Telegram: ${process.env.TELEGRAM_CHANNEL}
      `,
      sms: `NEW ORDER: ${orderSummary.carTitle} - ${orderSummary.amount}. Customer: ${order.customerInfo.name} (${order.customerInfo.phone}). Payment: ${order.paymentMethod}`
    },
    
    order_cancelled: {
      subject: `❌ Order Cancelled - ${orderSummary.carTitle}`,
      email: `
        <h2>Order Cancelled</h2>
        <div style="background: #ffebee; padding: 20px; border-radius: 8px;">
          <p><strong>Order #${orderSummary.orderNumber}</strong> for <strong>${orderSummary.carTitle}</strong> has been cancelled.</p>
          <p>Customer: ${order.customerInfo.name} (${order.customerInfo.phone})</p>
          <p>The car is now available again for sale.</p>
        </div>
      `,
      telegram: `❌ <b>ORDER CANCELLED</b>

Order #${orderSummary.orderNumber} - ${orderSummary.carTitle}
Customer: ${order.customerInfo.name}

Car is now available again.`,
      sms: `ORDER CANCELLED: ${orderSummary.carTitle} by ${order.customerInfo.name}. Car now available.`
    }
  };
  
  return messages[type] || messages.new_order;
};

/**
 * Main notification function
 */
const sendNotification = async ({ type, order, car }) => {
  try {
    const messages = formatOrderMessage(type, order, car);
    
    // Send all notification types concurrently
    await Promise.allSettled([
      sendEmailNotification(messages.subject, messages.email),
      sendTelegramNotification(messages.telegram),
      sendSMSNotification(messages.sms)
    ]);
    
    console.log(`All notifications sent for ${type}`);
    
  } catch (error) {
    console.error('Send notification error:', error);
  }
};

module.exports = {
  sendNotification,
  sendEmailNotification,
  sendTelegramNotification,
  sendSMSNotification
};