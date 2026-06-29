import React, { useState, useEffect } from 'react';
import * as Icons from '../components/Icons';

export const ReviewsManagement = ({ showToast }) => {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('rf_reviews');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'rev1', customerName: 'Harsha Vardhan', productName: 'Royal Banarasi Brocade Silk (Crimson Maroon)', rating: 5, comment: 'Outstanding quality silk! The maroon shade has a beautiful traditional golden sheen. Perfect for stitching festive ethnic suits.', date: '2026-06-25', status: 'Approved' },
      { id: 'rev2', customerName: 'Kalyani S.', productName: 'Jaipuri Block Print Cotton (Sage Olive)', rating: 4, comment: 'Very soft organic cotton. Colors are fast and did not bleed on first wash. Highly recommended for daily wear kurtas.', date: '2026-06-22', status: 'Approved' },
      { id: 'rev3', customerName: 'Rajesh G.', productName: 'Straight-Cut Salwar Set (Lavender Mist)', rating: 3, comment: 'Fit is good but lavender color is slightly darker than the product photos. Material feels comfortable.', date: '2026-06-20', status: 'Pending Review' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('rf_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleStatusChange = (id, newStatus) => {
    setReviews(prev => prev.map(rev => rev.id === id ? { ...rev, status: newStatus } : rev));
    showToast(`Review marked as ${newStatus}`, 'success');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this customer review permanently?')) {
      setReviews(prev => prev.filter(rev => rev.id !== id));
      showToast('Review deleted', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Product Quality Reviews</h2>
        <p className="text-sm text-slate-500 mt-1">Audit customer comments, edit approval statuses, and verify product rating stars.</p>
      </div>

      {/* Reviews list table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {reviews.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {rev.customerName}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate font-medium text-slate-800">
                      {rev.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <svg
                            key={idx}
                            className={`w-4 h-4 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{rev.comment}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {rev.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        rev.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        rev.status === 'Hidden' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {rev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {rev.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(rev.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== 'Hidden' && (
                          <button
                            onClick={() => handleStatusChange(rev.id, 'Hidden')}
                            className="px-2.5 py-1 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            Hide
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(rev.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl"
                          title="Delete Permanently"
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
              <span className="text-3xl">💬</span>
              <p className="text-slate-400 text-sm mt-3">No reviews left by customers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
