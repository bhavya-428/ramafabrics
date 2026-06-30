import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6', '#0ea5e9'];

export const DashboardOverview = () => {
  const { currentUser } = useContext(ShopContext);
  const analytics = useAnalytics();
  const { kpi, charts, tables } = analytics;

  const KpiCard = ({ title, value, icon, trend, trendText, color, bgColor }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{ backgroundColor: bgColor, color: color }}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <p className={`text-xs font-semibold mt-4 flex items-center gap-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% <span className="text-slate-400 font-normal">{trendText}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hi, {currentUser?.name || 'Store Owner'}</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here is a summary of your fabrics e-commerce business performance.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value={`₹${kpi.totalRevenue.toLocaleString('en-IN')}`} 
          trend={kpi.revGrowth} trendText="vs previous"
          color="#7c3aed" bgColor="#ede9fe"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <KpiCard 
          title="Today's Revenue" 
          value={`₹${kpi.todayRevenue.toLocaleString('en-IN')}`} 
          color="#0ea5e9" bgColor="#e0f2fe"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Monthly Revenue" 
          value={`₹${kpi.monthlyRevenue.toLocaleString('en-IN')}`} 
          color="#10b981" bgColor="#d1fae5"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <KpiCard 
          title="Average Order Value" 
          value={`₹${kpi.averageOrderValue.toLocaleString('en-IN')}`} 
          trend={kpi.aovGrowth} trendText="vs previous"
          color="#f59e0b" bgColor="#fef3c7"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
        />
        <KpiCard 
          title="Total Orders" 
          value={kpi.totalOrders} 
          trend={kpi.orderGrowth} trendText="vs previous"
          color="#4f46e5" bgColor="#e0e7ff"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <KpiCard 
          title="Pending Orders" 
          value={kpi.statusCounts['Pending'] || 0} 
          color="#eab308" bgColor="#fef9c3"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Delivered Orders" 
          value={kpi.statusCounts['Delivered'] || 0} 
          color="#14b8a6" bgColor="#ccfbf1"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Cancelled Orders" 
          value={kpi.statusCounts['Cancelled'] || 0} 
          color="#f43f5e" bgColor="#ffe4e6"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Total Customers" 
          value={kpi.totalCustomers} 
          color="#3b82f6" bgColor="#dbeafe"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <KpiCard 
          title="New Customers" 
          value={kpi.newCustomers} 
          color="#8b5cf6" bgColor="#ede9fe"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
        />
        <KpiCard 
          title="Low Stock Products" 
          value={kpi.lowStock} 
          color="#f97316" bgColor="#ffedd5"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
        <KpiCard 
          title="Out of Stock" 
          value={kpi.outOfStock} 
          color="#ef4444" bgColor="#fee2e2"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
      </div>

      {/* Charts Section 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Weekly Sales Overview</h3>
              <p className="text-xs text-slate-400 mt-1">Real-time daily revenue trajectory in INR</p>
            </div>
            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-lg">LAST 7 DAYS</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.last7Days} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#475569', fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6}} fill="url(#colorRevenue)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-1">Net collected revenue per month</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-lg">YEARLY</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Section 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Orders Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.ordersAnalytics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.ordersAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Revenue vs Orders (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={charts.last7Days}>
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" barSize={20} fill="#0ea5e9" name="Orders Volume" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} name="Revenue (₹)" dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Category Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {charts.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Low Stock Alert</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Current Stock</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {tables.lowStockAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">All products are well stocked!</td>
                  </tr>
                ) : tables.lowStockAlerts.slice(0, 5).map(p => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded object-cover" alt={p.name} />
                      <span className="font-medium text-slate-700 text-sm">{p.name}</span>
                    </td>
                    <td className="py-3 text-sm font-bold text-slate-700">{p.stock}</td>
                    <td className="py-3">
                      <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">
                        Critical
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Restock</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Best Sellers and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Best Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold text-right">Units Sold</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {tables.bestSellers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-400">No sales yet.</td>
                  </tr>
                ) : tables.bestSellers.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded object-cover" alt={p.name} />
                      <div>
                        <p className="font-medium text-slate-700 text-sm truncate w-48">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.stock} in stock</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-bold text-slate-700 text-right">{p.unitsSold}</td>
                    <td className="py-3 text-sm font-bold text-emerald-600 text-right">₹{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Recent Orders</h3>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {tables.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">No recent orders.</td>
                  </tr>
                ) : tables.recentOrders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 text-sm font-medium text-indigo-600">{o.id}</td>
                    <td className="py-3 text-sm text-slate-700">{o.shippingInfo?.name || o.userEmail}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-bold text-slate-800 text-right">₹{o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
