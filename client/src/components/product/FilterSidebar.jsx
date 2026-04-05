import { HiSearch, HiX } from 'react-icons/hi';

const categories = ['All', 'UI Kit', 'Template', 'Boilerplate', 'Snippet', 'Tool'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function FilterSidebar({ filters, setFilters, onSearch }) {
  const handleCategoryChange = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: cat === 'All' ? '' : cat,
      page: 1,
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  };

  const handlePriceChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      page: 1,
    });
  };

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sort !== 'newest';

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Search</label>
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg border border-dark-border text-muted hover:text-white hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Price Range (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="input-field text-center"
            min="0"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="input-field text-center"
            min="0"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Sort By</label>
        <select
          value={filters.sort}
          onChange={handleSortChange}
          className="input-field cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <HiX /> Clear all filters
        </button>
      )}
    </div>
  );
}
