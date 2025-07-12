const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  date: { type: Date, default: Date.now },
  method: { type: String, default: 'online' }
});

module.exports = mongoose.model('Payment', paymentSchema);
