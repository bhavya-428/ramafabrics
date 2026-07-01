import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const OrderManagement = ({ showToast }) => {
  const { orders, updateOrderStatus } = useContext(ShopContext);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');

  // Details drawer / invoice print modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoicePrintOpen, setIsInvoicePrintOpen] = useState(false);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} marked as "${newStatus}"`, 'success');
  };

  const handlePrint = (order) => {
    setSelectedOrder(order);
    setIsInvoicePrintOpen(true);
    // Let DOM render, then trigger print dialog
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const exportOrdersCsv = () => {
    // Generate a simple client-side CSV download
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Items', 'Total Amount', 'Payment Method', 'Status', 'Date'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.shippingInfo?.name || 'N/A',
      o.shippingInfo?.phone || 'N/A',
      o.items.map(i => `${i.product.name} (x${i.quantity})`).join('; '),
      `INR ${o.total}`,
      o.paymentMethod || 'UPI',
      o.status,
      new Date(o.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rama_fabrics_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Orders spreadsheet exported!', 'success');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const customerName = order.shippingInfo?.name || '';
    const phone = order.shippingInfo?.phone || '';
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPayment = paymentMethodFilter === 'All' || order.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Orders</h2>
          <p className="text-sm text-slate-500 mt-1">Track payments, manage dispatch stages, and print invoice documents.</p>
        </div>
        <button
          onClick={exportOrdersCsv}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          <span>Export CSV Spreadsheet</span>
        </button>
      </div>

      {/* Filter / Search dashboard */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search orders by ID, name, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <Icons.SearchIcon className="absolute left-4 top-2.5 w-5 h-5 text-slate-400" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Paid">Paid</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Payments</option>
            <option value="UPI QR">UPI QR</option>
          </select>
        </div>
      </div>

      {/* Orders table list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Address & Contact</th>
                  <th className="px-6 py-4">Items / Products</th>
                  <th className="px-6 py-4">Bill Total</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 block leading-tight">{order.shippingInfo?.name || 'Guest'}</span>
                      <span className="text-xs text-slate-400 mt-1 block">{order.shippingInfo?.phone || 'No phone'}</span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {order.shippingInfo?.address}, {order.shippingInfo?.city} - {order.shippingInfo?.pincode}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                      <div className="space-y-1">
                        {order.items.map((i, idx) => (
                          <span key={idx} className="block text-xs text-slate-700 font-medium truncate">
                            {i.product.name} (x{i.quantity} {i.product.category === 'Ready-to-Wear' ? 'pc' : 'm'})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                      ₹{order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none border-0 shadow-sm cursor-pointer ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="Pending Payment">Pending Payment</option>
                        <option value="Paid">Paid</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Returned">Returned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl"
                          title="View Details"
                        >
                          <Icons.EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(order)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                          title="Print Invoice"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 text-center">
              <span className="text-3xl">📦</span>
              <p className="text-slate-400 text-sm mt-3">No customer orders match your selection.</p>
            </div>
          )}
        </div>
      </div>

      {/* ORDER DETAILS SLIDE-OVER DRAWER */}
      {selectedOrder && !isInvoicePrintOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          <div 
            className="absolute inset-0"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Order Details</h3>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">ID: #{selectedOrder.id} • {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Icons.CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content workspace */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm text-slate-700">
                  <p><strong>Name:</strong> {selectedOrder.shippingInfo?.name || 'Guest'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingInfo?.phone}</p>
                  <p><strong>WhatsApp:</strong> {selectedOrder.shippingInfo?.whatsapp}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.city} - {selectedOrder.shippingInfo?.pincode}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.product.category} • ₹{item.product.price}/{item.product.category === 'Ready-to-Wear' ? 'pc' : 'm'}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900 whitespace-nowrap">
                        x{item.quantity} {item.product.category === 'Ready-to-Wear' ? 'pcs' : 'm'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billing Summary</h4>
                <div className="border-t border-slate-100 pt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount {selectedOrder.couponApplied ? `(${selectedOrder.couponApplied})` : ''}</span>
                      <span>- ₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.paymentMethod || 'UPI QR'}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900 text-base">
                    <span>Total Paid</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handlePrint(selectedOrder)}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Print Invoice Document
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-100"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE SHEET (Normally hidden from viewport unless printed) */}
      {isInvoicePrintOpen && selectedOrder && (
        <div className="hidden">
          <div id="printable-invoice" className="p-8 max-w-2xl bg-white text-slate-800 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">RAMA FABRICS</h1>
                <p className="text-xs text-slate-500 mt-1">Brindavan Colony, Vijayawada, AP 520010</p>
                <p className="text-xs text-slate-500">Phone: 96188 96169</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold text-indigo-700 uppercase">INVOICE</h2>
                <p className="text-xs text-slate-600 mt-1"><strong>Invoice #:</strong> {selectedOrder.id}</p>
                <p className="text-xs text-slate-600"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-400 uppercase mb-1">Billed To:</h3>
                <p className="font-semibold text-slate-900">{selectedOrder.shippingInfo?.name}</p>
                <p>{selectedOrder.shippingInfo?.address}</p>
                <p>{selectedOrder.shippingInfo?.city} - {selectedOrder.shippingInfo?.pincode}</p>
                <p>Phone: {selectedOrder.shippingInfo?.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-slate-400 uppercase mb-1">Payment Method:</h3>
                <p className="font-semibold">{selectedOrder.paymentMethod || 'UPI QR'}</p>
                <p className="text-emerald-600 font-semibold mt-1">Status: Paid / Confirmed</p>
              </div>
            </div>

            <table className="min-w-full text-xs text-left divide-y divide-slate-200">
              <thead>
                <tr className="text-slate-400 uppercase font-bold">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-semibold">{item.product.name}</td>
                    <td className="py-2 text-center">{item.quantity} {item.product.category === 'Ready-to-Wear' ? 'pc' : 'm'}</td>
                    <td className="py-2 text-right">₹{item.product.price}</td>
                    <td className="py-2 text-right">₹{item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-right text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>- ₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 text-sm">
                  <span>Total Amount Paid:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-16 text-center text-[10px] text-slate-400">
              Thank you for shopping at Rama Fabrics! This is a computer generated invoice and requires no signature.
            </div>

            {/* Print close button */}
            <div className="flex justify-center pt-8 print:hidden">
              <button 
                onClick={() => setIsInvoicePrintOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Close Print View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
