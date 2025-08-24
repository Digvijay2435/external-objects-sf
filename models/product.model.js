const Joi = require('joi');

const productValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  brand: Joi.string().required(),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR', 'AUD').default('USD'),
  stock_quantity: Joi.number().required(),
  colors_available: Joi.array().items(Joi.string()).required(),
  imageUrl: Joi.string().uri().required(),
  rating: Joi.number().default(0),
  reviews_count: Joi.number().default(0),
  features: Joi.array().items(Joi.string()).required()
});

const collectionName = 'products';

module.exports = {
  collectionName,
  productValidationSchema
};
