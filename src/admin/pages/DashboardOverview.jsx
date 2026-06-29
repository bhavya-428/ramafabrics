import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const DashboardOverview = ({ setActiveTab }) => {
  const { products, orders, users, currentUser } = useContext(ShopContext);

  // Stats Calculations
  const totalProducts = products.length;
  const totalCategories = Array.from(new Set(products.map(p => p.category))).length;
  const totalOrders = orders.length;
  
  const pendingOrders = orders.filter(o => 
    o.status === 'Pending Payment' || o.status === 'Paid' || o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Packed' || o.status === 'Shipped'
  ).length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  
  const totalCustomers = users.length || Array.from(new Set(orders.map(o => o.shippingInfo.phone))).length + 3; // Fallback seed
  
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Pending Payment' ? sum + o.total : sum, 0);
  
  // Today's revenue calculation
  const todayStr = new Date().toDateString();
  const todayRevenue = orders.reduce((sum, o) => {
    const isToday = new Date(o.createdAt).toDateString() === todayStr;
    const isPaid = o.status !== 'Pending Payment';
    return isToday && isPaid ? sum + o.total : sum;
  }, 0);

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  const cardStyle = "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow";

  // Mock charts sales labels/data for the SVG graph
  const salesData = [3200, 4800, 3900, 6200, 5100, 7800, 9200];
  const salesDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monthlyRevData = [12000, 19000, 15000, 28000, 22000, 31000, 38000, 45000, 41000, 49000, 52000, totalRevenue || 58000];
  const monthlyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Render a clean SVG Line Chart for Weekly Sales
  const renderLineChart = () => {
    const maxVal = Math.max(...salesData) * 1.1;
    const height = 150;
    const width = 500;
    const padding = 20;

    const points = salesData.map((val, index) => {
      const x = padding + (index * (width - padding * 2)) / (salesData.length - 1);
      const y = height - padding - (val * (height - padding * 2)) / maxVal;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F1F5F9" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F1F5F9" strokeDasharray="4 4" />
        
        {/* Gradient fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`}
          fill="url(#chartGradient)"
        />

        {/* Path line */}
        <polyline
          fill="none"
          stroke="#4F46E5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {salesData.map((val, index) => {
          const x = padding + (index * (width - padding * 2)) / (salesData.length - 1);
          const y = height - padding - (val * (height - padding * 2)) / maxVal;
          return (
            <g key={index} className="group">
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#FFFFFF"
                stroke="#4F46E5"
                strokeWidth="2.5"
                className="cursor-pointer hover:r-6 hover:fill-indigo-600 transition-all"
              />
              <title>{salesDays[index]}: ₹{val}</title>
            </g>
          );
        })}

        {/* Day Labels */}
        {salesDays.map((day, index) => {
          const x = padding + (index * (width - padding * 2)) / (salesDays.length - 1);
          return (
            <text key={index} x={x} y={height - 2} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">
              {day}
            </text>
          );
        })}
      </svg>
    );
  };

  // Render a clean SVG Bar Chart for Monthly Revenue
  const renderBarChart = () => {
    const maxVal = Math.max(...monthlyRevData) * 1.1;
    const height = 150;
    const width = 500;
    const padding = 20;
    const barWidth = 22;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F1F5F9" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F1F5F9" strokeDasharray="4 4" />

        {monthlyRevData.map((val, index) => {
          const x = padding + (index * (width - padding * 2)) / (monthlyRevData.length - 1) - barWidth / 2;
          const barHeight = (val * (height - padding * 2)) / maxVal;
          const y = height - padding - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx="3"
                fill="#818CF8"
                className="hover:fill-indigo-600 transition-colors cursor-pointer"
              />
              <title>{monthlyMonths[index]}: ₹{val}</title>
            </g>
          );
        })}

        {/* Month Labels */}
        {monthlyMonths.map((month, index) => {
          const x = padding + (index * (width - padding * 2)) / (monthlyMonths.length - 1);
          return (
            <text key={index} x={x} y={height - 2} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">
              {month}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hi, {currentUser?.name || 'Admin'}</h2>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here is a summary of your fabrics e-commerce business performance.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className={cardStyle}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <span className="font-bold text-lg">₹</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            <span className="text-emerald-500 font-semibold">↑ 12%</span> vs last month
          </p>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Sales</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">₹{todayRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <span className="font-bold text-lg">₹</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            Today's confirmed orders
          </p>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Orders Logged</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">{totalOrders}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Icons.OrdersIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            <span className="text-indigo-600 font-semibold">{pendingOrders} pending</span> action
          </p>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Customers</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">{totalCustomers}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Icons.CustomersIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            Registrations & guest buyers
          </p>
        </div>

        <div className={cardStyle}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Health</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">
                {outOfStockProducts > 0 ? `${outOfStockProducts} Out` : 'Perfect'}
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl ${
              outOfStockProducts > 0 ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'
            }`}>
              <Icons.InventoryIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            <span className="text-red-500 font-semibold">{lowStockProducts} low stock</span> items
          </p>
        </div>
      </div>

      {/* Analytics Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-800 text-base">Sales Overview</h4>
              <p className="text-xs text-slate-400">Weekly sales trajectory in INR</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">Weekly</span>
          </div>
          <div className="pt-4">
            {renderLineChart()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-800 text-base">Monthly Revenue</h4>
              <p className="text-xs text-slate-400">Revenue collection history in INR</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">Yearly</span>
          </div>
          <div className="pt-4">
            {renderBarChart()}
          </div>
        </div>
      </div>

      {/* Tables section: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-bold text-slate-800 text-base">Recent Orders</h4>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Manage all orders →
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {orders.length > 0 ? (
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead>
                  <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="text-slate-700 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">#{order.id}</td>
                      <td className="py-3">{order.shippingInfo?.name || 'Guest'}</td>
                      <td className="py-3 max-w-[150px] truncate">
                        {order.items.map(i => i.product.name).join(', ')}
                      </td>
                      <td className="py-3 font-medium">₹{order.total}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700' :
                          order.status === 'Paid' ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10">
                <p className="text-slate-400 text-sm">No orders recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock / Inventory Alerts column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-bold text-slate-800 text-base">Low Stock Alerts</h4>
            <button 
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Adjust →
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-64 pr-2">
            {products.filter(p => p.stock <= 5).length > 0 ? (
              products.filter(p => p.stock <= 5).slice(0, 5).map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100/70 transition-colors border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 border border-slate-100 flex-shrink-0 overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</p>
                      <span className="text-[10px] text-slate-400">{prod.category}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    prod.stock === 0 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {prod.stock} {prod.category === 'Ready-to-Wear' ? 'pcs' : 'm'}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10">
                <span className="text-3xl">🎉</span>
                <p className="text-slate-400 text-xs mt-2">All stock items are healthy!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
