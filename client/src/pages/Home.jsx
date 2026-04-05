import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HiCode, HiTemplate, HiCube, HiLightningBolt, HiArrowRight, HiStar, HiDownload } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { SkeletonCard } from '../components/common/Loader';
import { productAPI } from '../api/endpoints';

const categories = [
  { name: 'UI Kit', icon: HiTemplate, desc: 'Beautiful pre-built interface components', color: 'from-purple-500 to-purple-700' },
  { name: 'Template', icon: HiCube, desc: 'Ready-to-deploy project templates', color: 'from-blue-500 to-blue-700' },
  { name: 'Boilerplate', icon: HiCode, desc: 'Production-ready starter projects', color: 'from-green-500 to-green-700' },
  { name: 'Snippet', icon: HiLightningBolt, desc: 'Copy-paste code solutions', color: 'from-amber-500 to-amber-700' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productAPI.getAll({ sort: 'popular', limit: 8 });
        setFeatured(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <HiLightningBolt className="animate-pulse" />
            The Marketplace for Developers
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Buy & Sell
            <br />
            <span className="gradient-text">Digital Products</span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover premium UI kits, templates, boilerplates, and code snippets
            built by developers, for developers. Ship faster, build better.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore" className="btn-primary px-8 py-3 text-base">
              Explore Products <HiArrowRight />
            </Link>
            <Link to="/register" className="btn-secondary px-8 py-3 text-base">
              Start Selling
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14">
            <div className="text-center">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-muted">Products</p>
            </div>
            <div className="w-px h-10 bg-dark-border" />
            <div className="text-center">
              <p className="text-2xl font-bold">2K+</p>
              <p className="text-xs text-muted">Developers</p>
            </div>
            <div className="w-px h-10 bg-dark-border" />
            <div className="text-center">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs text-muted">Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Browse Categories</h2>
          <p className="text-muted">Find exactly what you need for your next project</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/explore?category=${encodeURIComponent(cat.name)}`}
              className="group relative bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className="text-xl text-white" />
              </div>
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              <p className="text-sm text-muted">{cat.desc}</p>
              <HiArrowRight className="absolute top-6 right-6 text-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted">Top-rated products from our community</p>
          </div>
          <Link to="/explore" className="btn-secondary text-sm">
            View All <HiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative gradient-border rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-pink-500/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-muted max-w-lg mx-auto mb-8">
              Join thousands of developers monetizing their skills. Create your seller account today and reach a global audience.
            </p>
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Create Seller Account <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
