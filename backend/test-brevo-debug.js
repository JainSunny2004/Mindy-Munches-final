require('dotenv').config();
const SibApiV3Sdk = require('@sendinblue/client');

async function debugBrevoEmail() {
  console.log('🔍 Debugging Brevo email...');
  console.log('API Key:', process.env.BREVO_API_KEY ? 'Present' : 'Missing');
  
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ No Brevo API key found in .env');
    return;
  }

  try {
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "🧪 Brevo Debug Test - " + new Date().toLocaleTimeString();
    sendSmtpEmail.htmlContent = `
      <h2>🎯 Brevo Debug Test</h2>
      <p>If you receive this email, Brevo is working!</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>API Status:</strong> ✅ Working</p>
    `;
    sendSmtpEmail.sender = { 
      name: "Mindy Munchs Debug", 
      email: process.env.EMAIL_USER || "prathamksrivastav.work@gmail.com"
    };
    sendSmtpEmail.to = [{ email: "prathamksrivastav.work@gmail.com" }];

    console.log('📧 Sending debug email...');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Debug email sent successfully!');
    console.log('📊 Brevo Response:', JSON.stringify(result.response?.data || result, null, 2));
    console.log('📧 Check your email (including spam folder)');

  } catch (error) {
    console.error('❌ Brevo Debug Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.body || error.message);
    
    if (error.response?.status === 401) {
      console.error('💡 Fix: Check your BREVO_API_KEY - it might be invalid');
    } else if (error.response?.status === 400) {
      console.error('💡 Fix: Check sender email authorization in Brevo dashboard');
    }
  }
}

debugBrevoEmail();
