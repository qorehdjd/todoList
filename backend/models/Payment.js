const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
  paymentKey: String,
  orderId: String,
  userId: String,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
