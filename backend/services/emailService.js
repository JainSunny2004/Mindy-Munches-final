const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'prathamksrivastav.work@gmail.com',
    pass: 'crhk vzgm kqph jbpz'
  }
});

exports.sendPasswordResetEmail = async (to, resetURL) => {
  const mailOptions = {
    from: '"Mindy Munchs" <prathamksrivastav.work@gmail.com>', // <-- CHANGE THIS LINE
    to: to,
    subject: 'Mindy Munchs Password Reset',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">Reset Link</a> // <-- CHANGE THIS LINE
      <p>The link is valid for 15 minutes.</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

// Add this function for the newsletter
exports.sendNewsletterEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: '"Mindy Munchs Newsletter" <prathamksrivastav.work@gmail.com>', // <-- CHANGE THIS LINE
    to: to,
    subject: subject,
    html: htmlContent
  };
  await transporter.sendMail(mailOptions);
};