import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Line } from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';

export const DashboardOverview = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const { kpi, charts, tables } = useAnalytics(dateRange);

  // Monochromatic Maroon/Burgundy theme to match var(--color-primary) #800020
  const COLORS = ['#800020', '#A31C39', '#C53952', '#E8566B', '#FF7385', '#FF919F'];
  const STATUS_COLORS = ['#800020', '#C53952', '#FF7385', '#9CA3AF', '#D1D5DB', '#F87171'];

  const KpiCard = ({ title, value, subtitle, color, bgColor, icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        {(subtitle || trend !== undefined) && (
          <p className="text-xs text-slate-500 mt-2 font-medium">
             {trend !== undefined && (
               <span className={`mr-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
               </span>
             )}
             {subtitle}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: bgColor, color: color }}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time performance metrics</p>
        </div>
        
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex-wrap">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'last7days', label: '7 Days' },
            { id: 'last30days', label: '30 Days' },
            { id: 'thisMonth', label: 'This Month' },
            { id: 'thisYear', label: 'This Year' },
            { id: 'all', label: 'All Time' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setDateRange(filter.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${dateRange === filter.id ? 'bg-[#800020] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" value={`₹${kpi.totalRevenue.toLocaleString()}`} subtitle="vs previous period" trend={kpi.revGrowth} color="#800020" bgColor="#fdf2f2"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KpiCard 
          title="Total Orders" value={kpi.totalOrders} subtitle="vs previous period" trend={kpi.orderGrowth} color="#A31C39" bgColor="#fce7ea"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <KpiCard 
          title="AOV" value={`₹${kpi.averageOrderValue.toLocaleString()}`} subtitle="Average Order Value" color="#C53952" bgColor="#fad1d8"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <KpiCard 
          title="Low Stock Alerts" value={kpi.lowStock + kpi.outOfStock} subtitle={`${kpi.outOfStock} items out of stock`} color="#E8566B" bgColor="#ffd9de"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Revenue Trend</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {charts.timeSeriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#800020" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#800020" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
            ) : <p className="text-slate-400 font-medium">No data available for this period.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Top Products by Units Sold</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {tables.bestSellers && tables.bestSellers.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tables.bestSellers.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(name) => name.length > 15 ? name.substring(0, 15) + '...' : name} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="unitsSold" name="Units Sold" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {tables.bestSellers.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : <p className="text-slate-400 font-medium">No sales data available.</p>}
          </div>
        </div>
      </div>

      {/* Analytics Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Sales Graphs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Category Sales</h3>
          <div className="h-64 w-full flex items-center justify-center">
            {charts.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {charts.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            ) : <p className="text-slate-400 font-medium text-sm">No category sales data.</p>}
          </div>
        </div>

        {/* Orders Analytics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Order Status</h3>
          <div className="h-64 w-full flex items-center justify-center">
            {charts.ordersAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.ordersAnalytics} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {charts.ordersAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            ) : <p className="text-slate-400 font-medium text-sm">No order data.</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {tables.recentActivity.length > 0 ? tables.recentActivity.map(act => (
              <div key={act.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent transition-colors">
                <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${act.type === 'order' ? 'bg-indigo-500' : act.type === 'cancelled' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{act.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{act.details}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">{new Date(act.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )) : <p className="text-slate-400 font-medium text-sm text-center mt-10">No recent activity.</p>}
          </div>
        </div>
      </div>

      {/* Row 3 - Payments, Customers & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Best Sellers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Best Selling Products</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 h-64">
            {tables.bestSellers.length > 0 ? tables.bestSellers.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="font-black text-slate-300 text-xl w-6 text-center">{idx + 1}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-slate-500">{p.unitsSold} meters sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">₹{p.revenue.toLocaleString()}</p>
                </div>
              </div>
            )) : <p className="text-slate-400 font-medium text-sm text-center mt-10">No products sold in this period.</p>}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Top Customers</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 h-64">
            {tables.topCustomers.length > 0 ? tables.topCustomers.map((c, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.orderCount} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">₹{c.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            )) : <p className="text-slate-400 font-medium text-sm text-center mt-10">No customer data.</p>}
          </div>
        </div>

        {/* Payment Analytics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <h3 className="font-bold text-slate-800 text-lg mb-6 w-full text-left">Payment Summary</h3>
          
          <div className="w-full space-y-6">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Online Payments</p>
              <p className="text-3xl font-black text-indigo-600">₹{kpi.totalOnlinePayments.toLocaleString()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                 <p className="text-lg font-black text-slate-700">₹{kpi.totalRevenue.toLocaleString()}</p>
               </div>
               <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                 <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Pending Orders</p>
                 <p className="text-lg font-black text-amber-600">{kpi.pendingPaymentsCount}</p>
               </div>
            </div>
            <div className="pt-2 text-xs text-slate-500 font-medium text-left">
              * Total Revenue only counts paid and successfully delivered/shipped online/COD orders.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
