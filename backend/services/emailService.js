const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({ // FIXED: createTransport, not createTransporter
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Newsletter email function
exports.sendNewsletterEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Mindy Munchs Newsletter" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent
  };
  await transporter.sendMail(mailOptions);
};

// New Product Notification Template
exports.sendNewProductNotification = async (subscriberEmail, product, unsubscribeToken) => {
  const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #e67e22;">New Product Alert!</h2>
      </div>
      
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">${product.name}</h3>
        <p style="color: #666; line-height: 1.6;">${product.description}</p>
        
        <div style="margin: 20px 0;">
          <span style="font-size: 24px; color: #e67e22; font-weight: bold;">₹${product.price}</span>
          ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; margin-left: 10px;">₹${product.originalPrice}</span>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/product/${product._id}" 
             style="background: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Shop Now
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0; color: #666;">
        <p>Thank you for being part of the Mindy Munches family!</p>
        <p style="font-size: 14px;">Made with love in India</p>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
        <p><strong>Mindy Munches</strong></p>
        <p>Ghaziabad, Uttar Pradesh, India</p>
        <p>Email: Mindymunchs@gmail.com</p>
        <p><a href="${unsubscribeUrl}" style="color: #999;">Don't want to receive these updates? Unsubscribe here</a></p>
      </div>
    </div>
  `;

  await this.sendNewsletterEmail(subscriberEmail, `New Product: ${product.name}`, htmlContent);
};

// Send welcome email to new subscribers
exports.sendWelcomeEmail = async (subscriberEmail, name) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #e67e22;">Welcome to Mindy Munches!</h2>
      </div>
      
      <div style="padding: 20px;">
        <p>Hi ${name || 'there'}!</p>
        
        <p>Thank you for subscribing to our newsletter! You'll be the first to know about:</p>
        
        <ul style="color: #666; line-height: 1.8;">
          <li>🆕 New product launches</li>
          <li>💰 Exclusive discounts and offers</li>
          <li>🌿 Health and wellness tips</li>
          <li>📚 Organic food guides</li>
        </ul>
        
        <p>We promise to send only valuable content and never spam your inbox.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background: #e67e22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Start Shopping
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0; color: #666;">
        <p>Welcome to the healthy lifestyle journey!</p>
        <p style="font-size: 14px;">Made with love in India</p>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
        <p><strong>Mindy Munches</strong></p>
        <p>Ghaziabad, Uttar Pradesh, India</p>
        <p>Email: Mindymunchs@gmail.com</p>
      </div>
    </div>
  `;

  await this.sendNewsletterEmail(subscriberEmail, 'Welcome to Mindy Munches Newsletter! 🌿', htmlContent);
};
