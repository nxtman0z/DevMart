import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiDownload } from 'react-icons/hi';
import { orderAPI } from '../api/endpoints';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/helpers';
import Loader from '../components/common/Loader';

export default function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await orderAPI.getMyPurchases();
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="pt-24"><Loader size="lg" text="Loading purchases..." /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in">
      <h1 className="text-3xl font-bold mb-2">My Purchases</h1>
      <p className="text-muted text-sm mb-8">{orders.length} products purchased</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-dark-surface border border-dark-border rounded-xl">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
          <p className="text-sm text-muted mb-6">Explore our marketplace to find amazing products</p>
          <Link to="/explore" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-dark-surface border border-dark-border rounded-xl p-5 flex items-center gap-5 hover:border-primary/30 transition-colors">
              <img
                src={order.product?.previewImages?.[0] || `https://placehold.co/80x60/1A1A1A/7C3AED?text=P`}
                alt={order.product?.title}
                className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/product/${order.product?._id}`} className="font-medium text-sm hover:text-primary transition-colors truncate">
                    {order.product?.title}
                  </Link>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(order.product?.category)}`}>
                    {order.product?.category}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  By {order.seller?.name} • {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm mb-2">{formatCurrency(order.amount)}</p>
                {order.product?.productFile && (
                  <a href={order.product.productFile} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-1.5 px-3">
                    <HiDownload /> Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
