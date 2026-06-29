import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { AdminLayout } from './components/AdminLayout';

// Subpages
import { AdminLogin } from './pages/AdminLogin';
import { DashboardOverview } from './pages/DashboardOverview';
import { ProductManagement } from './pages/ProductManagement';
import { InventoryManagement } from './pages/InventoryManagement';
import { CategoryManagement } from './pages/CategoryManagement';
import { OrderManagement } from './pages/OrderManagement';
import { CustomerManagement } from './pages/CustomerManagement';
import { CouponsManagement } from './pages/CouponsManagement';
import { ReviewsManagement } from './pages/ReviewsManagement';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { StoreSettings } from './pages/StoreSettings';
import { AdminProfile } from './pages/AdminProfile';

export default function App() {
  const { currentUser } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Hash-based simple client routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      if (hash === 'login') {
        // Handled separately by auth guard
        return;
      }
      setActiveTab(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetActiveTab = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  // Auth Guard Role-based Check
  const isAdmin = currentUser && currentUser.isAdmin;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
        <AdminLogin showToast={showToast} />
        {/* Render Toasts even on Login page */}
        {toast.visible && <ToastBanner toast={toast} />}
      </div>
    );
  }

  // Active view renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview setActiveTab={handleSetActiveTab} />;
      case 'products':
        return <ProductManagement showToast={showToast} />;
      case 'categories':
        return <CategoryManagement showToast={showToast} />;
      case 'inventory':
        return <InventoryManagement showToast={showToast} />;
      case 'orders':
        return <OrderManagement showToast={showToast} />;
      case 'customers':
        return <CustomerManagement showToast={showToast} />;
      case 'coupons':
        return <CouponsManagement showToast={showToast} />;
      case 'reviews':
        return <ReviewsManagement showToast={showToast} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <StoreSettings showToast={showToast} />;
      case 'profile':
        return <AdminProfile showToast={showToast} />;
      default:
        return <DashboardOverview setActiveTab={handleSetActiveTab} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      <AdminLayout activeTab={activeTab} setActiveTab={handleSetActiveTab} showToast={showToast}>
        {renderTabContent()}
      </AdminLayout>

      {/* Floating Toast Notification */}
      {toast.visible && <ToastBanner toast={toast} />}
    </div>
  );
}

// Toast component helper
const ToastBanner = ({ toast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl border shadow-lg bg-white animate-slide-in select-none">
      <div className={`w-2 h-2 rounded-full ${
        toast.type === 'success' ? 'bg-emerald-500' :
        toast.type === 'error' ? 'bg-rose-500' :
        toast.type === 'warning' ? 'bg-amber-500' :
        'bg-indigo-500'
      }`} />
      <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
    </div>
  );
};
