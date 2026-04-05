import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiCurrencyRupee, HiShoppingCart, HiCollection, HiPlus, HiRefresh } from 'react-icons/hi';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import ProductsTable from '../components/dashboard/ProductsTable';
import Loader from '../components/common/Loader';
import { productAPI, orderAPI } from '../api/endpoints';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, salesRes] = await Promise.all([
        productAPI.getMyProducts(),
        orderAPI.getSellerSales(),
      ]);
      setProducts(productsRes.data.products);
      setSalesData(salesRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (productId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !currentStatus);
      await productAPI.update(productId, formData);
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, isActive: !currentStatus } : p)));
      toast.success(currentStatus ? 'Deactivated' : 'Activated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="pt-24"><Loader size="lg" text="Loading dashboard..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Seller Dashboard</h1>
          <p className="text-muted text-sm">Manage products and track performance</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="btn-secondary text-sm"><HiRefresh /> Refresh</button>
          <Link to="/dashboard/upload" className="btn-primary text-sm"><HiPlus /> New Product</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={formatCurrency(salesData?.stats?.totalRevenue || 0)} icon={HiCurrencyRupee} color="green" />
        <StatCard title="Total Sales" value={salesData?.stats?.totalSales || 0} icon={HiShoppingCart} color="blue" />
        <StatCard title="Active Listings" value={products.filter((p) => p.isActive).length} icon={HiCollection} color="primary" />
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue (Last 30 Days)</h2>
        <RevenueChart data={salesData?.stats?.dailyRevenue || []} />
      </div>

      {salesData?.orders?.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-xs font-medium text-muted uppercase py-3 px-4">Product</th>
                  <th className="text-left text-xs font-medium text-muted uppercase py-3 px-4">Buyer</th>
                  <th className="text-left text-xs font-medium text-muted uppercase py-3 px-4">Amount</th>
                  <th className="text-left text-xs font-medium text-muted uppercase py-3 px-4">Date</th>
                  <th className="text-left text-xs font-medium text-muted uppercase py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.orders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="border-b border-dark-border/50 hover:bg-dark-hover/50">
                    <td className="py-3 px-4 text-sm">{order.product?.title}</td>
                    <td className="py-3 px-4 text-sm text-muted">{order.buyer?.name}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatCurrency(order.amount)}</td>
                    <td className="py-3 px-4 text-sm text-muted">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">My Products ({products.length})</h2>
        <ProductsTable products={products} onDelete={handleDelete} onToggle={handleToggle} />
      </div>
    </div>
  );
}
