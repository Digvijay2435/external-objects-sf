const cloudinary = require('cloudinary').v2;
const productService = require('../services/product.service');

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
    }

    const product = await productService.search(searchInput)
        .skip(pageIndex * pageSize)
        .limit(pageSize);

    if (!product?.length > 0) {
        return;
    }

    return {
        message : "Succefully retrived the products !!",
        data : product,
        metadata : metadata
    }

}

const productController = {
    getAll: async (request, response) => {
        try {
            const productData = await productService.getAll();
            response.status(200);
            response.send({
                message: "Products retrived successfully !!",
                data: productData
            });
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to retirved all products",
                error: error
            });
        }
    },
    getById: async (request, response) => {
        try {
            const productData = await productService.getById(request.params.id);
            response.status(200);
            response.send({
                message: "Product data retrieved successfully !!",
                data: productData
            });
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to retrieve product",
                error: error
            });
        }
    },
    create: async (request, response) => {
        try {
            const productData = await productService.create(request.body);
            response.status(201);
            response.send({
                message: "Product Created.",
                data: productData
            });
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to create product",
                error: error
            });
        }
    },
    update: async (request, response) => {
        try {
            const productData = await productService.update(request.params.id, request.body);
            response.status(201);
            response.send({
                message: "Product data updated !!",
                data: productData
            });
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to update the product data !!",
                error: error
            });
        }
    },
    uploadImages: async (request, response) => {
        try {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                async (error, result) => {
                    if (error) {
                        response.status(500);
                        response.send({
                            message: "Unable to upload image",
                            error: "Error - Cloudinary"
                        });
                    } else {
                        console.log('result -> ' + result.secure_url);
                        const productData = await productService.getById(request.body.productId);
                        productData["imageUrl"] = result.secure_url

                        const updatedProductData = await productService.update(request.body.productId, productData);
                        response.status(200);
                        response.send({
                            message: "Product Image Uploaded Successfully",
                            data: updatedProductData
                        });
                    }
                }
            );
            stream.end(request.file.buffer);
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to upload image",
                error: error
            });
        }
    },
    getProductsByCategory: async (request, response) => {
        try {

            const { name, limit } = request.query;
            const productData = await productService.getProductsByCategory(name, parseInt(limit));
            response.status(200);
            response.send({
                message: "Products retrieved succesfully !!",
                data: productData
            });
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to retireve products",
                error: error
            });
        }
    },
    searchProducts : async (request, response) => {
        try {
            const { pageIndex, pageSize, input } = request.query;
            const searchInput = new RegExp(input, "i");
            const result = await searchProducts(pageIndex, pageSize, searchInput);
            if(!result){
                response.status(404).send({
                    message : `We couldn't find any products for '${input}'.`
                });
                return;
            }

            response.status(200).send(result);
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to find the products !!",
                error: error
            });
        }
    },
    searchProductsByCategory: async (request, response) => {
        try {
            const { pageIndex, pageSize, input } = request.query;
            const searchInput = { category: { $regex: new RegExp(input, "i") } }
            const result = await searchProducts(pageIndex, pageSize, searchInput);
            if(!result){
                return;
            }

            response.status(200).send(result);
        } catch (error) {
            response.status(500);
            response.send({
                message: "Unable to update the product data.",
                error: error
            });
        }
    }
}


module.exports = productController;
