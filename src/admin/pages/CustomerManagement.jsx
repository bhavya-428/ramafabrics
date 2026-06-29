import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const CustomerManagement = ({ showToast }) => {
  const { orders, users, setUsers } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique customers from orders shippingInfo
  const orderCustomers = orders.reduce((acc, order) => {
    const phone = order.shippingInfo?.phone;
    if (!phone) return acc;
    
    const existing = acc.find(c => c.phone === phone);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalPurchase += order.total;
    } else {
      acc.push({
        id: 'cst-' + phone.slice(-4),
        name: order.shippingInfo?.name || 'Guest Buyer',
        email: order.shippingInfo?.whatsapp ? `${order.shippingInfo.whatsapp}@wa.me` : 'guest@ramafabrics.com',
        phone: phone,
        ordersCount: 1,
        totalPurchase: order.total,
        joinedDate: new Date(order.createdAt).toLocaleDateString(),
        status: 'Active'
      });
    }
    return acc;
  }, []);

  // Map users to customers format and merge duplicates
  const registeredCustomers = users.map((u, idx) => {
    const userOrders = orders.filter(o => o.userEmail === u.email);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      id: 'usr-' + (1000 + idx),
      name: u.name || 'Registered User',
      email: u.email,
      phone: u.phone || 'N/A',
      ordersCount: userOrders.length,
      totalPurchase: totalSpent,
      joinedDate: new Date().toLocaleDateString(), // dummy join
      status: u.blocked ? 'Blocked' : 'Active'
    };
  });

  // Merge datasets, prioritizing registered users
  const allCustomers = [...registeredCustomers];
  orderCustomers.forEach(oc => {
    const duplicate = allCustomers.find(ac => ac.phone === oc.phone || ac.email === oc.email);
    if (!duplicate) {
      allCustomers.push(oc);
    }
  });

  const handleBlockCustomer = (email, currentStatus) => {
    const isBlocked = currentStatus === 'Active';
    // Update users array
    setUsers(prev => prev.map(u => u.email === email ? { ...u, blocked: isBlocked } : u));
    showToast(isBlocked ? `Customer ${email} has been Blocked` : `Customer ${email} is Active`, 'info');
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer profile? This will not delete their order history.')) {
      showToast('Customer record removed', 'success');
    }
  };

  const filteredCustomers = allCustomers.filter(cust => {
    return (
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Database</h2>
        <p className="text-sm text-slate-500 mt-1">Review active customers, registration details, total expenditures, and account status.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <Icons.SearchIcon className="absolute left-4 top-2.5 w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredCustomers.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Customer Profile</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4 text-center">Orders Count</th>
                  <th className="px-6 py-4">Total Purchases</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block leading-tight">{cust.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">ID: {cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 block leading-tight">{cust.email}</span>
                      <span className="text-xs text-slate-400 mt-1 block">Tel: {cust.phone}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-800">
                      {cust.ordersCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                      ₹{cust.totalPurchase.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {cust.joinedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        cust.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleBlockCustomer(cust.email, cust.status)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-xl"
                          title={cust.status === 'Active' ? 'Block Account' : 'Activate Account'}
                        >
                          <Icons.BlockIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(cust.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl"
                          title="Delete Record"
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
              <span className="text-3xl">👥</span>
              <p className="text-slate-400 text-sm mt-3">No matching customer profile found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
