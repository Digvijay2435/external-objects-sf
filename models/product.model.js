const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD'],
    default: 'USD'
  },
  stock_quantity: {
    type: Number,
    required: true
  },
  colors_available: {
    type: [String],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews_count: {
    type: Number,
    default: 0
  },
  features: [
    {
      type: String,
      required: true
    }
  ]
});

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;

