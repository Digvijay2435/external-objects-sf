const productModel = require('../models/product.model');

const productService = {
    getAll: () => {
        return productModel.find();
    },
    getById: (id) => {
        return productModel.findById(id);
    },
    create: (data) => {
        const productData = new productModel(data);
        return productData.save();
    },
    update: (productId, data) => {
        return productModel.findByIdAndUpdate(productId, { $set: data }, { new: true });
    },
    getProductsByCategory: (categoryName, limit) => {
        return productModel.aggregate([
            {
                $match: {
                    rating: { $gt: 4 },
                    category: categoryName
                }
            },
            { $limit: limit }
        ]);
    },
    getProductsCount: (input) => {
        return productModel.countDocuments({
            $or: [
              { name: input },
              { category: input },
              { brand: input },
              { features: { $in: [input] } }
            ]
          });
    },
    search: (input) => {
        return productModel.find({
            $or: [
              { name: input },
              { category: input },
              { brand: input },
              { features: { $in: [input] } }
            ]
          });
    }
}

module.exports = productService;
