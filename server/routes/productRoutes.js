const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect, isSeller } = require('../middleware/authMiddleware');
const { uploadProductFiles } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/seller/my-products', protect, isSeller, getMyProducts);
router.get('/:id', getProduct);
router.post('/', protect, isSeller, uploadProductFiles, createProduct);
router.put('/:id', protect, isSeller, uploadProductFiles, updateProduct);
router.delete('/:id', protect, isSeller, deleteProduct);

module.exports = router;
