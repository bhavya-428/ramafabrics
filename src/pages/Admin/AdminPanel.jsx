import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const AdminPanel = ({ setRoute, setSelectedProductId }) => {
  const {
    products,
    offers,
    orders,
    settings,
    currentUser,
    login,
    signup,
    addProduct,
    updateProduct,
    deleteProduct,
    addOffer,
    deleteOffer,
    updateOrderStatus,
    updateSettings
  } = useContext(ShopContext);

  // Auth States
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Modal / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for add, object for edit
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Silk',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    colorPattern: 'linear-gradient(135deg, #7D1D2B 0%, #C5A059 100%)',
    isFeatured: false
  });

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minPurchase: '0',
    description: ''
  });

  const [settingsForm, setSettingsForm] = useState({ ...settings });

  // Handle Login & Signup
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isLoginView) {
      const res = login(authEmail, authPassword);
      if (!res.success) {
        setAuthError(res.message);
      } else {
        setAuthSuccess(res.message);
      }
    } else {
      if (!authName) {
        setAuthError('Please enter your name.');
        return;
      }
      const res = signup(authName, authEmail, authPassword);
      if (!res.success) {
        setAuthError(res.message);
      } else {
        setAuthSuccess(res.message);
        setIsLoginView(true);
      }
    }
  };

  // Redirect / Guard Check
  const isAdminLoggedIn = currentUser && currentUser.isAdmin;

  if (!isAdminLoggedIn) {
    return (
      <div className="container flex justify-center" style={{ paddingTop: '64px', paddingBottom: '80px' }}>
        <div className="luxury-card" style={styles.authCard}>
          <div style={styles.authHeader}>
            <span style={styles.authLogo}>RF</span>
            <h2>Rama Fabrics Console</h2>
            <p style={styles.authSub}>
              {isLoginView ? 'Sign in to access stock and order managers.' : 'Sign up to register as an administrator.'}
            </p>
          </div>

          {authError && <div style={styles.authError}>{authError}</div>}
          {authSuccess && <div style={styles.authSuccess}>{authSuccess}</div>}

          <form onSubmit={handleAuthSubmit}>
            {!isLoginView && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Store Manager"
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@ramafabrics.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={styles.authBtn}>
              {isLoginView ? 'Sign In' : 'Create Admin Account'}
            </button>
          </form>

          <div style={styles.authToggle}>
            {isLoginView ? (
              <p>
                First time?{' '}
                <button onClick={() => setIsLoginView(false)} style={styles.toggleBtn}>
                  Create account (Auto-promoted to Admin)
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button onClick={() => setIsLoginView(true)} style={styles.toggleBtn}>
                  Sign in to your account
                </button>
              </p>
            )}
            <p style={{ marginTop: '12px' }}>
              <button onClick={() => setRoute('')} style={styles.storeLink}>
                ← Back to Customer Storefront
              </button>
            </p>
          </div>

          <div style={styles.demoCredentialsBox}>
            <strong>Demo Admin Login:</strong><br />
            Email: <code>admin@ramafabrics.com</code><br />
            Password: <code>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // --- ANALYTICS CALCULATIONS (OVERVIEW TAB) ---
  const totalSales = orders.reduce((sum, o) => o.status !== 'Pending Payment' ? sum + o.total : sum, 0);
  const orderCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending Payment' || o.status === 'Paid').length;
  const totalMetersStock = products.reduce((sum, p) => p.category !== 'Ready-to-Wear' ? sum + p.stock : sum, 0);

  // --- PRODUCT FORM OPERATIONS ---
  const handleProductEditClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({ 
      ...prod,
      originalPrice: prod.originalPrice || ''
    });
    setShowProductModal(true);
  };

  const handleProductAddClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Silk',
      price: '',
      originalPrice: '',
      stock: '',
      description: '',
      colorPattern: 'linear-gradient(135deg, #7D1D2B 0%, #C5A059 100%)',
      isFeatured: false
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
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
    setShowProductModal(false);
  };

  const handleProductDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // --- OFFERS FORM OPERATIONS ---
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const formatted = {
      ...offerForm,
      discount: parseFloat(offerForm.discount),
      minPurchase: parseFloat(offerForm.minPurchase)
    };
    addOffer(formatted);
    setShowOfferForm(false);
    setOfferForm({
      code: '',
      discount: '',
      type: 'percentage',
      minPurchase: '0',
      description: ''
    });
  };

  const handleOfferDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this discount offer?')) {
      deleteOffer(id);
    }
  };

  // --- SETTINGS FORM SUBMIT ---
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('Store configurations updated successfully!');
  };

  return (
    <div className="container animate-fade-in" style={styles.adminContainer}>
      <div style={styles.adminHeaderBlock}>
        <div>
          <span style={styles.adminBadge}>STORE BACKEND CONSOLE</span>
          <h1 style={styles.adminTitle}>Administration Panel</h1>
        </div>
        <button onClick={() => setRoute('')} className="btn btn-secondary btn-sm">
          ← View Storefront
        </button>
      </div>

      <div style={styles.adminLayout}>
        {/* Sidebar Nav */}
        <aside style={styles.adminSidebar}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{ ...styles.sidebarLink, ...(activeTab === 'overview' ? styles.activeSidebarLink : {}) }}
          >
            📊 Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{ ...styles.sidebarLink, ...(activeTab === 'products' ? styles.activeSidebarLink : {}) }}
          >
            ✂️ Products & Stock
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{ ...styles.sidebarLink, ...(activeTab === 'orders' ? styles.activeSidebarLink : {}) }}
          >
            📦 Customer Orders
            {pendingOrdersCount > 0 && <span style={styles.pendingBadge}>{pendingOrdersCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            style={{ ...styles.sidebarLink, ...(activeTab === 'offers' ? styles.activeSidebarLink : {}) }}
          >
            🏷️ Offers & Discounts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{ ...styles.sidebarLink, ...(activeTab === 'settings' ? styles.activeSidebarLink : {}) }}
          >
            ⚙️ Shop Settings
          </button>
        </aside>

        {/* Main console screen */}
        <main style={styles.adminMainContent}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div style={styles.analyticsGrid}>
                <div className="luxury-card" style={styles.analyticsCard}>
                  <span style={styles.analyticsLabel}>Total Confirmed Revenue</span>
                  <span style={styles.analyticsVal}>₹{totalSales}</span>
                </div>
                <div className="luxury-card" style={styles.analyticsCard}>
                  <span style={styles.analyticsLabel}>Orders Logged</span>
                  <span style={styles.analyticsVal}>{orderCount}</span>
                </div>
                <div className="luxury-card" style={styles.analyticsCard}>
                  <span style={styles.analyticsLabel}>Action Pending Orders</span>
                  <span style={{ ...styles.analyticsVal, color: 'var(--color-accent)' }}>{pendingOrdersCount}</span>
                </div>
                <div className="luxury-card" style={styles.analyticsCard}>
                  <span style={styles.analyticsLabel}>Fabrics Stock (Meters)</span>
                  <span style={styles.analyticsVal}>{totalMetersStock}m</span>
                </div>
              </div>

              <div className="luxury-card" style={{ marginTop: '32px' }}>
                <h3 style={styles.subHeading}>Recent Actionable Orders</h3>
                <div className="table-container" style={{ marginTop: '16px' }}>
                  {orders.length > 0 ? (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Method</th>
                          <th>Total Amount</th>
                          <th>Order Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td><strong>#{order.id}</strong></td>
                            <td>{order.shippingInfo.name}</td>
                            <td><span className="badge badge-info">{order.paymentMethod}</span></td>
                            <td>₹{order.total}</td>
                            <td>
                              <span className={`badge ${
                                order.status === 'Delivered' ? 'badge-success' : 
                                order.status === 'Shipped' ? 'badge-info' : 
                                order.status === 'Confirmed' ? 'badge-primary' : 
                                order.status === 'Paid' ? 'badge-warning' : 'badge-danger'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => setActiveTab('orders')}
                                className="btn btn-secondary btn-sm"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No orders received yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div style={styles.tabHeaderRow}>
                <h2 style={styles.subHeading}>Cloth Fabrics Stock Catalog</h2>
                <button onClick={handleProductAddClick} className="btn btn-primary btn-sm">
                  + Add New Fabric
                </button>
              </div>

              <div className="table-container" style={{ marginTop: '20px' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Texture</th>
                      <th>Fabric Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div style={{ ...styles.swatchMini, backgroundImage: `url(${prod.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </td>
                        <td><strong>{prod.name}</strong></td>
                        <td><span className="badge badge-primary">{prod.category}</span></td>
                         <td>
                          {prod.originalPrice ? (
                            <span style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '11px' }}>
                                ₹{prod.originalPrice}
                              </span>
                              <strong style={{ color: 'var(--color-accent)' }}>
                                ₹{prod.price} {prod.category === 'Ready-to-Wear' ? '/pc' : '/m'}
                              </strong>
                            </span>
                          ) : (
                            <span>₹{prod.price} {prod.category === 'Ready-to-Wear' ? '/pc' : '/m'}</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: '600', color: prod.stock <= 5 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                            {prod.stock} {prod.category === 'Ready-to-Wear' ? 'pcs' : 'm'}
                          </span>
                          {prod.stock <= 5 && <span style={styles.lowBadge}>Low</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleProductEditClick(prod)} style={styles.editBtn}>Edit</button>
                            <button onClick={() => handleProductDelete(prod.id)} style={styles.deleteBtn}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Product Modal */}
              {showProductModal && (
                <div style={styles.modalOverlay}>
                  <div className="luxury-card animate-fade-in" style={styles.modalContent}>
                    <h3 style={styles.modalTitle}>
                      {editingProduct ? 'Edit Fabric Details' : 'Add New Fabric Stock'}
                    </h3>
                    <form onSubmit={handleProductSubmit} style={{ marginTop: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Fabric / Wear Name</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="form-input"
                          required
                        />
                      </div>
                      
                      <div style={styles.formRow}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Category</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="form-input"
                          >
                            <option value="Silk">Silk</option>
                            <option value="Cotton">Cotton</option>
                            <option value="Handloom">Handloom</option>
                            <option value="Georgette">Georgette</option>
                            <option value="Ready-to-Wear">Ready-to-Wear</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Color Gradient Theme (CSS Pattern)</label>
                          <input
                            type="text"
                            value={productForm.colorPattern}
                            onChange={(e) => setProductForm({ ...productForm, colorPattern: e.target.value })}
                            className="form-input"
                            placeholder="linear-gradient(...)"
                            required
                          />
                                       <div style={styles.formRow}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Sale Price (₹) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="form-input"
                            required
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Original Price (₹)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.originalPrice || ''}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                            className="form-input"
                            placeholder="Struckout e.g. 320"
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Stock (Qty) *</label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>            </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="form-input"
                          style={{ minHeight: '80px' }}
                          required
                        />
                      </div>

                      <div style={styles.modalActions}>
                        <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary">
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in" style={styles.ordersListContainer}>
              <h2 style={styles.subHeading}>Manage Customer Orders</h2>
              <div style={styles.ordersCardGrid}>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="luxury-card" style={styles.adminOrderCard}>
                      <div style={styles.orderCardHeader}>
                        <div>
                          <strong>ID: #{order.id}</strong>
                          <span style={styles.orderCardDate}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className={`badge ${
                            order.status === 'Delivered' ? 'badge-success' : 
                            order.status === 'Shipped' ? 'badge-info' : 
                            order.status === 'Confirmed' ? 'badge-primary' : 
                            order.status === 'Paid' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div style={styles.orderCardAddress}>
                        <strong>Shipping Customer:</strong> {order.shippingInfo.name}<br />
                        <strong>Phone / WA:</strong> {order.shippingInfo.phone} | {order.shippingInfo.whatsapp}<br />
                        <strong>Delivery Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.pincode}
                      </div>

                      <div style={styles.orderCardItems}>
                        <strong>Items:</strong>
                        <ul style={{ paddingLeft: '20px', fontSize: '12px', marginTop: '4px' }}>
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.product.name} x {item.quantity} {item.product.category === 'Ready-to-Wear' ? 'pcs' : 'm'} (₹{item.product.price})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={styles.orderCardFooter}>
                        <div style={styles.orderCardTotal}>
                          Total paid: <strong>₹{order.total}</strong>
                        </div>
                        
                        <div style={styles.orderStatusActions}>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="form-input"
                            style={styles.statusSelect}
                          >
                            <option value="Pending Payment">Pending Payment</option>
                            <option value="Paid">Paid</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          
                          <a
                            href={`https://wa.me/${order.shippingInfo.whatsapp}`}
                            target="_blank"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', padding: '10px', borderRadius: '8px' }}
                            title="Direct Message customer on WhatsApp"
                          >
                            💬 Chat
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px' }}>
                    No orders have been placed yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: OFFERS */}
          {activeTab === 'offers' && (
            <div className="animate-fade-in">
              <div style={styles.tabHeaderRow}>
                <h2 style={styles.subHeading}>Promo Coupons & Discounts</h2>
                <button onClick={() => setShowOfferForm(!showOfferForm)} className="btn btn-primary btn-sm">
                  {showOfferForm ? 'Close Form' : '+ Create Offer'}
                </button>
              </div>

              {showOfferForm && (
                <div className="luxury-card animate-fade-in" style={{ marginTop: '20px', padding: '24px' }}>
                  <h3>Create Promotional Coupon</h3>
                  <form onSubmit={handleOfferSubmit} style={{ marginTop: '16px' }}>
                    <div style={styles.formRow}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Coupon Code (Uppercase)</label>
                        <input
                          type="text"
                          value={offerForm.code}
                          onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                          placeholder="FESTIVE20"
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Discount Value</label>
                        <input
                          type="number"
                          value={offerForm.discount}
                          onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                          placeholder="20"
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Coupon Type</label>
                        <select
                          value={offerForm.type}
                          onChange={(e) => setOfferForm({ ...offerForm, type: e.target.value })}
                          className="form-input"
                        >
                          <option value="percentage">Percentage OFF (%)</option>
                          <option value="flat">Flat OFF (₹)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Min Purchase Requirement (₹)</label>
                        <input
                          type="number"
                          value={offerForm.minPurchase}
                          onChange={(e) => setOfferForm({ ...offerForm, minPurchase: e.target.value })}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Display Banner Description</label>
                      <input
                        type="text"
                        value={offerForm.description}
                        onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                        placeholder="Get 20% off on purchase of Handloom items over ₹1000."
                        className="form-input"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-gold btn-sm">
                      Activate Coupon
                    </button>
                  </form>
                </div>
              )}

              <div className="table-container" style={{ marginTop: '20px' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Discount</th>
                      <th>Requirement</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer) => (
                      <tr key={offer.id}>
                        <td><code><strong>{offer.code}</strong></code></td>
                        <td>{offer.type === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`}</td>
                        <td>₹{offer.minPurchase} min</td>
                        <td>{offer.description}</td>
                        <td>
                          <button onClick={() => handleOfferDelete(offer.id)} style={styles.deleteBtn}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h2 style={styles.subHeading}>Shop Configurations</h2>
              <div className="luxury-card" style={{ marginTop: '20px', padding: '32px' }}>
                <form onSubmit={handleSettingsSubmit}>
                  <div style={styles.formRow}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Storefront Name</label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Merchant Name (UPI Payee)</label>
                      <input
                        type="text"
                        value={settingsForm.merchantName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, merchantName: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Store UPI Virtual Payee Address (VPA)</label>
                      <input
                        type="text"
                        value={settingsForm.upiId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                        className="form-input"
                        placeholder="yourname@okaxis"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Customer Notify WhatsApp (Digits only with Country Code)</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="form-input"
                        placeholder="918977001696"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">General Contact Phone</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Showroom Business Hours</label>
                      <input
                        type="text"
                        value={settingsForm.hours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Showroom Physical Address</label>
                    <textarea
                      value={settingsForm.storeAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                      className="form-input"
                      style={{ minHeight: '60px' }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hero Title</label>
                    <input
                      type="text"
                      value={settingsForm.heroTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hero Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.heroSubtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ marginTop: '16px' }}>
                    Save Configurations
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  adminContainer: {
    paddingTop: '32px',
    paddingBottom: '80px'
  },
  adminHeaderBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px'
  },
  adminBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-secondary-dark)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    display: 'block'
  },
  adminTitle: {
    fontSize: '32px',
    color: 'var(--color-primary-dark)',
    marginTop: '4px'
  },
  adminLayout: {
    display: 'flex',
    gap: '32px'
  },
  adminSidebar: {
    width: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexShrink: 0
  },
  sidebarLink: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '8px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'var(--transition-fast)'
  },
  activeSidebarLink: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    boxShadow: 'var(--shadow-sm)'
  },
  adminMainContent: {
    flexGrow: 1
  },
  pendingBadge: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Dashboard widgets
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  analyticsCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  analyticsLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  analyticsVal: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginTop: '6px'
  },
  subHeading: {
    fontSize: '18px',
    color: 'var(--color-primary-dark)'
  },
  tabHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  swatchMini: {
    width: '36px',
    height: '36px',
    borderRadius: '4px'
  },
  editBtn: {
    fontSize: '12px',
    color: 'var(--color-primary-light)',
    fontWeight: '600',
    textDecoration: 'underline',
    backgroundColor: 'transparent'
  },
  deleteBtn: {
    fontSize: '12px',
    color: 'var(--color-danger)',
    fontWeight: '600',
    textDecoration: 'underline',
    backgroundColor: 'transparent'
  },
  lowBadge: {
    marginLeft: '6px',
    fontSize: '9px',
    backgroundColor: 'rgba(189, 33, 48, 0.1)',
    color: 'var(--color-danger)',
    padding: '2px 4px',
    borderRadius: '3px',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  // Product Form Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '550px',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-lg)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalTitle: {
    fontSize: '20px',
    color: 'var(--color-primary-dark)'
  },
  formRow: {
    display: 'flex',
    gap: '16px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  },
  // Orders View
  ordersListContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  ordersCardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
    marginTop: '20px'
  },
  adminOrderCard: {
    padding: '24px',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderCardDate: {
    display: 'block',
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginTop: '2px'
  },
  orderCardAddress: {
    fontSize: '12px',
    color: 'var(--color-text-dark)',
    lineHeight: '1.4'
  },
  orderCardItems: {
    backgroundColor: 'var(--color-bg-cream)',
    padding: '12px',
    borderRadius: '6px'
  },
  orderCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    borderTop: '1px solid var(--color-border-light)',
    paddingTop: '14px'
  },
  orderCardTotal: {
    fontSize: '13px',
    color: 'var(--color-text-dark)'
  },
  orderStatusActions: {
    display: 'flex',
    gap: '8px'
  },
  statusSelect: {
    padding: '6px 10px',
    fontSize: '12px',
    width: '140px'
  },
  // Auth Form Page
  authCard: {
    width: '100%',
    maxWidth: '440px',
    padding: '40px'
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '28px'
  },
  authLogo: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-secondary)',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    fontSize: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-secondary)',
    marginBottom: '16px'
  },
  authSub: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginTop: '6px'
  },
  authError: {
    backgroundColor: 'rgba(189, 33, 48, 0.08)',
    color: 'var(--color-danger)',
    border: '1px solid rgba(189, 33, 48, 0.2)',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '500'
  },
  authSuccess: {
    backgroundColor: 'rgba(30, 126, 52, 0.08)',
    color: 'var(--color-success)',
    border: '1px solid rgba(30, 126, 52, 0.2)',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '500'
  },
  authBtn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: '30px',
    marginTop: '8px'
  },
  authToggle: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--color-text-muted)'
  },
  toggleBtn: {
    color: 'var(--color-primary)',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  storeLink: {
    color: 'var(--color-text-muted)',
    fontWeight: '500'
  },
  demoCredentialsBox: {
    backgroundColor: 'var(--color-bg-cream)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '11px',
    color: 'var(--color-text-dark)',
    lineHeight: '1.4',
    marginTop: '20px'
  }
};

// Adaptive screen width handling
if (window.innerWidth <= 768) {
  styles.adminLayout = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };
  styles.adminSidebar = {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px'
  };
  styles.sidebarLink = {
    width: 'auto',
    padding: '10px 14px',
    fontSize: '11px'
  };
  styles.analyticsGrid = {
    gridTemplateColumns: 'repeat(2, 1fr)'
  };
}
