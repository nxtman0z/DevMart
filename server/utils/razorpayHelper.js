const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (amount, receiptId) => {
  const options = {
    amount: amount * 100, // Razorpay expects paise
    currency: 'INR',
    receipt: receiptId,
  };
  return await razorpayInstance.orders.create(options);
};

const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

module.exports = { razorpayInstance, createRazorpayOrder, verifyPaymentSignature };
