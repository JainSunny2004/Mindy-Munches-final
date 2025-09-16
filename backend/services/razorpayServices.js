const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: `$import.meta.env.VITE_RAZORPAY_KEY_ID`,
  key_secret: `$import.meta.env.RAZORPAY_KEY_SECRET`,
});

module.exports = razorpay;
