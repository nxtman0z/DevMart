import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center font-bold text-sm">
                D
              </div>
              <span className="text-xl font-bold">
                Dev<span className="text-primary">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              The premier marketplace for developers to buy and sell digital products,
              UI kits, templates, and code snippets.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/explore?category=UI+Kit" className="text-sm text-muted hover:text-white transition-colors">UI Kits</Link></li>
              <li><Link to="/explore?category=Template" className="text-sm text-muted hover:text-white transition-colors">Templates</Link></li>
              <li><Link to="/explore?category=Boilerplate" className="text-sm text-muted hover:text-white transition-colors">Boilerplates</Link></li>
              <li><Link to="/explore?category=Snippet" className="text-sm text-muted hover:text-white transition-colors">Snippets</Link></li>
              <li><Link to="/explore?category=Tool" className="text-sm text-muted hover:text-white transition-colors">Tools</Link></li>
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">For Sellers</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm text-muted hover:text-white transition-colors">Start Selling</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted hover:text-white transition-colors">Seller Dashboard</Link></li>
              <li><Link to="/dashboard/upload" className="text-sm text-muted hover:text-white transition-colors">Upload Product</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-muted hover:text-white hover:border-primary transition-all">
                <FaGithub />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-muted hover:text-white hover:border-primary transition-all">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} DevMart. All rights reserved.
          </p>
          <p className="text-sm text-muted flex items-center gap-1">
            Made with <HiHeart className="text-red-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
