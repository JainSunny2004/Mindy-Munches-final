// Production-ready email service using Brevo API only
// Works perfectly on Render, Vercel, Netlify, and all cloud platforms

const SibApiV3Sdk = require('@sendinblue/client');

console.log('🔍 Checking Brevo email service configuration...');
console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Present ✅' : 'Missing ❌');
console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'Not configured');

// Initialize Brevo API
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

if (process.env.BREVO_API_KEY) {
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  console.log('✅ Brevo API initialized successfully');
  console.log('📊 Service limits: 300 emails/day FREE');
  console.log('🌐 Cloud compatible: Render, Vercel, Netlify, AWS, etc.');
} else {
  console.error('❌ Brevo API key missing - email services will fail');
  console.error('💡 Add BREVO_API_KEY to your environment variables');
}

// Core email sending function
const sendEmail = async (to, subject, htmlContent, senderName = 'Mindy Munchs') => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key not configured. Add BREVO_API_KEY to environment variables.');
    }

    if (!to || !subject || !htmlContent) {
      throw new Error('Missing required email parameters: to, subject, or htmlContent');
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = htmlContent.replace(/<[^>]*>/g, ''); // Strip HTML for text version
    sendSmtpEmail.sender = { 
      name: senderName, 
      email: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'noreply@mindymunchs.com'
    };
    sendSmtpEmail.to = [{ email: to }];

    console.log(`📧 Sending email via Brevo API to ${to}`);
    console.log(`📬 Subject: ${subject}`);
    console.log(`👤 From: ${sendSmtpEmail.sender.name} <${sendSmtpEmail.sender.email}>`);

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully via Brevo to ${to}`);
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email via Brevo to ${to}:`);
    console.error('Error details:', error.response?.body || error.message);
    
    // Provide helpful error messages
    if (error.message?.includes('API key')) {
      console.error('💡 Solution: Get your API key from https://app.brevo.com/settings/keys/api');
    } else if (error.response?.status === 401) {
      console.error('💡 Solution: Check your BREVO_API_KEY - it might be invalid');
    } else if (error.response?.status === 402) {
      console.error('💡 Solution: You may have exceeded your daily email limit (300/day free)');
    }
    
    throw error;
  }
};

// Welcome Email - Beautiful and professional
exports.sendWelcomeEmail = async (email, name) => {
  const subject = '🎉 Welcome to Mindy Munchs Family!';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Mindy Munchs! 🎉</h1>
      </div>
      <div style="padding: 40px 20px; background: white; margin: 0 20px;">
        <h2 style="color: #333; margin-top: 0;">Hello ${name}! 👋</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for joining the Mindy Munchs family! We're thrilled to have you on board.
        </p>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #667eea; margin-top: 0;">🌟 What makes us special:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>Premium quality Indian snacks and sattu products</li>
            <li>Fresh, authentic flavors delivered to your doorstep</li>
            <li>Nutritious and delicious options for healthy living</li>
            <li>Fast delivery across India</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.FRONTEND_URL}/products" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            🛍️ Start Shopping Now
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 40px; text-align: center;">
          Questions? Reply to this email or contact us at 
          <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea;">
            ${process.env.EMAIL_USER}
          </a>
        </p>
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2025 Mindy Munchs. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
  console.log(`✅ Welcome email sent to ${email}`);
};

// Order Confirmation Email
exports.sendOrderConfirmation = async (email, orderDetails) => {
  const { orderId, items, totalAmount, shippingAddress } = orderDetails;
  const subject = `🎯 Order Confirmed #${orderId} - Mindy Munchs`;
  
  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px; text-align: left;">
        <div>
          <strong>${item.name}</strong><br>
          <small style="color: #666;">Qty: ${item.quantity}</small>
        </div>
      </td>
      <td style="padding: 15px; text-align: right; font-weight: bold;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Order Confirmed! 🎯</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Order #${orderId}</p>
      </div>
      <div style="padding: 40px 20px; background: white; margin: 0 20px;">
        <p style="font-size: 16px; margin-bottom: 25px; color: #555;">
          Thank you for your order! We're preparing your delicious Mindy Munchs products for delivery.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #28a745; margin-top: 0; margin-bottom: 20px;">📦 Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr style="background: #e9f7ef;">
              <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">
                Total Amount:
              </td>
              <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #28a745;">
                ₹${totalAmount.toLocaleString('en-IN')}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #28a745; margin-top: 0;">🚚 Delivery Address</h3>
          <p style="margin: 10px 0; line-height: 1.8; color: #555;">
            <strong>${shippingAddress.name}</strong><br>
            ${shippingAddress.street}<br>
            ${shippingAddress.city}, ${shippingAddress.state}<br>
            ${shippingAddress.zipCode}, ${shippingAddress.country}<br>
            📞 Phone: ${shippingAddress.phone}
          </p>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2025 Mindy Munchs. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
  console.log(`✅ Order confirmation sent to ${email} for order ${orderId}`);
};

// Password Reset Email
exports.sendPasswordReset = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = '🔐 Reset Your Mindy Munchs Password';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">Password Reset Request 🔐</h1>
      </div>
      <div style="padding: 40px 20px; background: white; margin: 0 20px;">
        <p style="font-size: 16px; margin-bottom: 25px; color: #555;">
          We received a request to reset your Mindy Munchs account password.
        </p>
        
        <div style="background: #fff5f5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff6b6b;">
          <h3 style="color: #ff6b6b; margin-top: 0;">🔗 Reset Your Password</h3>
          <p style="margin-bottom: 20px; color: #555;">
            Click the button below to create a new password. This link will expire in 1 hour for security.
          </p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              🔐 Reset Password
            </a>
          </div>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2025 Mindy Munchs. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
  console.log(`✅ Password reset email sent to ${email}`);
};

// Newsletter Email
exports.sendNewsletterEmail = async (to, subject, htmlContent) => {
  await sendEmail(to, subject, htmlContent, 'Mindy Munchs Newsletter');
  console.log(`✅ Newsletter email sent to ${to}`);
};

// Export the core send function for testing
exports.sendEmail = sendEmail;
