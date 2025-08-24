const express = require('express');
const multer = require('multer');
const productController = require('../controllers/product.controller');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', productController.getAll);
router.get('/search', productController.searchProducts);
router.get('/category', productController.getProductsByCategory);
router.get('/:id', productController.getById);
router.post('/upload-image', upload.single('productImage'), productController.uploadImages);
router.post('/', productController.create);
router.put('/:id', productController.update);

module.exports = router;
