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
      email: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'noreply@mindymunchs.com'
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

// Welcome Email
exports.sendWelcomeEmail = async (email, name) => {
  const subject = '🎉 Welcome to Mindy Munchs Family!';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Mindy Munchs! 🎉</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333;">Hello ${name}! 👋</h2>
        <p style="font-size: 16px; color: #555;">Thank you for joining the Mindy Munchs family!</p>
      </div>
    </div>
  `;
  await sendEmail(email, subject, htmlContent);
};

// Password Reset Email - THIS IS THE MISSING FUNCTION!
exports.sendPasswordReset = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = '🔐 Reset Your Mindy Munchs Password';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset Request 🔐</h1>
      </div>
      <div style="padding: 40px 20px; background: white;">
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your Mindy Munchs account password.
        </p>
        
        <div style="background: #fff5f5; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #ff6b6b;">🔗 Reset Your Password</h3>
          <p style="color: #555;">Click the button below to create a new password. This link will expire in 1 hour.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              🔐 Reset Password
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
  console.log(`✅ Password reset email sent to ${email}`);
};

// New Product Notification Email
exports.sendNewProductNotification = async (email, productData, userName = 'Valued Customer') => {
  const subject = `🎉 New Product Launch: ${productData.name} - Mindy Munchs`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">🎉 New Product Alert!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Fresh arrival from Mindy Munchs</p>
      </div>
      
      <div style="padding: 40px 20px; background: white;">
        <h2 style="color: #333; margin-top: 0;">Hello ${userName}! 👋</h2>
        <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
          We're excited to introduce our newest addition to the Mindy Munchs family:
        </p>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border-left: 5px solid #28a745;">
          ${productData.images && productData.images[0] ? 
            `<img src="${productData.images[0].url || productData.images[0]}" alt="${productData.name}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">` : 
            ''
          }
          
          <h3 style="color: #28a745; margin: 0 0 15px 0; font-size: 24px;">${productData.name}</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #28a745;">
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #28a745;">
              ₹${productData.price.toLocaleString('en-IN')}
              ${productData.originalPrice && productData.originalPrice > productData.price ? 
                `<span style="text-decoration: line-through; color: #999; font-weight: normal; font-size: 18px; margin-left: 10px;">₹${productData.originalPrice.toLocaleString('en-IN')}</span>` : 
                ''
              }
            </p>
            ${productData.category ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Category: ${productData.category}</p>` : ''}
          </div>
          
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 20px 0;">
            ${productData.description || 'Discover the authentic taste and premium quality that makes this product special!'}
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL}/products/${productData._id || productData.id}" 
             style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);">
            🛍️ Shop Now
          </a>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px;">
        <p style="margin: 0 0 10px 0;">© 2025 Mindy Munchs. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
  console.log(`✅ New product notification sent to ${email} for product: ${productData.name}`);
};

// Alternative function name (in case your auth controller uses this name)
exports.sendPasswordResetEmail = async (email, resetToken) => {
  return await exports.sendPasswordReset(email, resetToken);
};

// Order Confirmation Email
exports.sendOrderConfirmation = async (email, orderDetails) => {
  // ... (add if needed)
};

// Newsletter Email (keep your existing one)
exports.sendNewsletterEmail = async (to, subject, htmlContent) => {
  await sendEmail(to, subject, htmlContent, 'Mindy Munchs Newsletter');
};
