import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX, HiShoppingBag, HiUser, HiLogout, HiViewGrid, HiUpload } from 'react-icons/hi';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center font-bold text-sm">
              D
            </div>
            <span className="text-xl font-bold">
              Dev<span className="text-primary">Mart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-muted hover:text-white transition-colors text-sm font-medium">
              Explore
            </Link>
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/dashboard" className="text-muted hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/purchases" className="text-muted hover:text-white transition-colors text-sm font-medium">
                My Purchases
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-dark-surface transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-sm font-bold overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border rounded-xl shadow-xl z-50 py-2 fade-in">
                      <div className="px-4 py-2 border-b border-dark-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover transition-colors"
                      >
                        <HiUser className="text-lg" /> Profile
                      </Link>
                      {user?.role === 'seller' && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover transition-colors"
                          >
                            <HiViewGrid className="text-lg" /> Dashboard
                          </Link>
                          <Link
                            to="/dashboard/upload"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover transition-colors"
                          >
                            <HiUpload className="text-lg" /> Upload Product
                          </Link>
                        </>
                      )}
                      <Link
                        to="/purchases"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover transition-colors"
                      >
                        <HiShoppingBag className="text-lg" /> My Purchases
                      </Link>
                      <hr className="border-dark-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-hover transition-colors w-full"
                      >
                        <HiLogout className="text-lg" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-muted hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-surface border-t border-dark-border fade-in">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/explore"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
            >
              Explore
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'seller' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/purchases"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
                >
                  My Purchases
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-dark-hover rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 text-center">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
