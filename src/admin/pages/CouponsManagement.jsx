import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const CouponsManagement = ({ showToast }) => {
  const { offers, addOffer, deleteOffer, setOffers } = useContext(ShopContext);

  // Form modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialFormState = {
    code: '',
    discount: '',
    type: 'percentage',
    minPurchase: '0',
    maxDiscount: '500',
    expiryDate: '',
    usageLimit: '100',
    status: 'Enabled'
  };

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleCouponStatus = (coupon) => {
    const newStatus = coupon.status === 'Disabled' ? 'Enabled' : 'Disabled';
    const updated = { ...coupon, status: newStatus };
    setOffers(prev => prev.map(o => o.id === coupon.id ? updated : o));
    showToast(`Coupon ${coupon.code} marked as ${newStatus}`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.code.trim()) {
      setError('Coupon code is required.');
      return;
    }
    if (!form.discount || isNaN(form.discount) || parseFloat(form.discount) <= 0) {
      setError('Valid discount value is required.');
      return;
    }

    const formatted = {
      ...form,
      code: form.code.toUpperCase().trim(),
      discount: parseFloat(form.discount),
      minPurchase: parseFloat(form.minPurchase || 0),
      maxDiscount: parseFloat(form.maxDiscount || 0),
      usageLimit: parseInt(form.usageLimit || 100),
      status: form.status || 'Enabled'
    };

    if (editingCoupon) {
      setOffers(prev => prev.map(o => o.id === editingCoupon.id ? { ...formatted, id: o.id } : o));
      showToast(`Coupon ${formatted.code} details updated`, 'success');
    } else {
      addOffer(formatted);
      showToast(`Coupon ${formatted.code} activated successfully!`, 'success');
    }

    setIsModalOpen(false);
    setEditingCoupon(null);
    setForm(initialFormState);
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code || '',
      discount: coupon.discount?.toString() || '',
      type: coupon.type || 'percentage',
      minPurchase: coupon.minPurchase?.toString() || '0',
      maxDiscount: coupon.maxDiscount?.toString() || '500',
      expiryDate: coupon.expiryDate || '',
      usageLimit: coupon.usageLimit?.toString() || '100',
      status: coupon.status || 'Enabled'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id, code) => {
    if (window.confirm(`Are you sure you want to delete promo coupon "${code}"?`)) {
      deleteOffer(id);
      showToast(`Coupon ${code} removed`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Coupons & Offers</h2>
          <p className="text-sm text-slate-500 mt-1">Manage e-commerce promotional discount codes and order requirements.</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setForm(initialFormState);
            setError('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-100"
        >
          <Icons.PlusIcon className="w-5 h-5" />
          <span>Create Promo Coupon</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {offers.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Coupon Code</th>
                  <th className="px-6 py-4">Discount Value</th>
                  <th className="px-6 py-4">Min. Purchase Req.</th>
                  <th className="px-6 py-4">Max. Discount Cap</th>
                  <th className="px-6 py-4">Expiry / Limits</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="font-mono font-bold text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                        {offer.code}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                      {offer.type === 'percentage' ? `${offer.discount}% OFF` : `₹${offer.discount} FLAT OFF`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      ₹{offer.minPurchase || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {offer.type === 'percentage' ? `₹${offer.maxDiscount || 'No Limit'}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      <div>Limit: {offer.usageLimit || 'Uncapped'}</div>
                      <div className="mt-0.5">Exp: {offer.expiryDate || 'No Expiry'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCouponStatus(offer)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm transition-all ${
                          offer.status !== 'Disabled' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {offer.status !== 'Disabled' ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(offer)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl"
                          title="Edit"
                        >
                          <Icons.EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(offer.id, offer.code)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl"
                          title="Delete"
                        >
                          <Icons.DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center">
              <span className="text-3xl">🏷️</span>
              <p className="text-slate-400 text-sm mt-3">No promo coupons created yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 animate-scale-up overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCoupon ? 'Modify Discount Offer' : 'Create Promotional Coupon'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <Icons.CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono font-bold"
                    placeholder="e.g. FESTIVE25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discount Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="flat">Flat Value Discount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discount Value *</label>
                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 20 (for 20%)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Min. Purchase Limit (₹)</label>
                  <input
                    type="number"
                    name="minPurchase"
                    value={form.minPurchase}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max. Discount Cap (₹)</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={form.maxDiscount}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="500"
                    disabled={form.type === 'flat'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Usage Count Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coupon Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-100"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
