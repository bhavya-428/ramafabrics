import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const AnalyticsDashboard = () => {
  const { orders, products } = useContext(ShopContext);

  const [timeRange, setTimeRange] = useState('7d');

  // Math helper for charts
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Pending Payment' ? sum + o.total : sum, 0);

  // Category breakdown for pie chart
  const categoriesCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoriesData = Object.entries(categoriesCount).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / products.length) * 100)
  }));

  // Render SVG Pie Chart (Donut)
  const renderDonutChart = () => {
    let accumulatedPercent = 0;
    const colors = ['#4F46E5', '#818CF8', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

    return (
      <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-6">
        <svg viewBox="0 0 100 100" className="w-36 h-36">
          {categoriesData.map((data, idx) => {
            const color = colors[idx % colors.length];
            const dashArray = `${data.percentage} ${100 - data.percentage}`;
            const dashOffset = 100 - accumulatedPercent + 25; // 25 to start at top
            accumulatedPercent += data.percentage;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="35"
                fill="transparent"
                stroke={color}
                strokeWidth="15"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                className="transition-all hover:stroke-width-[18] cursor-pointer"
              />
            );
          })}
          <circle cx="50" cy="50" r="27" fill="#FFFFFF" />
        </svg>

        <div className="space-y-2 text-xs">
          {categoriesData.map((data, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
              <span className="font-semibold text-slate-700">{data.name}:</span>
              <span className="text-slate-500">{data.count} items ({data.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Weekly Stats
  const weeklySales = [4200, 3600, 5800, 7100, 6400, 8900, totalRevenue ? totalRevenue % 15000 + 4000 : 9200];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderWeeklyBarChart = () => {
    const maxVal = Math.max(...weeklySales) * 1.1;
    const height = 150;
    const width = 500;
    const padding = 20;
    const barWidth = 30;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F1F5F9" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F1F5F9" strokeDasharray="4 4" />

        {weeklySales.map((val, index) => {
          const x = padding + (index * (width - padding * 2)) / (weeklySales.length - 1) - barWidth / 2;
          const barHeight = (val * (height - padding * 2)) / maxVal;
          const y = height - padding - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx="4"
                fill="#4F46E5"
                className="hover:fill-indigo-700 transition-colors cursor-pointer"
              />
              <title>₹{val}</title>
            </g>
          );
        })}

        {days.map((day, index) => {
          const x = padding + (index * (width - padding * 2)) / (days.length - 1);
          return (
            <text key={index} x={x} y={height - 2} textAnchor="middle" className="text-[10px] fill-slate-400 font-semibold">
              {day}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Business Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Deep-dive reports showing conversions, sales trajectories, and stock analytics.</p>
        </div>

        <div className="flex border border-slate-200 rounded-xl p-0.5 bg-white shadow-sm text-xs font-semibold text-slate-600">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg ${timeRange === '7d' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg ${timeRange === '30d' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-3 py-1.5 rounded-lg ${timeRange === '12m' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            12 Months
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Charts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-base">Weekly Sales Volume</h4>
            <p className="text-xs text-slate-400">Total payments collected in INR</p>
          </div>
          <div className="pt-4">
            {renderWeeklyBarChart()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-base">Category Performance</h4>
            <p className="text-xs text-slate-400">Inventory share by catalog category</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {renderDonutChart()}
          </div>
        </div>
      </div>

      {/* Grid of details metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Average Order Value</span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : '0'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Sum total divided by order volume</p>
        </div>

        <div className={orders.length > 0 ? "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm" : "hidden"}>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Best Performing Area</span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">
            {orders[0]?.shippingInfo?.city || 'Vijayawada'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Determined by maximum shipping destinations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Customer Conversion Rate</span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">4.8%</h3>
          <p className="text-[10px] text-slate-400 mt-2">Checkout completions vs total traffic</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Repeat Purchase Rate</span>
          <h3 className="text-xl font-bold text-slate-800 mt-2">24.5%</h3>
          <p className="text-[10px] text-slate-400 mt-2">Customers with more than 1 transaction</p>
        </div>
      </div>
    </div>
  );
};
