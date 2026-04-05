import { Link } from 'react-router-dom';
import { HiStar, HiDownload } from 'react-icons/hi';
import { formatCurrency, getCategoryColor, truncateText } from '../../utils/helpers';

export default function ProductCard({ product }) {
  const placeholderImg = `https://placehold.co/600x400/1A1A1A/7C3AED?text=${encodeURIComponent(product.title)}`;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-dark-bg">
        <img
          src={product.previewImages?.[0] || placeholderImg}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {product.title}
        </h3>
        <p className="text-xs text-muted mb-3 line-clamp-2 flex-1">
          {truncateText(product.description, 80)}
        </p>

        {/* Seller */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-[10px] font-bold overflow-hidden">
            {product.seller?.avatar ? (
              <img src={product.seller.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              product.seller?.name?.charAt(0)
            )}
          </div>
          <span className="text-xs text-muted">{product.seller?.name}</span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-border">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted">
            {product.averageRating > 0 && (
              <span className="flex items-center gap-1">
                <HiStar className="text-amber-400" />
                {product.averageRating.toFixed(1)}
              </span>
            )}
            {product.totalSales > 0 && (
              <span className="flex items-center gap-1">
                <HiDownload />
                {product.totalSales}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
