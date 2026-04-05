const Order = require('../models/Order');
const Product = require('../models/Product');
const { createRazorpayOrder, verifyPaymentSignature } = require('../utils/razorpayHelper');

// @desc    Create Razorpay order
// @route   POST /api/orders/create
exports.createOrder = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    // Check if user already purchased
    const existingOrder = await Order.findOne({
      buyer: req.user._id,
      product: productId,
      status: 'completed',
    });

    if (existingOrder) {
      return res.status(400).json({ message: 'You have already purchased this product' });
    }

    // Can't buy own product
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot buy your own product' });
    }

    const receiptId = `order_${Date.now()}_${req.user._id}`;
    const razorpayOrder = await createRazorpayOrder(product.price, receiptId);

    // Create pending order
    const order = await Order.create({
      buyer: req.user._id,
      product: product._id,
      seller: product.seller,
      amount: product.price,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    });

    res.json({
      success: true,
      order: {
        id: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        productTitle: product.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and complete order
// @route   POST /api/orders/verify
exports.verifyOrder = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      await Order.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed' }
      );
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        status: 'completed',
      },
      { new: true }
    ).populate('product', 'title productFile');

    // Increment total sales
    await Product.findByIdAndUpdate(order.product._id, {
      $inc: { totalSales: 1 },
    });

    res.json({
      success: true,
      order,
      downloadUrl: order.product.productFile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer's purchases
// @route   GET /api/orders/my-purchases
exports.getMyPurchases = async (req, res, next) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
      status: 'completed',
    })
      .populate('product', 'title previewImages price category productFile')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller's sales
// @route   GET /api/orders/seller/sales
exports.getSellerSales = async (req, res, next) => {
  try {
    const orders = await Order.find({
      seller: req.user._id,
      status: 'completed',
    })
      .populate('product', 'title previewImages price category')
      .populate('buyer', 'name email avatar')
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalSales = orders.length;

    // Revenue for last 30 days (daily breakdown)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          seller: req.user._id,
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      orders,
      stats: {
        totalRevenue,
        totalSales,
        dailyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
