import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const StoreSettings = ({ showToast }) => {
  const { settings, updateSettings } = useContext(ShopContext);

  const [form, setForm] = useState({
    storeName: settings.storeName || 'Rama Fabrics',
    logo: settings.logo || '',
    storeAddress: settings.storeAddress || '',
    email: settings.email || 'contact@ramafabrics.com',
    phone: settings.phone || '089770 01696',
    whatsapp: settings.whatsapp || '919618896169',
    gstNumber: settings.gstNumber || '37AAAAA0000A1Z5',
    currency: settings.currency || 'INR (₹)',
    tax: settings.tax || '5',
    shippingCharges: settings.shippingCharges || '50',
    deliveryCharges: settings.deliveryCharges || '0',
    socialFb: settings.socialFb || 'https://facebook.com/ramafabrics',
    socialInsta: settings.socialInsta || 'https://instagram.com/ramafabrics_vjw',
    heroTitle: settings.heroTitle || '',
    heroSubtitle: settings.heroSubtitle || ''
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passError, setPassError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(form);
    showToast('Store configurations updated successfully!', 'success');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPassError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPassError('All fields are required.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }
    if (passwordForm.currentPassword !== '123456') {
      setPassError('Current password is incorrect.');
      return;
    }

    // Success
    showToast('Security password changed successfully!', 'success');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogoInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, logo: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
      showToast('New logo loaded!', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Shop Configurations</h2>
        <p className="text-sm text-slate-500 mt-1">Configure invoicing taxes, delivery thresholds, contact info, and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: Main Settings */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 mb-5">Metadata & Billing Settings</h4>
          
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Storefront Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">GST Identification (GSTIN)</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-semibold"
                  placeholder="37AAAAA0000A1Z5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Support Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">General Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Notification Digits</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Showroom / Store Physical Address</label>
              <textarea
                name="storeAddress"
                value={form.storeAddress}
                onChange={handleChange}
                rows="2.5"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Tax (%)</label>
                <input
                  type="number"
                  name="tax"
                  value={form.tax}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shipping Fee (₹)</label>
                <input
                  type="number"
                  name="shippingCharges"
                  value={form.shippingCharges}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Local Delivery Fee (₹)</label>
                <input
                  type="number"
                  name="deliveryCharges"
                  value={form.deliveryCharges}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operating Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400 font-semibold cursor-not-allowed focus:outline-none"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facebook Page Link</label>
                <input
                  type="url"
                  name="socialFb"
                  value={form.socialFb}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instagram Page Link</label>
                <input
                  type="url"
                  name="socialInsta"
                  value={form.socialInsta}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100"
              >
                Save configurations
              </button>
            </div>
          </form>
        </div>

        {/* Right Columns: Logo Upload & Password Reset */}
        <div className="space-y-6">
          {/* Logo Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 mb-5 w-full text-left">Store Branding Logo</h4>
            
            <div className="w-24 h-24 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-300 font-bold overflow-hidden shadow-inner">
              {form.logo ? (
                <img src={form.logo} alt="Store Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl text-indigo-400">RF</span>
              )}
            </div>
            
            <div className="mt-5 w-full">
              <label className="w-full block text-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl py-2 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
                Browse Logo File
                <input type="file" className="hidden" onChange={handleLogoInput} accept="image/*" />
              </label>
              <p className="text-[10px] text-slate-400 mt-2">Recommended: Transparent PNG (square format)</p>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 mb-5">Change Console Password</h4>
            
            <form onSubmit={handleSavePassword} className="space-y-4">
              {passError && <div className="text-[11px] font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg">{passError}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Change password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
