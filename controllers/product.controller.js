// controllers/product.controller.js

const cloudinary = require('cloudinary').v2;
const { productService } = require('../services/product.service');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function searchProducts(pageIndex, pageSize, searchInput) {
  const noOfDocuments = await productService.getProductsCount(searchInput);

  const metadata = {
    noOfPages: Math.ceil(noOfDocuments / pageSize),
    hasNext: Math.ceil(noOfDocuments / pageSize) > parseInt(pageIndex) + 1,
    hasPrevious: pageIndex > 0,
  };

  const product = await productService.search(searchInput);
  const paginated = product.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  if (!paginated.length) {
    return;
  }

  return {
    message: "Successfully retrieved the products !!",
    data: paginated,
    metadata: metadata,
  };
}

const productController = {
  getAll: async (req, res) => {
    try {
      const data = await productService.getAll();
      res.status(200).send({ message: "Products retrieved successfully !!", data });
    } catch (error) {
      res.status(500).send({ message: "Unable to retrieve all products", error });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await productService.getById(req.params.id);
      res.status(200).send({ message: "Product data retrieved successfully !!", data });
    } catch (error) {
      res.status(500).send({ message: "Unable to retrieve product", error });
    }
  },

  create: async (req, res) => {
    try {
      const data = await productService.create(req.body);
      res.status(201).send({ message: "Product Created.", data });
    } catch (error) {
      res.status(500).send({ message: "Unable to create product", error });
    }
  },

  update: async (req, res) => {
    try {
      const data = await productService.update(req.params.id, req.body);
      res.status(201).send({ message: "Product data updated !!", data });
    } catch (error) {
      res.status(500).send({ message: "Unable to update product data !!", error });
    }
  },

  uploadImages: async (req, res) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            return res.status(500).send({ message: "Unable to upload image", error: 'Error - Cloudinary' });
          }
          const productData = await productService.getById(req.body.productId);
          productData.imageUrl = result.secure_url;
          const updatedProductData = await productService.update(req.body.productId, productData);
          res.status(200).send({ message: "Product Image Uploaded Successfully", data: updatedProductData });
        }
      );
      stream.end(req.file.buffer);
    } catch (error) {
      res.status(500).send({ message: "Unable to upload image", error });
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { name, limit } = req.query;
      const data = await productService.getProductsByCategory(name, limit);
      res.status(200).send({ message: "Products retrieved successfully !!", data });
    } catch (error) {
      res.status(500).send({ message: "Unable to retrieve products", error });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { pageIndex, pageSize, input } = req.query;
      const regInput = new RegExp(input, "i");
      const result = await searchProducts(parseInt(pageIndex), parseInt(pageSize), regInput);
      if (!result) {
        return res.status(404).send({ message: `We couldn't find any products for '${input}'.` });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Unable to find the products !!", error });
    }
  },

  searchProductsByCategory: async (req, res) => {
    try {
      const { pageIndex, pageSize, input } = req.query;
      const searchInput = { category: { $regex: new RegExp(input, "i") } };
      const result = await searchProducts(parseInt(pageIndex), parseInt(pageSize), searchInput);
      if (!result) {
        return res.status(404).send({ message: `No products found for category '${input}'.` });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Unable to update the product data.", error });
    }
  }
};

module.exports = productController;
