import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Cart = ({ setRoute }) => {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    getCartSubtotal, 
    getCartDiscount, 
    getCartTotal, 
    applyCoupon, 
    removeCoupon, 
    activeCoupon 
  } = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (!promoCode.trim()) return;

    const res = applyCoupon(promoCode.trim());
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoCode('');
    } else {
      setPromoError(res.message);
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoSuccess('');
    setPromoError('');
  };

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={styles.emptyContainer}>
        <div style={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--color-secondary)' }}>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 24px 0' }}>
            Explore our contemporary collections and traditional handlooms.
          </p>
          <button onClick={() => setRoute('shop')} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={styles.cartContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>YOUR SELECTED PIECES</span>
        <h1 style={styles.title}>Shopping Cart</h1>
      </div>

      <div style={styles.layout}>
        {/* Cart items list */}
        <div style={styles.itemsList}>
          {cart.map((item) => (
            <div key={item.product.id} style={styles.itemCard}>
              {/* Swatch Mock */}
              <div style={{ ...styles.itemSwatch, backgroundImage: `url(${item.product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              
              {/* Product Info */}
              <div style={styles.itemInfo}>
                <span style={styles.itemCat}>{item.product.category}</span>
                <h3 style={styles.itemName}>{item.product.name}</h3>
                <span style={styles.itemPrice}>
                  ₹{item.product.price} {item.product.category === 'Ready-to-Wear' ? '/piece' : '/meter'}
                </span>
              </div>

              {/* Quantity Controls */}
              <div style={styles.qtyWrapper}>
                <span style={styles.labelMuted}>Qty:</span>
                <div style={styles.quantitySelector}>
                  <button 
                    onClick={() => updateCartQty(item.product.id, item.quantity - 1)} 
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQty(item.product.id, item.quantity + 1)} 
                    style={styles.qtyBtn}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <span style={styles.unitText}>
                  {item.product.category === 'Ready-to-Wear' ? 'pc(s)' : 'meter(s)'}
                </span>
              </div>

              {/* Subtotal */}
              <div style={styles.subtotalWrapper}>
                <span style={styles.labelMuted}>Subtotal:</span>
                <span style={styles.itemSubtotal}>₹{item.product.price * item.quantity}</span>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => removeFromCart(item.product.id)} 
                style={styles.removeBtn}
                title="Remove item"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary Panel */}
        <aside style={styles.summaryPanel}>
          <div className="luxury-card" style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{getCartSubtotal()}</span>
            </div>

            {/* Applied coupon readouts */}
            {activeCoupon && (
              <div style={{ ...styles.summaryRow, color: 'var(--color-success)' }}>
                <div style={styles.couponDetail}>
                  <span>Discount ({activeCoupon.code})</span>
                  <button onClick={handleRemovePromo} style={styles.removePromoBtn} title="Remove Coupon">
                    [Remove]
                  </button>
                </div>
                <span>-₹{getCartDiscount()}</span>
              </div>
            )}

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span>Total Price</span>
              <span>₹{getCartTotal()}</span>
            </div>

            {/* Promo Code Input Form */}
            <form onSubmit={handleApplyPromo} style={styles.promoForm}>
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="form-input"
                style={styles.promoInput}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={styles.promoBtn}>
                Apply
              </button>
            </form>

            {promoError && <p style={styles.errorText}>{promoError}</p>}
            {promoSuccess && <p style={styles.successText}>{promoSuccess}</p>}

            <button 
              onClick={() => setRoute('checkout')} 
              className="btn btn-gold" 
              style={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>

            <button 
              onClick={() => setRoute('shop')} 
              className="btn btn-secondary" 
              style={styles.continueBtn}
            >
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  emptyContainer: {
    paddingTop: '64px',
    paddingBottom: '80px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-white)',
    border: '1px dashed var(--color-border)',
    borderRadius: '16px',
    padding: '80px 40px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  cartContainer: {
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '32px'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    gap: '20px',
    position: 'relative'
  },
  itemSwatch: {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    flexShrink: 0
  },
  itemInfo: {
    flexGrow: 1,
    minWidth: '150px'
  },
  itemCat: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-secondary-dark)',
    textTransform: 'uppercase',
    display: 'block'
  },
  itemName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)',
    margin: '2px 0'
  },
  itemPrice: {
    fontSize: '13px',
    color: 'var(--color-text-muted)'
  },
  qtyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  labelMuted: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-bg-cream)'
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-border-light)'
  },
  qtyValue: {
    width: '32px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600'
  },
  unitText: {
    fontSize: '10px',
    color: 'var(--color-text-muted)'
  },
  subtotalWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100px'
  },
  itemSubtotal: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)'
  },
  removeBtn: {
    color: 'var(--color-text-muted)',
    transition: 'var(--transition-fast)',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  summaryPanel: {
    position: 'sticky',
    top: '100px',
    height: 'fit-content'
  },
  summaryCard: {
    padding: '32px'
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border-light)',
    paddingBottom: '12px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--color-text-dark)',
    marginBottom: '16px'
  },
  couponDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  removePromoBtn: {
    fontSize: '11px',
    color: 'var(--color-danger)',
    fontWeight: '600'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border-light)',
    margin: '20px 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '28px'
  },
  promoForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px'
  },
  promoInput: {
    padding: '8px 12px',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  promoBtn: {
    borderRadius: '8px',
    padding: '0 16px',
    fontSize: '11px'
  },
  errorText: {
    fontSize: '12px',
    color: 'var(--color-danger)',
    marginBottom: '16px'
  },
  successText: {
    fontSize: '12px',
    color: 'var(--color-success)',
    marginBottom: '16px'
  },
  checkoutBtn: {
    width: '100%',
    borderRadius: '30px',
    padding: '14px 0',
    fontSize: '13px',
    marginBottom: '12px'
  },
  continueBtn: {
    width: '100%',
    borderRadius: '30px',
    padding: '12px 0',
    fontSize: '13px',
    borderWidth: '1px'
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
