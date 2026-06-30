import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const CustomersTab = () => {
  const { users } = useContext(ShopContext);
  const customers = users.filter(u => !u.isAdmin);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Customers List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
              <th className="pb-4 font-bold">Name</th>
              <th className="pb-4 font-bold">Email</th>
              <th className="pb-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {customers.map((c, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-4 font-bold text-slate-800">{c.name}</td>
                <td className="py-4 text-slate-600">{c.email}</td>
                <td className="py-4"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold">Active</span></td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-slate-500">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const InventoryTab = () => {
  const { products } = useContext(ShopContext);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Inventory Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
              <th className="pb-4 font-bold">Product</th>
              <th className="pb-4 font-bold">Category</th>
              <th className="pb-4 font-bold text-right">Stock Level</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="py-4 flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium text-slate-800">{p.name}</span>
                </td>
                <td className="py-4 text-slate-600">{p.category}</td>
                <td className={`py-4 text-right font-bold ${p.stock <= 10 ? 'text-rose-600' : 'text-emerald-600'}`}>{p.stock} Units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CategoriesTab = () => {
  const categories = ['Silk', 'Cotton', 'Handloom', 'Georgette', 'Ready-to-Wear'];
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Product Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800">{cat}</h3>
            <p className="text-sm text-slate-500 mt-2">Manage all {cat} products.</p>
            <button className="mt-4 text-indigo-600 font-semibold text-sm">View Products &rarr;</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminProfileTab = () => {
  const { currentUser } = useContext(ShopContext);
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
      <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
        {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{currentUser?.name}</h2>
      <p className="text-slate-500 mb-6">{currentUser?.email}</p>
      
      <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Role</label>
          <p className="font-semibold text-slate-800">Super Administrator</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Account Status</label>
          <p className="font-semibold text-emerald-600">Active</p>
        </div>
      </div>
    </div>
  );
};

export const SettingsTab = () => {
  const { settings, updateSettings } = useContext(ShopContext);
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Store Settings</h2>
        {isSaved && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold animate-fade-in">Settings Saved!</span>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Store Name</label>
            <input type="text" required value={formData.storeName} onChange={(e) => setFormData({...formData, storeName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
            <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Store Address</label>
          <input type="text" required value={formData.storeAddress} onChange={(e) => setFormData({...formData, storeAddress: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">UPI ID for Payments</label>
          <input type="text" required value={formData.upiId} onChange={(e) => setFormData({...formData, upiId: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export const ReviewsTab = () => (
  <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Customer Reviews</h2>
    <p className="text-slate-500">Reviews feature is being integrated. Check back later.</p>
  </div>
);

export const AnalyticsTab = () => (
  <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Advanced Analytics</h2>
    <p className="text-slate-500">Please refer to the Dashboard Overview for comprehensive real-time analytics.</p>
  </div>
);
