import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { DashboardOverview } from './DashboardOverview';
import { CustomersTab, InventoryTab, CategoriesTab, AdminProfileTab, SettingsTab, ReviewsTab, AnalyticsTab } from './AdminModules';

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

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'products', label: 'Products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { id: 'categories', label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'reviews', label: 'Reviews', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'curation', label: 'Featured Items', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
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
            <button className="text-slate-400 hover:text-indigo-600 transition-colors relative">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
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

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && <DashboardOverview />}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Fabrics Catalog</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage stock, prices, and fabric details.</p>
                </div>
                <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors">
                  + Add Fabric
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
                      <th className="pb-4 font-bold">Item</th>
                      <th className="pb-4 font-bold">Category</th>
                      <th className="pb-4 font-bold">Price</th>
                      <th className="pb-4 font-bold">Stock</th>
                      <th className="pb-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {products.map(prod => (
                      <tr key={prod.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${prod.image})` }}></div>
                             <span className="font-bold text-slate-800">{prod.name}</span>
                          </div>
                        </td>
                        <td className="py-4"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{prod.category}</span></td>
                        <td className="py-4 font-semibold text-slate-700">₹{prod.price}</td>
                        <td className="py-4">
                          <span className={`font-bold ${prod.stock <= 5 ? 'text-rose-500' : 'text-emerald-500'}`}>{prod.stock}</span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button onClick={() => { setEditingProduct(prod); setProductForm(prod); setShowProductModal(true); }} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg font-medium transition-colors">Edit</button>
                          <button onClick={() => deleteProduct(prod.id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
               <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Customer Orders</h2>
                  <p className="text-sm text-slate-500 mt-1">Review and process all pending and historical orders.</p>
                </div>
               <div className="space-y-6">
                {orders.length > 0 ? orders.map(order => (
                  <div key={order.id} className="border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-indigo-200 transition-colors">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg text-slate-800">#{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
                          ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'Shipped' ? 'bg-sky-100 text-sky-700' : 
                            order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-700' : 
                            'bg-amber-100 text-amber-700'}`
                        }>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                      <div className="pt-2 text-sm text-slate-700">
                        <span className="font-bold block text-slate-900">{order.shippingInfo.name}</span>
                        <span>{order.shippingInfo.phone} | {order.shippingInfo.address}, {order.shippingInfo.city}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-sm mb-2 text-slate-900">Items:</p>
                       <ul className="text-sm text-slate-600 space-y-1">
                         {order.items.map((item, idx) => (
                           <li key={idx}>• {item.product.name} x {item.quantity}</li>
                         ))}
                       </ul>
                       <p className="font-black text-lg mt-4 text-indigo-600">₹{order.total}</p>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-semibold cursor-pointer">
                          <option value="Pending Payment">Pending Payment</option>
                          <option value="Paid">Paid</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                      </select>
                      <a href={`https://wa.me/${order.shippingInfo.whatsapp}`} target="_blank" rel="noreferrer" className="w-full text-center bg-[#25D366] text-white py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-[#128C7E] transition-colors">
                        Message Customer
                      </a>
                    </div>
                  </div>
                )) : <p className="text-slate-500 text-center py-12">No orders found.</p>}
               </div>
            </div>
          )}

           {/* TAB: CURATION (FEATURED ITEMS) */}
           {activeTab === 'curation' && (
            <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Curate Featured Items</h2>
                  <p className="text-sm text-slate-500 mt-1">Select items to display on the New Arrivals, Best Sellers, and Offers storefront pages.</p>
              </div>
              <input 
                  type="text" 
                  placeholder="Search products by name to curate..." 
                  value={curationSearch}
                  onChange={(e) => setCurationSearch(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl mb-6 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
                <div className="space-y-4">
                  {products
                    .filter(p => curationSearch && p.name.toLowerCase().includes(curationSearch.toLowerCase()))
                    .slice(0, 10)
                    .map(product => (
                      <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow bg-white gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url(${product.image})` }}></div>
                          <span className="font-bold text-slate-800">{product.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-emerald-600 transition-colors">
                            <input type="checkbox" checked={!!product.isNewArrival} onChange={() => updateProduct({ ...product, isNewArrival: !product.isNewArrival })} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" /> New Arrival
                          </label>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-amber-600 transition-colors">
                            <input type="checkbox" checked={!!product.isBestSeller} onChange={() => updateProduct({ ...product, isBestSeller: !product.isBestSeller })} className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" /> Best Seller
                          </label>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-rose-600 transition-colors">
                            <input type="checkbox" checked={!!product.isOfferItem} onChange={() => updateProduct({ ...product, isOfferItem: !product.isOfferItem })} className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500" /> Offer Item
                          </label>
                        </div>
                      </div>
                  ))}
                  {curationSearch && products.filter(p => p.name.toLowerCase().includes(curationSearch.toLowerCase())).length === 0 && (
                    <p className="text-slate-500 text-center py-8">No products found matching "{curationSearch}"</p>
                  )}
                  {!curationSearch && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                       <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                       <p className="text-slate-500 text-sm font-medium">Type in the search box above to find products and toggle their featured status.</p>
                    </div>
                  )}
                </div>
            </div>
           )}

          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'admin-profile' && <AdminProfileTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'offers' && <SettingsTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}

        </main>
      </div>
      
      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingProduct ? 'Edit Fabric Details' : 'Add New Fabric Stock'}</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const formatted = { ...productForm, price: parseFloat(productForm.price), originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined, stock: parseFloat(productForm.stock) };
              if (editingProduct) updateProduct(formatted); else addProduct(formatted);
              setShowProductModal(false);
            }} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Fabric Name</label>
                <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    <option value="Silk">Silk</option><option value="Cotton">Cotton</option><option value="Handloom">Handloom</option><option value="Georgette">Georgette</option><option value="Ready-to-Wear">Ready-to-Wear</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
                  <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Sale Price (₹)</label>
                  <input type="number" required step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input type="number" step="0.01" value={productForm.originalPrice || ''} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
