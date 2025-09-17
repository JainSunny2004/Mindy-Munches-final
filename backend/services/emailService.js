const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Newsletter email function
exports.sendNewsletterEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: '"Mindy Munchs Newsletter" <' + process.env.EMAIL_USER + '>',
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Product Alert - Mindy Munches</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 200px; height: auto; }
        .product-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .product-image { width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 8px; }
        .price { font-size: 24px; color: #e67e22; font-weight: bold; }
        .original-price { text-decoration: line-through; color: #999; margin-left: 10px; }
        .btn { display: inline-block; padding: 12px 30px; background: #e67e22; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .unsubscribe { margin-top: 20px; font-size: 11px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${process.env.FRONTEND_URL}/Mindy_Munches_Logo-01.png" alt="Mindy Munches" class="logo">
          <h2>🎉 Exciting News! New Product Alert</h2>
        </div>
        
        <div class="product-card">
          <img src="${process.env.FRONTEND_URL}${product.images?.url || '/placeholder-image.jpg'}" alt="${product.name}" class="product-image">
          
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          
          <div class="price">
            ₹${product.price}
            ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
          </div>
          
          ${product.isOrganic ? '<span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">🌱 ORGANIC</span>' : ''}
          
          <br>
          <a href="${process.env.FRONTEND_URL}/product/${product._id}" class="btn">Shop Now</a>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p>Thank you for being part of the Mindy Munches family!</p>
          <p>Made with ❤️ in India</p>
        </div>
        
        <div class="footer">
          <p><strong>Mindy Munches</strong></p>
          <p>Ghaziabad, Uttar Pradesh, India</p>
          <p>Email: Mindymunchs@gmail.com</p>
        </div>
        
        <div class="unsubscribe">
          <p>Don't want to receive these updates? <a href="${unsubscribeUrl}">Unsubscribe here</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  await this.sendNewsletterEmail(subscriberEmail, `🆕 New Product: ${product.name} - Mindy Munches`, htmlContent);
};

// Existing reset password function
exports.sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Click the link below to reset your password: ${resetUrl}\n\nThe link is valid for 15 minutes.`
  };
  await transporter.sendMail(mailOptions);
};
