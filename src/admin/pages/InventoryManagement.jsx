import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const InventoryManagement = ({ showToast }) => {
  const { products, updateProduct } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Stock adjustment state helper
  const [adjustAmount, setAdjustAmount] = useState({});

  const handleAdjustValueChange = (productId, value) => {
    setAdjustAmount(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleStockUpdate = (prod, operation) => {
    const rawVal = adjustAmount[prod.id];
    if (!rawVal || isNaN(rawVal) || parseInt(rawVal) <= 0) {
      showToast('Enter a valid positive number to adjust stock', 'warning');
      return;
    }

    const qty = parseInt(rawVal);
    let newStock = prod.stock;
    
    if (operation === 'add') {
      newStock += qty;
    } else {
      newStock = Math.max(0, newStock - qty);
    }

    // Auto-calculate stock status
    let newStatus = prod.stockStatus;
    const minStock = prod.minimumStock || 5;
    
    if (newStock === 0) {
      newStatus = 'Out of Stock';
    } else if (newStock <= minStock) {
      newStatus = 'Low Stock';
    } else {
      newStatus = 'In Stock';
    }

    updateProduct({
      ...prod,
      stock: newStock,
      stockStatus: newStatus,
      updatedAt: new Date().toISOString()
    });

    showToast(`Updated stock for "${prod.name}" to ${newStock}`, 'success');
    
    // Clear input
    setAdjustAmount(prev => ({
      ...prev,
      [prod.id]: ''
    }));
  };

  const handleStatusChange = (prod, newStatus) => {
    // If setting to In Stock, ensure stock is at least > minimumStock
    let finalStock = prod.stock;
    if (newStatus === 'Out of Stock') {
      finalStock = 0;
    } else if (newStatus === 'In Stock' && prod.stock <= (prod.minimumStock || 5)) {
      finalStock = (prod.minimumStock || 5) + 5;
    }

    updateProduct({
      ...prod,
      stock: finalStock,
      stockStatus: newStatus,
      updatedAt: new Date().toISOString()
    });

    showToast(`Stock status for "${prod.name}" marked as "${newStatus}"`, 'success');
  };

  // Filter
  const filteredProducts = products.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (prod.sku && prod.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || prod.stockStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Manager</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor stock status, alert levels, and make instant supply adjustments.</p>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search stock sheets by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <svg className="absolute left-4 top-2.5 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Inventory sheet */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Fabric</th>
                <th className="px-6 py-4">SKU / Code</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Min. Warning Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Adjust Inventory</th>
                <th className="px-6 py-4 text-right">Bulk Status Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block line-clamp-1">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{prod.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {prod.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                    {prod.stock} {prod.category === 'Ready-to-Wear' ? 'pcs' : 'meters'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {prod.minimumStock || 5} {prod.category === 'Ready-to-Wear' ? 'pcs' : 'm'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      prod.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                      prod.stockStatus === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                      prod.stockStatus === 'Out of Stock' ? 'bg-red-50 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {prod.stockStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={adjustAmount[prod.id] || ''}
                        onChange={(e) => handleAdjustValueChange(prod.id, e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        min="1"
                      />
                      <button
                        onClick={() => handleStockUpdate(prod, 'add')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold transition-all"
                        title="Add Stock"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => handleStockUpdate(prod, 'sub')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold transition-all"
                        title="Deduct Stock"
                      >
                        - Deduct
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <select
                      value={prod.stockStatus}
                      onChange={(e) => handleStatusChange(prod, e.target.value)}
                      className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="In Stock">Mark: In Stock</option>
                      <option value="Low Stock">Mark: Low Stock</option>
                      <option value="Out of Stock">Mark: Out of Stock</option>
                      <option value="Discontinued">Mark: Discontinued</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
