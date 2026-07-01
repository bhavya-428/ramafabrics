import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { DashboardOverview } from './DashboardOverview';
import { CustomersTab, ProductManagementTab, CategoriesTab, LabelsTab, AdminProfileTab } from './AdminModules';
import { OrdersTab } from './OrdersTab';

export const AdminPanel = ({ setRoute, setSelectedProductId }) => {
  const {
    products,
    offers,
    orders,
    settings,
    currentUser,
    login,
    signup,
    addProduct,
    updateProduct,
    deleteProduct,
    addOffer,
    deleteOffer,
    updateOrderStatus,
    updateSettings
  } = useContext(ShopContext);

  // Auth States
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState('overview');
  const [curationSearch, setCurationSearch] = useState('');

  // Modal / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Silk', price: '', originalPrice: '', stock: '', description: '', colorPattern: 'linear-gradient(135deg, #7D1D2B 0%, #C5A059 100%)', isFeatured: false
  });

  // Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError(''); setAuthSuccess('');
    if (isLoginView) {
      const res = login(authEmail, authPassword);
      if (!res.success) setAuthError(res.message);
      else setAuthSuccess(res.message);
    } else {
      if (!authName) return setAuthError('Please enter your name.');
      const res = signup(authName, authEmail, authPassword);
      if (!res.success) setAuthError(res.message);
      else { setAuthSuccess(res.message); setIsLoginView(true); }
    }
  };

  const isAdminLoggedIn = currentUser && currentUser.isAdmin;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-slate-100">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Rama Fabrics Console</h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              {isLoginView ? 'Sign in to access stock and order managers.' : 'Sign up to register as an administrator.'}
            </p>
          </div>
          {authError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{authError}</div>}
          {authSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{authSuccess}</div>}
          <form className="mt-8 space-y-6" onSubmit={handleAuthSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {!isLoginView && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" required value={authName} onChange={e => setAuthName(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Store Manager" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="admin@ramafabrics.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {isLoginView ? 'Sign In' : 'Create Admin Account'}
              </button>
            </div>
          </form>
          <div className="text-sm text-center">
             {isLoginView ? (
              <p>First time? <button onClick={() => setIsLoginView(false)} className="font-medium text-indigo-600 hover:text-indigo-500">Create account</button></p>
            ) : (
              <p>Already registered? <button onClick={() => setIsLoginView(true)} className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</button></p>
            )}
            <div className="mt-4 border-t pt-4">
               <button onClick={() => setRoute('')} className="text-slate-500 hover:text-slate-700">← Back to Storefront</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((sum, o) => o.status !== 'Pending Payment' ? sum + o.total : sum, 0);
  const orderCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending Payment' || o.status === 'Paid').length;
  const inventoryAlertsCount = products.filter(p => p.stock <= 5).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'products', label: 'Products & Inventory', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'categories', label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'labels', label: 'Product Labels', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'admin-profile', label: 'Admin Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#1a1f36] text-slate-300 flex-col flex-shrink-0 z-20 shadow-xl overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">RF</div>
          <div>
            <h2 className="text-white font-bold tracking-wide">Rama Fabrics</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-300">Store CMS Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-[#6366f1] text-white shadow-md font-medium' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {item.label}
              {item.id === 'orders' && pendingOrdersCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingOrdersCount}</span>
              )}
              {item.id === 'products' && inventoryAlertsCount > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{inventoryAlertsCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700/50 mt-auto">
           <button onClick={() => setRoute('')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-300">›</span>
            <span className="font-semibold text-slate-700 capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors relative" onClick={() => setActiveTab('products')} title="View Alerts">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {(pendingOrdersCount > 0 || inventoryAlertsCount > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-bold text-slate-800">{currentUser?.name || 'Store Owner'}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wide">Store Manager</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'products' && <ProductManagementTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'labels' && <LabelsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'admin-profile' && <AdminProfileTab />}
        </main>
      </div>
    </div>
  );
};
