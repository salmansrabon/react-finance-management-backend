// models/cost.js
const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;
