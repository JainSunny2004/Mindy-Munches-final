const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount, // amount in the smallest currency unit (paise)
      currency: currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ id: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Error creating order');
  }
};

exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is authentic, now update your database and fulfill the order
    console.log('Payment verified successfully. Order ID:', razorpay_order_id);
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    console.log('Payment verification failed.');
    res.status(400).json({ status: 'failure', message: 'Invalid signature' });
  }
};