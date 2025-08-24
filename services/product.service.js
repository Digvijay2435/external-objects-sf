const { ObjectId } = require('mongodb');
const { collectionName, productValidationSchema } = require('../models/product.model');

let productsCollection;

function init(db) {
  productsCollection = db.collection(collectionName);
}

const productService = {
  getAll: () => productsCollection.find().toArray(),

  getById: (id) => productsCollection.findOne({ _id: new ObjectId(id) }),

  create: async (data) => {
    const { error, value } = productValidationSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    const result = await productsCollection.insertOne(value);
    return result.ops[0];
  },

  update: async (id, data) => {
    const { error, value } = productValidationSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: value },
      { returnDocument: 'after' }
    );

    return result.value;
  },

  getProductsByCategory: (categoryName, limit) =>
    productsCollection.aggregate([
      { $match: { rating: { $gt: 4 }, category: categoryName } },
      { $limit: parseInt(limit, 10) }
    ]).toArray(),

  getProductsCount: (input) => {
    const query = {
      $or: [
        { name: input },
        { category: input },
        { brand: input },
        { features: { $in: [input] } }
      ]
    };
    return productsCollection.countDocuments(query);
  },

  search: (input) => {
    const query = {
      $or: [
        { name: input },
        { category: input },
        { brand: input },
        { features: { $in: [input] } }
      ]
    };
    return productsCollection.find(query).toArray();
  }
};

module.exports = {
  init,
  productService
};
