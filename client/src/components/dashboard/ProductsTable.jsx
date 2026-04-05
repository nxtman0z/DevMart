import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiEye, HiEyeOff } from 'react-icons/hi';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/helpers';

export default function ProductsTable({ products, onDelete, onToggle }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">You haven't uploaded any products yet.</p>
        <Link to="/dashboard/upload" className="btn-primary">
          Upload Your First Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider py-3 px-4">Product</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider py-3 px-4">Category</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider py-3 px-4">Price</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider py-3 px-4">Sales</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider py-3 px-4">Status</th>
            <th className="text-right text-xs font-medium text-muted uppercase tracking-wider py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.previewImages?.[0] || `https://placehold.co/60x40/1A1A1A/7C3AED?text=${encodeURIComponent(product.title.charAt(0))}`}
                    alt={product.title}
                    className="w-12 h-8 rounded-md object-cover"
                  />
                  <div>
                    <Link to={`/product/${product._id}`} className="text-sm font-medium hover:text-primary transition-colors">
                      {product.title}
                    </Link>
                    <p className="text-xs text-muted">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
              </td>
              <td className="py-3 px-4 text-sm font-medium">{formatCurrency(product.price)}</td>
              <td className="py-3 px-4 text-sm text-muted">{product.totalSales}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onToggle(product._id, product.isActive)}
                    className="p-1.5 rounded-lg hover:bg-dark-bg text-muted hover:text-white transition-colors"
                    title={product.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {product.isActive ? <HiEyeOff /> : <HiEye />}
                  </button>
                  <Link
                    to={`/dashboard/edit/${product._id}`}
                    className="p-1.5 rounded-lg hover:bg-dark-bg text-muted hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <HiPencil />
                  </Link>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="p-1.5 rounded-lg hover:bg-dark-bg text-muted hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <HiTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
