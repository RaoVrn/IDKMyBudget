const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  recurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' }
});

module.exports = mongoose.model('Income', incomeSchema);