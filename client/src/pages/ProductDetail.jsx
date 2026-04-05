import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiStar, HiDownload, HiShoppingCart, HiChevronLeft, HiChevronRight, HiUser } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';
import { productAPI, orderAPI, reviewAPI } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { formatCurrency, formatDate, getCategoryColor, getStarArray } from '../utils/helpers';
import Loader from '../components/common/Loader';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { hasPurchased, addPurchased } = useCartStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const isPurchased = hasPurchased(id);
  const isOwner = user && product && user._id === product.seller?._id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productAPI.getById(id),
          reviewAPI.getByProduct(id),
        ]);
        setProduct(productRes.data.product);
        setReviews(reviewsRes.data.reviews);

        // Fetch related
        if (productRes.data.product.category) {
          const relatedRes = await productAPI.getAll({
            category: productRes.data.product.category,
            limit: 4,
          });
          setRelated(relatedRes.data.products.filter((p) => p._id !== id));
        }
      } catch (err) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setCurrentImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  // Check purchase status
  useEffect(() => {
    const checkPurchase = async () => {
      if (!isAuthenticated) return;
      try {
        const { data } = await orderAPI.getMyPurchases();
        data.orders.forEach((order) => addPurchased(order.product._id));
      } catch {}
    };
    checkPurchase();
  }, [isAuthenticated]);

  const handleBuy = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      return;
    }

    setBuying(true);
    try {
      const { data } = await orderAPI.create(product._id);

      // Load Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'DevMart',
        description: data.order.productTitle,
        order_id: data.order.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await orderAPI.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            addPurchased(product._id);
            toast.success('Payment successful! You can now download the product.');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#7C3AED',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setBuying(false);
    }
  };

  const handleDownload = () => {
    if (product?.productFile) {
      window.open(product.productFile, '_blank');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const { data } = await reviewAPI.create(id, reviewForm);
      setReviews((prev) => [data.review, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="pt-24"><Loader size="lg" text="Loading product..." /></div>;
  if (!product) return <div className="pt-24 text-center text-muted">Product not found</div>;

  const images = product.previewImages?.length > 0
    ? product.previewImages
    : [`https://placehold.co/800x500/1A1A1A/7C3AED?text=${encodeURIComponent(product.title)}`];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          <div className="relative rounded-xl overflow-hidden bg-dark-surface border border-dark-border aspect-video">
            <img
              src={images[currentImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <HiChevronLeft />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <HiChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    currentImage === i ? 'border-primary' : 'border-dark-border hover:border-primary/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">About this product</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{product.description}</p>
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-dark-bg border border-dark-border text-xs text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Reviews ({reviews.length})
            </h2>

            {/* Review Form — only for purchasers */}
            {isPurchased && !isOwner && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-lg bg-dark-bg border border-dark-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-muted">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                        className={`text-lg ${star <= reviewForm.rating ? 'text-amber-400' : 'text-dark-border'}`}
                      >
                        <HiStar />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                  className="input-field mb-3 min-h-[80px] resize-none"
                />
                <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-muted">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="p-4 rounded-lg bg-dark-bg border border-dark-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-xs font-bold">
                        {review.buyer?.avatar ? (
                          <img src={review.buyer.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          review.buyer?.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.buyer?.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {getStarArray(review.rating).map((s, i) => (
                              <HiStar key={i} className={`text-xs ${s === 'full' ? 'text-amber-400' : 'text-dark-border'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-muted">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Product Info Card */}
          <div className="glass-card p-6 sticky top-24">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(product.category)}`}>
              {product.category}
            </span>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted">
              {product.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <HiStar className="text-amber-400" />
                  {product.averageRating.toFixed(1)} ({product.reviewCount})
                </span>
              )}
              <span className="flex items-center gap-1">
                <HiDownload /> {product.totalSales} sales
              </span>
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              {formatCurrency(product.price)}
            </div>

            {/* Action Button */}
            {isOwner ? (
              <Link to={`/dashboard/edit/${product._id}`} className="btn-secondary w-full py-3">
                Edit Product
              </Link>
            ) : isPurchased ? (
              <button onClick={handleDownload} className="btn-primary w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600">
                <HiDownload /> Download Product
              </button>
            ) : (
              <button onClick={handleBuy} disabled={buying} className="btn-primary w-full py-3">
                {buying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <HiShoppingCart /> Buy Now
                  </>
                )}
              </button>
            )}

            {/* Seller Card */}
            <div className="mt-6 pt-6 border-t border-dark-border">
              <p className="text-xs text-muted uppercase tracking-wider mb-3">Sold by</p>
              <Link to={`/profile/${product.seller?._id}`} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center font-bold text-sm overflow-hidden">
                  {product.seller?.avatar ? (
                    <img src={product.seller.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    product.seller?.name?.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {product.seller?.name}
                  </p>
                  {product.seller?.bio && (
                    <p className="text-xs text-muted line-clamp-1">{product.seller.bio}</p>
                  )}
                </div>
              </Link>
              <div className="flex gap-2 mt-3">
                {product.seller?.github && (
                  <a href={product.seller.github} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-dark-bg border border-dark-border text-muted hover:text-white hover:border-primary/50 transition-all text-xs">
                    <FaGithub />
                  </a>
                )}
                {product.seller?.twitter && (
                  <a href={product.seller.twitter} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-dark-bg border border-dark-border text-muted hover:text-white hover:border-primary/50 transition-all text-xs">
                    <FaTwitter />
                  </a>
                )}
                {product.seller?.website && (
                  <a href={product.seller.website} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-dark-bg border border-dark-border text-muted hover:text-white hover:border-primary/50 transition-all text-xs">
                    <FaGlobe />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
