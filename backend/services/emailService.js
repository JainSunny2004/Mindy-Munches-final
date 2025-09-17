const nodemailer = require('nodemailer');

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Email service configuration missing:');
    console.error('   - EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.error('   - EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing');
    console.error('Please check your .env file and restart the server.');
}

// Create transporter with error handling
const createTransporter = () => {
    try {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            },
            // Additional security options
            secure: true,
            port: 465,
            debug: false, // Set to true for debugging
            logger: false // Set to true for debugging
        });
    } catch (error) {
        console.error('Failed to create email transporter:', error);
        return null;
    }
};

const transporter = createTransporter();

// Test email connection with better error handling
const testConnection = async () => {
    if (!transporter) {
        console.error('❌ Email transporter not initialized');
        return false;
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.error('❌ Email credentials not configured');
        return false;
    }

    try {
        await transporter.verify();
        console.log('✅ Email service is ready to send emails');
        return true;
    } catch (error) {
        console.error('❌ Email service connection failed:');
        console.error('   Error Code:', error.code);
        console.error('   Error Message:', error.message);
        
        if (error.code === 'EAUTH') {
            console.error('\n🔧 Quick Fix:');
            console.error('   1. Check if EMAIL_USER and EMAIL_APP_PASSWORD are set in .env');
            console.error('   2. Make sure you\'re using Gmail App Password (16 digits), not regular password');
            console.error('   3. Enable 2-Factor Authentication on Gmail');
            console.error('   4. Generate new App Password: https://myaccount.google.com/apppasswords');
        }
        return false;
    }
};

// Initialize connection test
testConnection();

// Generic newsletter email function with validation
exports.sendNewsletterEmail = async (to, subject, htmlContent) => {
    if (!transporter) {
        throw new Error('Email service not properly configured');
    }

    try {
        const mailOptions = {
            from: `"Mindy Munchs Newsletter" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
        return result;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
        throw error;
    }
};

// New Product Notification Template
exports.sendNewProductNotification = async (subscriberEmail, product, unsubscribeToken) => {
    if (!transporter) {
        console.error('Email service not configured, skipping notification');
        return null;
    }

    try {
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Product Alert - Mindy Munches</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; text-align: center; padding: 30px 20px;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 New Product Alert!</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Fresh from Mindy Munches</p>
                    </div>
                    
                    <!-- Product Section -->
                    <div style="padding: 30px 20px;">
                        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                            <h2 style="margin-top: 0; margin-bottom: 15px; color: #2c5aa0; font-size: 24px;">${product.name}</h2>
                            
                            ${product.images && product.images[0] ? 
                                `<div style="text-align: center; margin-bottom: 20px;">
                                    <img src="${product.images[0].url}" 
                                         alt="${product.name}" 
                                         style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                                </div>` 
                                : ''
                            }
                            
                            <p style="font-size: 16px; margin-bottom: 20px; color: #555; line-height: 1.6;">
                                ${product.description}
                            </p>
                            
                            <!-- Price Section -->
                            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 2px solid #ff6b35;">
                                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #ff6b35;">
                                    ₹${product.price} 
                                    ${product.originalPrice && product.originalPrice > product.price ? 
                                        `<span style="text-decoration: line-through; color: #999; font-weight: normal; font-size: 18px; margin-left: 10px;">₹${product.originalPrice}</span>` : ''
                                    }
                                </p>
                                ${product.category ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Category: ${product.category}</p>` : ''}
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin-top: 25px;">
                                <a href="${process.env.FRONTEND_URL}/products/${product._id}" 
                                   style="background: linear-gradient(135deg, #ff6b35, #f7931e); 
                                          color: white; 
                                          padding: 15px 30px; 
                                          text-decoration: none; 
                                          border-radius: 25px; 
                                          font-weight: bold; 
                                          display: inline-block; 
                                          font-size: 16px;
                                          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);">
                                    🛒 Shop Now
                                </a>
                            </div>
                        </div>
                        
                        <!-- Additional Info -->
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                            <p style="margin: 0; font-size: 14px; color: #856404; text-align: center;">
                                <strong>🚚 Free delivery</strong> on orders above ₹500 | <strong>📦 Quick dispatch</strong> within 24 hours
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #2c3e50; color: white; padding: 30px 20px; text-align: center;">
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin: 0 0 10px 0; color: #ff6b35;">Mindy Munches</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Made with ❤️ in India</p>
                        </div>
                        
                        <div style="margin-bottom: 20px; font-size: 14px; opacity: 0.8;">
                            <p style="margin: 5px 0;">📍 Ghaziabad, Uttar Pradesh, India</p>
                            <p style="margin: 5px 0;">📧 Mindymunchs@gmail.com</p>
                        </div>
                        
                        <div style="border-top: 1px solid #34495e; padding-top: 20px; margin-top: 20px;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.8;">
                                Thank you for being part of the Mindy Munches family! 🙏
                            </p>
                            <div style="font-size: 12px; opacity: 0.7;">
                                <p style="margin: 0;">
                                    Don't want these emails? 
                                    <a href="${unsubscribeUrl}" 
                                       style="color: #ff6b35; text-decoration: underline;">
                                        Unsubscribe here
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"Mindy Munchs Newsletter" <${process.env.EMAIL_USER}>`,
            to: subscriberEmail,
            subject: `🎉 New Product: ${product.name} - Mindy Munches`,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ New product notification sent to ${subscriberEmail}`);
        return result;
    } catch (error) {
        console.error(`❌ Failed to send new product notification to ${subscriberEmail}:`, error);
        throw error;
    }
};

