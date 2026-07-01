import React, { useContext, useState } from 'react';
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
  return (
    <div className="space-y-6">
      {orders.length > 0 ? orders.map(order => (
        <div key={order.id} className="border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-indigo-200 transition-colors bg-white">
          <div className="space-y-2 flex-1">
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
            <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
            <div className="pt-2 text-sm text-slate-700">
              <span className="font-bold block text-slate-900">{order.shippingInfo?.name || 'Customer'}</span>
              <span>{order.shippingInfo?.phone || 'N/A'} | {order.shippingInfo?.address || 'N/A'}, {order.shippingInfo?.city || 'N/A'}</span>
            </div>
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
            <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-semibold cursor-pointer">
                <option value="Pending Payment">Pending Payment</option>
                <option value="Paid">Paid</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            <a href={`https://wa.me/${order.shippingInfo?.whatsapp || ''}`} target="_blank" rel="noreferrer" className="w-full text-center bg-[#25D366] text-white py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-[#128C7E] transition-colors">
              Message Customer
            </a>
          </div>
        </div>
      )) : <p className="text-slate-500 text-center py-12">No orders found.</p>}
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

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

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
          <p className="text-3xl font-bold text-slate-800 mt-2">{products.length}</p>
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
                  {products.map((p) => (
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

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                <input type="url" required value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
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
    </div>
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
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
    </div>
  );
};

export const LabelsTab = () => {
  const { products, updateProduct } = useContext(ShopContext);
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Product Labels</h2>
        <p className="text-sm text-slate-500 mt-1">Select items to display on New Arrivals, Best Sellers, and Offers on the storefront.</p>
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
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-emerald-600">
                  <input type="checkbox" checked={!!product.isNewArrival} onChange={() => updateProduct({ ...product, isNewArrival: !product.isNewArrival })} className="w-4 h-4 text-emerald-600 rounded" /> New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-amber-600">
                  <input type="checkbox" checked={!!product.isBestSeller} onChange={() => updateProduct({ ...product, isBestSeller: !product.isBestSeller })} className="w-4 h-4 text-amber-500 rounded" /> Best Seller
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer hover:text-rose-600">
                  <input type="checkbox" checked={!!product.isOfferItem} onChange={() => updateProduct({ ...product, isOfferItem: !product.isOfferItem })} className="w-4 h-4 text-rose-500 rounded" /> Offer Item
                </label>
              </div>
            </div>
        ))}
      </div>
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
