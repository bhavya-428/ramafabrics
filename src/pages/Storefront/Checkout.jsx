import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Checkout = ({ setRoute, setSelectedOrderId }) => {
  const { cart, getCartSubtotal, getCartDiscount, getCartTotal, placeOrder, currentUser } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.name : '',
    email: currentUser ? currentUser.email : '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        whatsapp: prev.phone
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Validation
    const { name, email, phone, whatsapp, address, city, pincode } = formData;
    if (!name || !email || !phone || !whatsapp || !address || !city || !pincode) {
      setError('Please fill in all the required delivery details.');
      return;
    }
    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }
    // Place Order
    const newOrder = placeOrder(formData, paymentMethod);
    setSelectedOrderId(newOrder.id);
    if (paymentMethod === 'UPI') {
      setRoute('payment');
    } else {
      // Cash on Delivery - Redirect straight to Orders page
      setRoute('orders');
    }
  };
  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <button onClick={() => setRoute('shop')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={styles.checkoutContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>SECURE ORDER ENTRANCE</span>
        <h1 style={styles.title}>Delivery & Payment</h1>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.layout}>
        {/* Delivery Details Form */}
        <div style={styles.formPanel} className="luxury-card">
          <h3 style={styles.panelTitle}>Shipping Address</h3>
          
          <div style={styles.formRow}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Srinivas Rao"
                className="form-input"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="srinivas@gmail.com"
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="96188 96169"
                className="form-input"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">WhatsApp Number *</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="919618896169"
                className="form-input"
                required
              />
              <label style={styles.checkboxSub}>
                <input type="checkbox" onChange={handleCheckboxChange} style={styles.checkInner} />
                <span>Same as Phone Number</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Door No, Building, Street, Brindavan Colony"
              className="form-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Vijayawada"
                className="form-input"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="520010"
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Order Review and Payment Methods */}
        <aside style={styles.sidebar}>
          {/* Itemized summary */}
          <div className="luxury-card" style={{ marginBottom: '24px' }}>
            <h3 style={styles.panelSubTitle}>Your Selections</h3>
            <div style={styles.summaryItems}>
              {cart.map((item) => (
                <div key={item.product.id} style={styles.summaryItem}>
                  <span>{item.product.name} <strong>x {item.quantity}</strong></span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div style={styles.summaryTotals}>
              <div style={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{getCartSubtotal()}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Discount</span>
                <span style={{ color: 'var(--color-success)' }}>-₹{getCartDiscount()}</span>
              </div>
              <div style={{ ...styles.totalRow, fontWeight: '700', fontSize: '16px', color: 'var(--color-primary-dark)' }}>
                <span>Total Amount</span>
                <span>₹{getCartTotal()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Choice */}
          <div className="luxury-card" style={styles.paymentCard}>
            <h3 style={styles.panelSubTitle}>Payment Method</h3>
            
            <div style={styles.methods}>
              <label style={{
                ...styles.methodLabel,
                ...(paymentMethod === 'UPI' ? styles.activeMethodLabel : {})
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  style={styles.radioInput}
                />
                <div style={styles.methodInfo}>
                  <strong>UPI QR Code Payment</strong>
                  <span style={styles.methodDesc}>Scan QR with GPay, PhonePe, Paytm (Auto-generates working UPI)</span>
                </div>
              </label>

              <label style={{
                ...styles.methodLabel,
                ...(paymentMethod === 'COD' ? styles.activeMethodLabel : {})
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={styles.radioInput}
                />
                <div style={styles.methodInfo}>
                  <strong>Cash on Delivery (COD)</strong>
                  <span style={styles.methodDesc}>Pay when products are delivered to your doorstep</span>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-gold" style={styles.submitBtn}>
              {paymentMethod === 'UPI' ? 'Proceed to Pay ₹' + getCartTotal() : 'Place Order (COD)'}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
};

const styles = {
  checkoutContainer: {
    paddingTop: '32px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '32px'
  },
  subTitle: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: 'var(--color-secondary-dark)',
    textTransform: 'uppercase'
  },
  title: {
    fontSize: '32px',
    color: 'var(--color-primary-dark)',
    marginTop: '4px'
  },
  errorAlert: {
    backgroundColor: 'rgba(189, 33, 48, 0.1)',
    color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px',
    fontWeight: '500'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '32px'
  },
  formPanel: {
    padding: '32px'
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border-light)',
    paddingBottom: '12px'
  },
  panelSubTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '16px',
    borderBottom: '1px solid var(--color-border-light)',
    paddingBottom: '8px'
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  checkboxSub: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginTop: '6px',
    cursor: 'pointer'
  },
  checkInner: {
    width: '14px',
    height: '14px',
    accentColor: 'var(--color-primary)'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column'
  },
  summaryItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-dark)'
  },
  summaryTotals: {
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-muted)'
  },
  paymentCard: {
    padding: '24px'
  },
  methods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  methodLabel: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    alignItems: 'flex-start'
  },
  activeMethodLabel: {
    borderColor: 'var(--color-primary)',
    backgroundColor: 'rgba(11, 74, 58, 0.02)'
  },
  radioInput: {
    marginTop: '4px',
    accentColor: 'var(--color-primary)'
  },
  methodInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  methodDesc: {
    fontSize: '11px',
    color: 'var(--color-text-muted)'
  },
  submitBtn: {
    width: '100%',
    borderRadius: '30px',
    padding: '14px 0',
    fontSize: '14px'
  }
};

// Adaptive screen width handling
if (window.innerWidth <= 1024) {
  styles.layout = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  };
}
