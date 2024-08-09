const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentKey: String,
  orderId: String,
  userId: String,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
