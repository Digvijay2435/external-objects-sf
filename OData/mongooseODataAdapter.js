const productService = require('./services/product.service');

const mongooseODataAdapter = () => ({
  find: async (entitySetName, cb) => {
    try {
      if (entitySetName === 'Products') {
        const products = await productService.getAll();
        cb(null, products);
      } else {
        cb(null, []);
      }
    } catch (err) {
      cb(err);
    }
  },
  findOne: async (entitySetName, key, cb) => {
    try {
      if (entitySetName === 'Products') {
        const product = await productService.getById(key);
        cb(null, product);
      } else {
        cb(null, null);
      }
    } catch (err) {
      cb(err);
    }
  },

  insert: async (entitySetName, data, cb) => {
    try {
      if (entitySetName === 'Products') {
        const newProduct = await productService.create(data);
        cb(null, newProduct);
      } else {
        cb(new Error('Entity not found'), null);
      }
    } catch (err) {
      cb(err, null);
    }
  },
  
  update: async (entitySetName, key, data, cb) => {
    try {
      if (entitySetName === 'Products') {
        const updatedProduct = await productService.update(key, data);
        cb(null, updatedProduct);
      } else {
        cb(new Error('Entity not found'), null);
      }
    } catch (err) {
      cb(err, null);
    }
  },

});

module.exports = mongooseODataAdapter;
