import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { DashboardOverview } from './DashboardOverview';
import { CustomersTab, ProductManagementTab, CategoriesTab, LabelsTab, AdminProfileTab, OrdersTab, OffersTab, HeroBannersTab, SettingsTab, PagesTab, FAQTab } from './AdminModules';
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
    updateSettings,
    logout
  } = useContext(ShopContext);

  // Auth States
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [curationSearch, setCurationSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="admin@example.com" />
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



  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'products', label: 'Products & Inventory', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'categories', label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'labels', label: 'Featured Products', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'hero', label: 'Hero Banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'offers', label: 'Offers & Discounts', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
    { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'settings', label: 'Store Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'pages', label: 'Static Pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'faqs', label: 'FAQs', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'profile', label: 'Admin Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  const handleLogout = () => {
    logout();
    setRoute('home');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Navigation */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
      <div className={`w-72 bg-[#1e2336] text-slate-300 flex flex-col shadow-2xl z-50 transition-transform max-md:fixed max-md:inset-y-0 max-md:left-0 ${isMobileMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}>
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRoute('home')}>
            <img src="/logo.png" alt="RF" className="w-11 h-11 rounded-full object-cover shadow-lg border-2 border-[#C5A059]" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Rama</h1>
              <h1 className="text-xl font-bold text-white tracking-wide -mt-2">Fabrics</h1>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-4 border-b border-slate-700/50 pb-4">Store CMS Panel</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${activeTab === item.id 
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-900/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}
              `}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
              
              {/* Badges */}
              {item.id === 'orders' && orders.filter(o => o.status === 'Pending Payment').length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {orders.filter(o => o.status === 'Pending Payment').length}
                </span>
              )}
              {item.id === 'products' && products.filter(p => p.stock <= 5).length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {products.filter(p => p.stock <= 5).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2 md:gap-4 text-sm font-medium text-slate-500">
            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hidden sm:block">Admin</span>
            <svg className="w-4 h-4 text-slate-300 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-800 capitalize font-bold">{navItems.find(i => i.id === activeTab)?.label}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
                V
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-800">v.bhavyasri2001</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Store Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          {activeTab === 'dashboard' && <DashboardOverview setRoute={setRoute} />}
          {activeTab === 'products' && <ProductManagementTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'labels' && <LabelsTab />}
          {activeTab === 'hero' && <HeroBannersTab />}
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'pages' && <PagesTab />}
          {activeTab === 'faqs' && <FAQTab />}
          {activeTab === 'profile' && <AdminProfileTab />}
        </main>
      </div>
    </div>
  );
};
