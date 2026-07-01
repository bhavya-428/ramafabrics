import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const DashboardOverview = () => {
  const { currentUser, orders, products, users } = useContext(ShopContext);

  // Calculate Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending Payment' || o.status === 'Paid').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const totalCustomers = users.filter(u => !u.isAdmin).length;
  
  const totalRevenue = orders
    .filter(o => o.status !== 'Pending Payment' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const KpiCard = ({ title, value, color, bgColor, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: bgColor, color: color }}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {currentUser?.name || 'Admin'}!</p>
      </div>

      {/* 9 KPI Cards (11 metrics total including the lists below) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard 
          title="Total Orders" value={totalOrders} color="#4f46e5" bgColor="#e0e7ff"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <KpiCard 
          title="Pending Orders" value={pendingOrders} color="#eab308" bgColor="#fef9c3"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Delivered Orders" value={deliveredOrders} color="#14b8a6" bgColor="#ccfbf1"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Cancelled Orders" value={cancelledOrders} color="#f43f5e" bgColor="#ffe4e6"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="#7c3aed" bgColor="#ede9fe"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Total Customers" value={totalCustomers} color="#3b82f6" bgColor="#dbeafe"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <KpiCard 
          title="Total Products" value={totalProducts} color="#6366f1" bgColor="#e0e7ff"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <KpiCard 
          title="Low Stock Products" value={lowStockProducts.length} color="#f97316" bgColor="#ffedd5"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <KpiCard 
          title="Out of Stock" value={outOfStockProducts.length} color="#ef4444" bgColor="#fee2e2"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-4 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">#{order.id}</p>
                  <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">₹{order.total}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>{order.status}</p>
                </div>
              </div>
            )) : <p className="text-slate-500 text-sm">No recent orders.</p>}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Inventory Alerts</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {outOfStockProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100 text-sm text-rose-700">
                <span className="font-bold">⚠️ Out of Stock:</span> {p.name}
              </div>
            ))}
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100 text-sm text-orange-700">
                <span className="font-bold">⚠️ Low Stock:</span> {p.name} ({p.stock} remaining)
              </div>
            ))}
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
              <div className="p-4 text-center rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
                ✓ Inventory levels look good.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
