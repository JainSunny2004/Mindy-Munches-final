require('dotenv').config();
const axios = require('axios');

async function testSendPulseREST() {
  try {
    console.log('🔍 Testing SendPulse REST API...');
    console.log('API ID:', process.env.SENDPULSE_API_ID);
    console.log('FROM EMAIL:', process.env.SENDPULSE_FROM_EMAIL);

    // Step 1: Get access token
    console.log('📡 Getting access token...');
    const tokenResponse = await axios.post('https://api.sendpulse.com/oauth/access_token', {
      grant_type: 'client_credentials',
      client_id: process.env.SENDPULSE_API_ID,
      client_secret: process.env.SENDPULSE_API_SECRET
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Access token obtained successfully');

    // Step 2: Send test email via REST API
    console.log('📧 Sending test email via REST API...');
    
    const emailData = {
      email: {
        html: '<h2>🎉 REST API Test Success!</h2><p>SendPulse REST API integration is working perfectly!</p><p><strong>Test Details:</strong></p><ul><li>Method: REST API</li><li>Time: ' + new Date().toISOString() + '</li><li>Status: SUCCESS</li></ul>',
        text: 'SendPulse REST API test successful! Time: ' + new Date().toISOString(),
        subject: '🚀 SendPulse REST API Test - Success!',
        from: {
          name: 'Mindy Munchs Test',
          email: process.env.SENDPULSE_FROM_EMAIL
        },
        to: [{
          email: 'prathamnydocs@gmail.com'
        }]
      }
    };

    const sendResponse = await axios.post(
      'https://api.sendpulse.com/smtp/emails',
      emailData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Email sent successfully via REST API!');
    console.log('📊 Response:', sendResponse.data);

  } catch (error) {
    console.error('❌ REST API Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testSendPulseREST();
