const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  amount: Number,
  userId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: 'pending' }, // 주문 상태 추가
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
