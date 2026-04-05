const express = require('express');
const {
  createOrder,
  verifyOrder,
  getMyPurchases,
  getSellerSales,
} = require('../controllers/orderController');
const { protect, isSeller } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyOrder);
router.get('/my-purchases', protect, getMyPurchases);
router.get('/seller/sales', protect, isSeller, getSellerSales);

module.exports = router;
