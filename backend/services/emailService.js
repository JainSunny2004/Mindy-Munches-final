// Production-ready email service using Brevo API only
const SibApiV3Sdk = require('@sendinblue/client');

console.log('🔍 Checking Brevo email service configuration...');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Present ✅' : 'Missing ❌');

// Initialize Brevo API
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
if (process.env.BREVO_API_KEY) {
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  console.log('✅ Brevo API initialized successfully');
} else {
  console.error('❌ Brevo API key missing - add BREVO_API_KEY to .env');
}

// Core email sending function
const sendEmail = async (to, subject, htmlContent, senderName = 'Mindy Munchs') => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured. Add BREVO_API_KEY to environment variables.');
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = htmlContent.replace(/<[^>]*>/g, '');
    sendSmtpEmail.sender = { 
      name: senderName, 
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@mindymunchs.com' 
    };
    sendSmtpEmail.to = [{ email: to }];

    console.log(`📧 Sending email via Brevo API to ${to}`);
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully via Brevo to ${to}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email via Brevo to ${to}:`, error.response?.body || error.message);
    throw error;
  }
};

// Welcome Email for Newsletter Subscribers
exports.sendWelcomeEmail = async (email, name = 'Valued Customer') => {
  const subject = '🎉 Welcome to Mindy Munchs Family!';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f8f9fa; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Mindy Munchs!</h1>
        </div>
        <div class="content">
          <h2>Thank you for joining our family, ${name}!</h2>
          <p>We're thrilled to have you as part of the Mindy Munchs community. You'll be the first to know about:</p>
          <ul>
            <li>🍿 New product launches</li>
            <li>🎉 Exclusive offers and discounts</li>
            <li>📰 Health tips and recipes</li>
            <li>🌟 Special promotions</li>
          </ul>
          <p>Stay tuned for delicious updates!</p>
        </div>
        <div class="footer">
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
          <p><small>You received this email because you subscribed to our newsletter.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Newsletter Email
exports.sendNewsletterEmail = async (email, subject, htmlContent) => {
  return await sendEmail(email, subject, htmlContent);
};

// New Product Notification
exports.sendNewProductNotification = async (email, productData, name = 'Valued Customer') => {
  const subject = `🆕 Fresh arrival from Mindy Munchs: ${productData.name}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .product { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .price { color: #ff6b6b; font-size: 24px; font-weight: bold; }
        .original-price { text-decoration: line-through; color: #999; margin-left: 10px; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 New Product Alert!</h1>
          <h2>Hi ${name}!</h2>
        </div>
        <div class="product">
          <h2>${productData.name}</h2>
          ${productData.image ? `<img src="${productData.image}" alt="${productData.name}" style="max-width: 100%; height: auto; border-radius: 5px;">` : ''}
          <p>${productData.description || 'Discover the authentic taste and premium quality that makes this product special!'}</p>
          <div class="price">
            ₹${productData.price.toLocaleString('en-IN')}
            ${productData.originalPrice && productData.originalPrice > productData.price ? 
              `<span class="original-price">₹${productData.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          ${productData.category ? `<p><strong>Category:</strong> ${productData.category}</p>` : ''}
          <a href="${process.env.FRONTEND_URL}/product/${productData._id}" class="button">Shop Now</a>
        </div>
        <div class="footer">
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Order Confirmation Email
exports.sendOrderConfirmation = async (email, orderData) => {
  const subject = `Order Confirmation #${orderData.orderId} - Mindy Munchs`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .item { border-bottom: 1px solid #ddd; padding: 10px 0; }
        .total { background: #fff; padding: 15px; border-radius: 5px; margin: 10px 0; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! 🎉</h1>
        </div>
        <div class="order-details">
          <h2>Order #${orderData.orderId}</h2>
          <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString('en-IN')}</p>
          <p><strong>Delivery Address:</strong><br>${orderData.shippingAddress.address}<br>${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.pincode}</p>
          
          <h3>Order Items:</h3>
          ${orderData.items.map(item => `
            <div class="item">
              <strong>${item.name}</strong><br>
              Quantity: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}
            </div>
          `).join('')}
          
          <div class="total">
            <p>Total Amount: ₹${orderData.totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for shopping with Mindy Munchs!</p>
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

// Password Reset Email
exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Reset Your Mindy Munchs Password';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #f8f9fa; }
        .button { background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset your Mindy Munchs account password.</p>
          <p>Click the button below to create a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <p><strong>Security Note:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 Mindy Munchs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(email, subject, htmlContent);
};

module.exports = {
  sendWelcomeEmail: exports.sendWelcomeEmail,
  sendNewsletterEmail: exports.sendNewsletterEmail,
  sendNewProductNotification: exports.sendNewProductNotification,
  sendOrderConfirmation: exports.sendOrderConfirmation,
  sendPasswordResetEmail: exports.sendPasswordResetEmail
};
