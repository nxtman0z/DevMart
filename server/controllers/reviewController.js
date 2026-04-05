const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Post a review
// @route   POST /api/reviews/:productId
exports.createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check buyer purchased this product
    const hasPurchased = await Order.findOne({
      buyer: req.user._id,
      product: productId,
      status: 'completed',
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'You must purchase this product to review it' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      buyer: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      buyer: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Update product average rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    await review.populate('buyer', 'name avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};