// Welcome Email Template
exports.sendWelcomeEmail = async (subscriberEmail, name, unsubscribeToken) => {
    if (!transporter) {
        console.error('Email service not configured, skipping welcome email');
        return null;
    }

    try {
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Mindy Munches Newsletter</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; text-align: center; padding: 40px 20px;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Welcome to Mindy Munches! 🎉</h1>
                        <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">
                            Hi ${name || 'there'}! You're now part of our healthy family
                        </p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #2c5aa0; margin-bottom: 20px;">Thank you for subscribing! 🙏</h2>
                            <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
                                You'll be the first to know about our latest healthy snacks, special offers, and wellness tips.
                            </p>
                        </div>
                        
                        <!-- Benefits -->
                        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                            <h3 style="color: #ff6b35; margin-top: 0; text-align: center;">What to Expect:</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0; font-size: 16px;">🆕 New product launches</li>
                                <li style="padding: 8px 0; font-size: 16px;">💰 Exclusive discounts & offers</li>
                                <li style="padding: 8px 0; font-size: 16px;">🥗 Health tips & recipes</li>
                                <li style="padding: 8px 0; font-size: 16px;">📦 Early access to limited editions</li>
                            </ul>
                        </div>
                        
                        <!-- CTA -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="font-size: 16px; margin-bottom: 20px;">Ready to start your healthy journey?</p>
                            <a href="${process.env.FRONTEND_URL}/products" 
                               style="background: linear-gradient(135deg, #ff6b35, #f7931e); 
                                      color: white; 
                                      padding: 15px 30px; 
                                      text-decoration: none; 
                                      border-radius: 25px; 
                                      font-weight: bold; 
                                      display: inline-block; 
                                      font-size: 16px;
                                      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);">
                                🛒 Explore Products
                            </a>
                        </div>
                        
                        <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #0c5460; font-size: 14px;">
                                <strong>Promise:</strong> We value your inbox and will never spam you. 
                                Only valuable content and genuine offers! 💯
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #2c3e50; color: white; padding: 30px 20px; text-align: center;">
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin: 0 0 10px 0; color: #ff6b35;">Mindy Munches</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Made with ❤️ in India</p>
                        </div>
                        
                        <div style="margin-bottom: 20px; font-size: 14px; opacity: 0.8;">
                            <p style="margin: 5px 0;">📍 Ghaziabad, Uttar Pradesh, India</p>
                            <p style="margin: 5px 0;">📧 Mindymunchs@gmail.com</p>
                        </div>
                        
                        <div style="border-top: 1px solid #34495e; padding-top: 20px; margin-top: 20px; font-size: 12px; opacity: 0.7;">
                            <p style="margin: 0;">
                                Don't want these emails? 
                                <a href="${unsubscribeUrl}" style="color: #ff6b35; text-decoration: underline;">
                                    Unsubscribe here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"Mindy Munchs Newsletter" <${process.env.EMAIL_USER}>`,
            to: subscriberEmail,
            subject: `Welcome to Mindy Munches Newsletter! 🎉`,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${subscriberEmail}`);
        return result;
    } catch (error) {
        console.error(`❌ Failed to send welcome email to ${subscriberEmail}:`, error);
        throw error;
    }
};

// Test email function
exports.sendTestEmail = async (to) => {
    if (!transporter) {
        throw new Error('Email service not configured');
    }

    try {
        const mailOptions = {
            from: `"Mindy Munchs Newsletter" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Test Email - Mindy Munches',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; text-align: center; padding: 30px; border-radius: 8px;">
                        <h2 style="margin: 0; color: white;">✅ Test Email Successful</h2>
                    </div>
                    <div style="padding: 20px; background: #f8f9fa; margin-top: 20px; border-radius: 8px;">
                        <p style="font-size: 16px; margin-bottom: 15px;">This is a test email from Mindy Munches newsletter service.</p>
                        <p style="font-size: 16px; margin-bottom: 15px;"><strong>If you received this, the email service is working correctly!</strong></p>
                        <p style="font-size: 14px; color: #666; margin: 0;">Timestamp: ${new Date().toISOString()}</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Test email sent successfully to ${to}`);
        return result;
    } catch (error) {
        console.error(`❌ Test email failed for ${to}:`, error);
        throw error;
    }
};

// Bulk newsletter sending function
exports.sendBulkNewsletter = async (subscribers, subject, htmlContent) => {
    if (!transporter) {
        throw new Error('Email service not configured');
    }

    try {
        const results = [];
        const batchSize = 10; // Send in batches to avoid rate limiting
        
        console.log(`📧 Starting bulk email to ${subscribers.length} subscribers`);
        
        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (subscriber) => {
                try {
                    const result = await exports.sendNewsletterEmail(subscriber.email, subject, htmlContent);
                    return { email: subscriber.email, success: true, result };
                } catch (error) {
                    console.error(`❌ Failed to send to ${subscriber.email}:`, error);
                    return { email: subscriber.email, success: false, error: error.message };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            console.log(`📫 Batch ${Math.floor(i/batchSize) + 1} completed`);
            
            // Add delay between batches to avoid rate limiting
            if (i + batchSize < subscribers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log(`✅ Bulk email completed: ${successful} successful, ${failed} failed`);
        return { successful, failed, results };
    } catch (error) {
        console.error('❌ Bulk email sending failed:', error);
        throw error;
    }
};

// Health check function
exports.checkEmailHealth = async () => {
    return await testConnection();
};
