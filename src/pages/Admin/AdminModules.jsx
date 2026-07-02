import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShopContext } from '../../context/ShopContext';

export const CustomersTab = () => {
  const { users } = useContext(ShopContext);
  const customers = users.filter(u => !u.isAdmin);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Customers List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
              <th className="pb-4 font-bold">Name</th>
              <th className="pb-4 font-bold">Email</th>
              <th className="pb-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {customers.map((c, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-4 font-bold text-slate-800">{c.name}</td>
                <td className="py-4 text-slate-600">{c.email}</td>
                <td className="py-4"><span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold">Active</span></td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-slate-500">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const OrdersTab = () => {
  const { orders, updateOrderStatus } = useContext(ShopContext);
  const [confirmModal, setConfirmModal] = useState(null); // { orderId, newStatus, currentStatus }

  const handleAction = (order, nextStatus) => {
    setConfirmModal({ orderId: order.id, newStatus: nextStatus, currentStatus: order.status });
  };

  const confirmAction = () => {
    if (!confirmModal) return;
    updateOrderStatus(confirmModal.orderId, confirmModal.newStatus);
    setConfirmModal(null);
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'Paid': return { label: 'Confirm Order', next: 'Confirmed', color: 'bg-indigo-600 hover:bg-indigo-700' };
      case 'Confirmed': return { label: 'Ship Order', next: 'Shipped', color: 'bg-sky-600 hover:bg-sky-700' };
      case 'Shipped': return { label: 'Mark Delivered', next: 'Delivered', color: 'bg-emerald-600 hover:bg-emerald-700' };
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {orders.length > 0 ? orders.map(order => {
        const action = getNextAction(order.status);
        return (
        <div key={order.id} className="border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-indigo-200 transition-colors bg-white">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="font-black text-lg text-slate-800">#{order.id}</span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
                ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                  order.status === 'Shipped' ? 'bg-sky-100 text-sky-700' : 
                  order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-700' : 
                  order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'}`
              }>
                {order.status}
              </span>
            </div>
            
            <div className="text-sm text-slate-700">
              <span className="font-bold block text-slate-900">{order.shippingInfo?.name || 'Customer'}</span>
              <span>{order.shippingInfo?.phone || 'N/A'} | {order.shippingInfo?.address || 'N/A'}, {order.shippingInfo?.city || 'N/A'}</span>
            </div>

            {/* Status History Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <p className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Status History</p>
                <div className="space-y-2">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      <span className="font-semibold text-slate-700 w-24">{h.status}</span>
                      <span className="text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
             <p className="font-bold text-sm mb-2 text-slate-900">Items:</p>
             <ul className="text-sm text-slate-600 space-y-1">
               {order.items.map((item, idx) => (
                 <li key={idx}>• {item.product.name} x {item.quantity}m</li>
               ))}
             </ul>
             <p className="font-black text-lg mt-4 text-indigo-600">₹{order.total}</p>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            {action && (
              <button onClick={() => handleAction(order, action.next)} className={`w-full text-white py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors ${action.color}`}>
                {action.label}
              </button>
            )}
            {order.status === 'Pending Payment' && (
              <button onClick={() => handleAction(order, 'Paid')} className="w-full bg-amber-500 text-white hover:bg-amber-600 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors">
                Mark as Paid (Manual)
              </button>
            )}
            {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped' && (
              <button onClick={() => handleAction(order, 'Cancelled')} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-lg font-bold text-sm transition-colors">
                Cancel Order
              </button>
            )}
            <a href={`https://wa.me/${order.shippingInfo?.whatsapp || ''}`} target="_blank" rel="noreferrer" className="w-full text-center bg-[#25D366] text-white py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-[#128C7E] transition-colors">
              Message Customer
            </a>
          </div>
        </div>
      )}) : <p className="text-slate-500 text-center py-12">No orders found.</p>}

      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Status Update</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to change the status of Order #{confirmModal.orderId} from <span className="font-bold">{confirmModal.currentStatus}</span> to <span className="font-bold text-indigo-600">{confirmModal.newStatus}</span>?
              {confirmModal.newStatus === 'Cancelled' && " This will automatically restore the fabric stock to your inventory."}
              {(confirmModal.newStatus === 'Confirmed' || confirmModal.newStatus === 'Shipped' || confirmModal.newStatus === 'Delivered') && " The customer will automatically be notified of this update."}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmModal(null)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Go Back</button>
              <button onClick={confirmAction} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors">Confirm Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductManagementTab = () => {
  const { products, updateProductStock, inventoryLogs, addProduct, updateProduct, deleteProduct, categories } = useContext(ShopContext);
  const [activeSubTab, setActiveSubTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialForm = { name: '', category: categories[0]?.name || '', stock: 0, price: '', originalPrice: '', description: '', image: '' };
  const [productForm, setProductForm] = useState(initialForm);

  const regularProducts = products.filter(p => !p.isOfferItem);
  const totalStock = regularProducts.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = regularProducts.filter(p => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = regularProducts.filter(p => p.stock === 0);

  const handleEdit = (p) => {
    setEditingProduct(p);
    setProductForm(p);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setProductForm(initialForm);
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProductForm(prev => ({...prev, image: dataUrl}));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const formatted = { 
      ...productForm, 
      price: parseFloat(productForm.price), 
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined, 
      stock: parseFloat(productForm.stock) 
    };
    if (editingProduct) {
      updateProduct(formatted);
    } else {
      addProduct(formatted);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Product & Inventory Management</h2>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors">
          + Add New Product
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{regularProducts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Stock (Meters)</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{totalStock}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm bg-orange-50/50">
          <p className="text-sm font-medium text-orange-600">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">{lowStockProducts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-sm bg-rose-50/50">
          <p className="text-sm font-medium text-rose-600">Out of Stock</p>
          <p className="text-3xl font-bold text-rose-700 mt-2">{outOfStockProducts.length}</p>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex gap-6">
          <button onClick={() => setActiveSubTab('products')} className={`font-medium text-sm pb-4 -mb-4 border-b-2 transition-colors ${activeSubTab === 'products' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Manage Products & Stock</button>
          <button onClick={() => setActiveSubTab('logs')} className={`font-medium text-sm pb-4 -mb-4 border-b-2 transition-colors ${activeSubTab === 'logs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Inventory Logs</button>
        </div>

        <div className="p-6">
          {activeSubTab === 'products' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
                    <th className="pb-4 font-bold">Product</th>
                    <th className="pb-4 font-bold">Category</th>
                    <th className="pb-4 font-bold">Price</th>
                    <th className="pb-4 font-bold">Current Stock</th>
                    <th className="pb-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {regularProducts.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-4 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover border border-slate-200" />
                        <span className="font-medium text-slate-800">{p.name}</span>
                        {p.stock === 0 && <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Out of Stock</span>}
                      </td>
                      <td className="py-4 text-slate-600">{p.category}</td>
                      <td className="py-4 text-slate-600">₹{p.price}</td>
                      <td className={`py-4 font-bold ${p.stock === 0 ? 'text-rose-600' : p.stock <= 5 ? 'text-orange-600' : 'text-emerald-600'}`}>
                        {p.stock} m
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-800 font-semibold mr-3">Edit</button>
                        <button onClick={() => {if(window.confirm('Delete this product?')) deleteProduct(p.id)}} className="text-rose-600 hover:text-rose-800 font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
                    <th className="pb-4 font-bold">Date & Time</th>
                    <th className="pb-4 font-bold">Action Type</th>
                    <th className="pb-4 font-bold">Product</th>
                    <th className="pb-4 font-bold text-center">Prev</th>
                    <th className="pb-4 font-bold text-center">Change</th>
                    <th className="pb-4 font-bold text-center">New</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {inventoryLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 font-medium text-slate-800">{log.actionType}</td>
                      <td className="py-3 text-slate-700">{log.productName}</td>
                      <td className="py-3 text-center text-slate-500">{log.prevStock}</td>
                      <td className={`py-3 text-center font-bold ${log.qtyChange > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {log.qtyChange > 0 ? '+' : ''}{log.qtyChange}
                      </td>
                      <td className="py-3 text-center font-bold text-slate-800">{log.newStock}</td>
                    </tr>
                  ))}
                  {inventoryLogs.length === 0 && (
                    <tr><td colSpan="6" className="py-8 text-center text-slate-500">No inventory logs recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Stock (Meters)</label>
                  <input type="number" required min="0" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input type="number" required min="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price (optional)</label>
                  <input type="number" min="0" value={productForm.originalPrice || ''} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="For strike-through" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image</label>
                <div className="flex gap-2">
                  {productForm.image && productForm.image.startsWith('data:') ? (
                    <div className="w-full px-4 py-2 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={productForm.image} alt="Preview" className="w-8 h-8 rounded object-cover" />
                        <span className="text-sm text-slate-500 font-medium">Local image selected</span>
                      </div>
                      <button type="button" onClick={() => setProductForm({...productForm, image: ''})} className="text-rose-500 text-sm font-bold">Remove</button>
                    </div>
                  ) : (
                    <input type="text" required value={productForm.image || ''} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://... or upload image" />
                  )}
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl cursor-pointer flex items-center shrink-0 border border-slate-200 transition-colors font-semibold text-sm">
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export const CategoriesTab = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useContext(ShopContext);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', enabled: true });

  const handleEdit = (c) => {
    setEditingCategory(c);
    setForm({ name: c.name, enabled: c.enabled });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', enabled: true });
    setShowModal(true);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory({ ...editingCategory, ...form });
    } else {
      addCategory({ id: Date.now().toString(), ...form });
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Categories Management</h2>
        <button onClick={handleAdd} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors">
          + Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 tracking-wider">
              <th className="pb-4 font-bold">Category Name</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="py-4 font-bold text-slate-800">{c.name}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${c.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {c.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:text-indigo-800 font-semibold mr-3">Edit</button>
                  <button onClick={() => {if(window.confirm('Delete category?')) deleteCategory(c.id)}} className="text-rose-600 hover:text-rose-800 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} id="enabled" className="w-4 h-4 text-indigo-600 rounded" />
                <label htmlFor="enabled" className="text-sm font-semibold text-slate-700">Enable Category</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export const LabelsTab = () => {
  const { products, updateProduct } = useContext(ShopContext);
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
        <p className="text-sm text-slate-500 mt-1">Select items to feature prominently on the storefront homepage.</p>
      </div>
      <input 
        type="text" 
        placeholder="Search products by name..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 border border-slate-200 rounded-xl mb-6 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
      />
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {products
          .filter(p => search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 50)
          .map(product => (
            <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow bg-white gap-4">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                <span className="font-bold text-slate-800">{product.name}</span>
              </div>
              <div className="flex flex-wrap gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-indigo-600">
                  <input type="checkbox" checked={!!product.isFeatured} onChange={() => updateProduct({ ...product, isFeatured: !product.isFeatured })} className="w-4 h-4 text-indigo-600 rounded" /> Featured Item
                </label>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export const OffersTab = () => {
  const { products, updateProduct, addProduct, categories } = useContext(ShopContext);
  const [search, setSearch] = useState('');
  const [showAddView, setShowAddView] = useState(false);

  // New product creation state for Offers
  const [showModal, setShowModal] = useState(false);
  const initialForm = { name: '', category: categories[0]?.name || '', stock: 0, price: '', originalPrice: '', description: '', image: '', isOfferItem: true };
  const [productForm, setProductForm] = useState(initialForm);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProductForm(prev => ({...prev, image: dataUrl}));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const formatted = { 
      ...productForm, 
      price: parseFloat(productForm.price), 
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined, 
      stock: parseFloat(productForm.stock),
      isOfferItem: true
    };
    addProduct(formatted);
    setShowModal(false);
    setProductForm(initialForm);
    alert('New offer item created!');
  };

  const activeOffers = products.filter(p => p.isOfferItem);

  const handleSetOffer = (product) => {
    const discountPrice = prompt(`Enter new discounted price for ${product.name} (Current: ₹${product.price}):`, product.price);
    if (discountPrice && !isNaN(discountPrice) && Number(discountPrice) < product.price) {
      updateProduct({
        ...product,
        originalPrice: product.originalPrice || product.price,
        price: Number(discountPrice),
        isOfferItem: true
      });
      alert(`Offer applied! ${product.name} is now ₹${discountPrice}.`);
    } else if (discountPrice) {
      alert('Invalid price. Discounted price must be lower than the current price.');
    }
  };

  const handleRemoveOffer = (product) => {
    if (window.confirm(`Remove offer from ${product.name}?`)) {
      updateProduct({
        ...product,
        price: product.originalPrice || product.price,
        originalPrice: null,
        isOfferItem: false
      });
    }
  };

  if (showAddView) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Add Items to Offers</h2>
            <p className="text-sm text-slate-500 mt-1">Search and select items to put on sale.</p>
          </div>
          <button onClick={() => setShowAddView(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
            Back to Active Offers
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Search products by name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 border border-slate-200 rounded-xl mb-6 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
        />
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {products
            .filter(p => search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 50)
            .map(product => (
              <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow bg-white gap-4">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                  <div>
                    <span className="font-bold text-slate-800 block">{product.name}</span>
                    {product.isOfferItem ? (
                      <span className="text-xs text-rose-500 font-bold">On Sale: ₹{product.price} <strike className="text-slate-400 font-normal">₹{product.originalPrice}</strike></span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Price: ₹{product.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.isOfferItem ? (
                    <button onClick={() => handleRemoveOffer(product)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                      Remove Offer
                    </button>
                  ) : (
                    <button onClick={() => handleSetOffer(product)} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-lg transition-colors">
                      Add Discount
                    </button>
                  )}
                </div>
              </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Active Offers ({activeOffers.length})</h2>
          <p className="text-sm text-slate-500 mt-1">These items are currently displayed in the Offers section on the storefront.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
            + Create New Offer Item
          </button>
          <button onClick={() => setShowAddView(true)} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
            Select Existing Item
          </button>
        </div>
      </div>
      
      {activeOffers.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-slate-500 font-medium mb-4">No active offers right now.</p>
          <button onClick={() => setShowAddView(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100">
            Create your first offer
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {activeOffers.map(product => (
              <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-rose-100 bg-rose-50/30 rounded-xl hover:shadow-sm transition-shadow gap-4">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                  <div>
                    <span className="font-bold text-slate-800 block">{product.name}</span>
                    <span className="text-xs text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded mr-2">Sale</span>
                    <span className="text-xs text-rose-500 font-bold">₹{product.price} <strike className="text-slate-400 font-normal">₹{product.originalPrice}</strike></span>
                  </div>
                </div>
                <button onClick={() => handleRemoveOffer(product)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                  Remove Offer
                </button>
              </div>
          ))}
        </div>
      )}

      {/* Create New Offer Item Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 shrink-0 p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Create New Offer Item</h3>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Stock (Meters)</label>
                  <input type="number" required min="0" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Offer Price (₹)</label>
                  <input type="number" required min="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price</label>
                  <input type="number" required min="0" value={productForm.originalPrice || ''} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="For strike-through" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image</label>
                <div className="flex gap-2">
                  {productForm.image && productForm.image.startsWith('data:') ? (
                    <div className="w-full px-4 py-2 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={productForm.image} alt="Preview" className="w-8 h-8 rounded object-cover" />
                        <span className="text-sm text-slate-500 font-medium">Local image selected</span>
                      </div>
                      <button type="button" onClick={() => setProductForm({...productForm, image: ''})} className="text-rose-500 text-sm font-bold">Remove</button>
                    </div>
                  ) : (
                    <input type="text" required value={productForm.image || ''} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://... or upload image" />
                  )}
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl cursor-pointer flex items-center shrink-0 border border-slate-200 transition-colors font-semibold text-sm">
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors">Save Offer Product</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export const AdminProfileTab = () => {
  const { currentUser } = useContext(ShopContext);
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
      <div className="relative w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
        {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{currentUser?.name}</h2>
      <p className="text-slate-500 mb-6">{currentUser?.email}</p>
      
      {!editing ? (
        <button onClick={() => setEditing(true)} className="px-5 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100">Edit Profile (Demo)</button>
      ) : (
        <div className="text-left mt-6 max-w-md mx-auto space-y-4 p-6 border border-slate-200 rounded-xl bg-slate-50">
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
             <input type="text" defaultValue={currentUser?.name} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Email</label>
             <input type="email" defaultValue={currentUser?.email} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Profile Image URL</label>
             <input type="text" placeholder="https://..." className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" />
           </div>
           <div className="flex justify-end gap-2 pt-2">
             <button onClick={() => setEditing(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
             <button onClick={() => setEditing(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">Save Changes</button>
           </div>
        </div>
      )}
      
      <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-100 space-y-4 mt-8">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Role</label>
          <p className="font-semibold text-slate-800">Super Administrator</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase">Account Status</label>
          <p className="font-semibold text-emerald-600">Active</p>
        </div>
      </div>
    </div>
  );
};

export const HeroBannersTab = () => {
  const { heroBanners, setHeroBanners } = useContext(ShopContext);
  const [editingBanner, setEditingBanner] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const banner = {
      id: editingBanner.id || `hb_${Date.now()}`,
      image: formData.get('image'),
      tag: formData.get('tag'),
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
    };

    if (editingBanner.id) {
      setHeroBanners(heroBanners.map(b => b.id === banner.id ? banner : b));
    } else {
      setHeroBanners([...heroBanners, banner]);
    }
    setEditingBanner(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this banner?')) {
      setHeroBanners(heroBanners.filter(b => b.id !== id));
    }
  };

  if (editingBanner) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{editingBanner.id ? 'Edit Banner' : 'New Banner'}</h2>
          <button onClick={() => setEditingBanner(null)} className="text-slate-500 hover:text-slate-800">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
            <input name="image" defaultValue={editingBanner.image} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
            {editingBanner.image && <img src={editingBanner.image} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tag (e.g., NEW ARRIVALS, SALE)</label>
            <input name="tag" defaultValue={editingBanner.tag} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Main Title</label>
            <input name="title" defaultValue={editingBanner.title} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Subtitle</label>
            <input name="subtitle" defaultValue={editingBanner.subtitle} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all mt-6">
            Save Banner
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hero Banners</h2>
          <p className="text-sm text-slate-500 mt-1">Manage the large promotional slider on the storefront homepage.</p>
        </div>
        <button onClick={() => setEditingBanner({})} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm">
          + Add Banner
        </button>
      </div>
      <div className="space-y-6">
        {heroBanners.map(banner => (
          <div key={banner.id} className="flex flex-col md:flex-row gap-6 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow bg-slate-50/50">
            <img src={banner.image} alt={banner.title} className="w-full md:w-64 h-32 object-cover rounded-lg shadow-sm" />
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-xs font-black text-indigo-600 tracking-wider mb-1">{banner.tag}</span>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{banner.title}</h3>
              <p className="text-sm text-slate-500">{banner.subtitle}</p>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <button onClick={() => setEditingBanner(banner)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
              <button onClick={() => handleDelete(banner.id)} className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {heroBanners.length === 0 && <p className="text-slate-500 text-center py-10">No banners active. The hero section will be empty.</p>}
      </div>
    </div>
  );
};

export const SettingsTab = () => {
  const { settings, setSettings } = useContext(ShopContext);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSettings = { ...settings };
    for (let [key, value] of formData.entries()) {
      newSettings[key] = value;
    }
    setSettings(newSettings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Store Settings</h2>
      <p className="text-sm text-slate-500 mb-8">Manage your business information, contact details, and global website content.</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Store Name</label>
            <input name="storeName" defaultValue={settings.storeName} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contact Phone</label>
            <input name="phone" defaultValue={settings.phone} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp Number</label>
            <input name="whatsapp" defaultValue={settings.whatsapp} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Business Hours</label>
            <input name="hours" defaultValue={settings.hours} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Store Address</label>
            <textarea name="storeAddress" defaultValue={settings.storeAddress} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">UPI ID (For Payments)</label>
            <input name="upiId" defaultValue={settings.upiId} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export const PagesTab = () => {
  const { pages, setPages } = useContext(ShopContext);
  const [activePage, setActivePage] = useState('about');

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setPages({
      ...pages,
      [activePage]: {
        title: formData.get('title'),
        content: formData.get('content')
      }
    });
    alert('Page updated successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex gap-8">
      <div className="w-64 shrink-0 border-r border-slate-100 pr-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Static Pages</h2>
        <div className="space-y-2">
          {Object.keys(pages).map(key => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activePage === key ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {pages[key].title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Page Title</label>
            <input name="title" defaultValue={pages[activePage].title} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Page Content (Supports Markdown)</label>
            <textarea name="content" defaultValue={pages[activePage].content} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-96 font-mono text-sm leading-relaxed"></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all">
              Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const FAQTab = () => {
  const { faqs, setFaqs } = useContext(ShopContext);
  const [editingFaq, setEditingFaq] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const faq = {
      id: editingFaq.id || `faq_${Date.now()}`,
      question: formData.get('question'),
      answer: formData.get('answer'),
    };

    if (editingFaq.id) {
      setFaqs(faqs.map(f => f.id === faq.id ? faq : f));
    } else {
      setFaqs([...faqs, faq]);
    }
    setEditingFaq(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this FAQ?')) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  if (editingFaq) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{editingFaq.id ? 'Edit FAQ' : 'New FAQ'}</h2>
          <button onClick={() => setEditingFaq(null)} className="text-slate-500 hover:text-slate-800">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Question</label>
            <input name="question" defaultValue={editingFaq.question} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Answer</label>
            <textarea name="answer" defaultValue={editingFaq.answer} required className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-32"></textarea>
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all mt-6">
            Save FAQ
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Manage FAQs displayed on the support page.</p>
        </div>
        <button onClick={() => setEditingFaq({})} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-sm">
          + Add FAQ
        </button>
      </div>
      <div className="space-y-4">
        {faqs.map(faq => (
          <div key={faq.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex justify-between items-start gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-2">{faq.question}</h3>
              <p className="text-slate-600 text-sm">{faq.answer}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingFaq(faq)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
              <button onClick={() => handleDelete(faq.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
