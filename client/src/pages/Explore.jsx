import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import { productAPI } from '../api/endpoints';
import { useDebounce } from '../hooks/useDebounce';
import { HiFilter, HiX } from 'react-icons/hi';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.sort) params.sort = filters.sort;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        params.page = filters.page;
        params.limit = 12;

        const { data } = await productAPI.getAll(params);
        setProducts(data.products);
        setPagination(data.pagination);

        // Update URL
        const newParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val && val !== 'newest' && key !== 'limit') newParams.set(key, val);
        });
        setSearchParams(newParams, { replace: true });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, debouncedSearch, filters.sort, filters.minPrice, filters.maxPrice, filters.page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Explore Products</h1>
          <p className="text-muted text-sm">
            {pagination ? `${pagination.total} products found` : 'Loading...'}
          </p>
        </div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden btn-secondary text-sm"
        >
          <HiFilter /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 glass-card p-5">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-dark-surface p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-muted hover:text-white">
                  <HiX className="text-xl" />
                </button>
              </div>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>
        )}

        {/* Products */}
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                disabled={filters.page <= 1}
                className="btn-secondary text-sm disabled:opacity-30"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(pagination.pages, 5) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setFilters((p) => ({ ...p, page }))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      filters.page === page
                        ? 'bg-primary text-white'
                        : 'bg-dark-surface border border-dark-border text-muted hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                disabled={filters.page >= (pagination?.pages || 1)}
                className="btn-secondary text-sm disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
