import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { PageLoader } from './components/common/Loader';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import UploadProduct from './pages/UploadProduct';
import MyPurchases from './pages/MyPurchases';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, sellerOnly = false }) {
  const { isAuthenticated, isSeller, initializing } = useAuth();

  if (initializing) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (sellerOnly && !isSeller) return <Navigate to="/" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-dark-bg">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Auth (redirect if logged in) */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

            {/* Protected */}
            <Route path="/dashboard" element={<ProtectedRoute sellerOnly><SellerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/upload" element={<ProtectedRoute sellerOnly><UploadProduct /></ProtectedRoute>} />
            <Route path="/dashboard/edit/:id" element={<ProtectedRoute sellerOnly><UploadProduct /></ProtectedRoute>} />
            <Route path="/purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #2A2A2A',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}
