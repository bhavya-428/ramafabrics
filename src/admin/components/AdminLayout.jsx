import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from './Icons';

export const AdminLayout = ({ children, activeTab, setActiveTab, showToast }) => {
  const { currentUser, logout } = useContext(ShopContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.DashboardIcon },
    { id: 'products', label: 'Products', icon: Icons.ProductsIcon },
    { id: 'categories', label: 'Categories', icon: Icons.CategoriesIcon },
    { id: 'inventory', label: 'Inventory', icon: Icons.InventoryIcon },
    { id: 'orders', label: 'Orders', icon: Icons.OrdersIcon },
    { id: 'customers', label: 'Customers', icon: Icons.CustomersIcon },
    { id: 'coupons', label: 'Coupons', icon: Icons.CouponsIcon },
    { id: 'reviews', label: 'Reviews', icon: Icons.ReviewsIcon },
    { id: 'analytics', label: 'Analytics', icon: Icons.AnalyticsIcon },
    { id: 'settings', label: 'Settings', icon: Icons.SettingsIcon },
    { id: 'profile', label: 'Admin Profile', icon: Icons.ProfileIcon },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the administration console?')) {
      logout();
      showToast('Logged out successfully', 'info');
      window.location.hash = '#login';
    }
  };

  const activeLabel = menuItems.find(item => item.id === activeTab)?.label || 'Console';

  // Static alerts list for bell dropdown
  const alerts = [
    { id: 1, text: 'New order #1089 received from Bhavyasri', time: '10m ago', unread: true },
    { id: 2, text: 'Product "Royal Banarasi Brocade" is low in stock', time: '2h ago', unread: true },
    { id: 3, text: 'New review published for cotton fabric', time: '1d ago', unread: false },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-900/30">
          RF
        </div>
        <div>
          <h1 className="text-white font-bold text-base tracking-wide">Rama Fabrics</h1>
          <p className="text-[10px] text-indigo-400 uppercase font-semibold tracking-wider">Store CMS Panel</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium sidebar-link-transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/20'
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-950/20 hover:text-red-400 sidebar-link-transition text-slate-400"
        >
          <Icons.LogoutIcon className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 fixed inset-y-0 left-0 z-20 border-r border-slate-200">
        {sidebarContent}
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200 shadow-sm">
          {/* Mobile menu trigger & breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Icons.MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-400">Admin</span>
              <Icons.ChevronRightIcon className="w-4 h-4 text-slate-300" />
              <span className="text-slate-800">{activeLabel}</span>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icons.BellIcon className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-40 animate-fade-in origin-top-right">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <span className="font-semibold text-sm text-slate-900">Notifications</span>
                      <button 
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => showToast('All notifications marked as read', 'success')}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {alerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex gap-3 ${
                            alert.unread ? 'bg-indigo-50/20' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            alert.unread ? 'bg-indigo-600' : 'bg-transparent'
                          }`} />
                          <div>
                            <p className="text-xs text-slate-700 font-medium">{alert.text}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{alert.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar / Quick Link */}
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-400">Store Manager</p>
              </div>
            </button>
          </div>
        </header>

        {/* Scrollable Work Area Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-slate-900 shadow-xl flex flex-col z-10 animate-slide-in">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Icons.CloseIcon className="w-5 h-5" />
            </button>
            <div className="h-full">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
