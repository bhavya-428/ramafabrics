import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Orders = ({ setRoute, selectedOrderId, setSelectedProductId }) => {
  const { orders, currentUser, getWhatsAppLink } = useContext(ShopContext);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // If user is logged in, filter orders by email
  const userOrders = currentUser 
    ? orders.filter(o => o.userEmail === currentUser.email) 
    : [];

  const handleSearchOrder = (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    if (!searchOrderId.trim()) return;

    const matched = orders.find(o => o.id.toUpperCase() === searchOrderId.trim().toUpperCase());
    if (matched) {
      setSearchResult(matched);
    } else {
      setSearchError('No order found with ID: ' + searchOrderId);
    }
  };

  const handleViewProduct = (productId) => {
    setSelectedProductId(productId);
    setRoute('product-detail');
  };

  // Status mapping to percentages/classes for visual tracking timeline
  const getStatusStep = (status) => {
    const statuses = ['Pending Payment', 'Paid', 'Confirmed', 'Shipped', 'Delivered'];
    return statuses.indexOf(status);
  };

  const renderTimeline = (status) => {
    const activeStep = getStatusStep(status);
    const steps = ['Order Placed', 'Payment Received', 'Confirmed', 'Shipped', 'Delivered'];

    return (
      <div style={styles.timelineContainer}>
        <div style={styles.progressLineWrapper}>
          <div 
            style={{ 
              ...styles.progressLineActive, 
              width: `${(activeStep / (steps.length - 1)) * 100}%` 
            }}
          ></div>
        </div>
        <div style={styles.stepsWrapper}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeStep;
            const isActive = idx === activeStep;
            return (
              <div key={idx} style={styles.stepNode}>
                <div style={{
                  ...styles.stepDot,
                  backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border)',
                  borderColor: isActive ? 'var(--color-secondary)' : 'transparent',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)'
                }}>
                  {isCompleted && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: isCompleted ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                  fontWeight: isCompleted ? '600' : '400'
                }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOrderCard = (order) => (
    <div key={order.id} className="luxury-card animate-fade-in" style={styles.orderCard}>
      <div style={styles.cardHeader}>
        <div>
          <span style={styles.orderIdLabel}>ORDER ID</span>
          <h3 style={styles.orderIdVal}>#{order.id}</h3>
        </div>
        <div style={styles.headerInfo}>
          <span style={styles.orderDate}>
            Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
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

      {/* Visual Timeline Tracking */}
      {renderTimeline(order.status)}

      <div style={styles.cardBody}>
        {/* Item List */}
        <div style={styles.itemsBlock}>
          <h4 style={styles.blockTitle}>Ordered Fabrics</h4>
          <div style={styles.itemsList}>
            {order.items.map((item, idx) => (
              <div key={idx} style={styles.itemRow}>
                <div style={styles.itemNameCol}>
                  <div style={{ ...styles.miniSwatch, backgroundImage: `url(${item.product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <span onClick={() => handleViewProduct(item.product.id)} style={styles.itemName}>
                    {item.product.name}
                  </span>
                </div>
                <span style={styles.itemQtyPrice}>
                  {item.quantity} {item.product.category === 'Ready-to-Wear' ? 'pc(s)' : 'meter(s)'} x ₹{item.product.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping details and summary */}
        <div style={styles.metaBlock}>
          <div style={styles.shippingInfo}>
            <h4 style={styles.blockTitle}>Deliver To</h4>
            <p style={styles.addressText}>
              <strong>{order.shippingInfo.name}</strong><br />
              {order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.pincode}<br />
              Phone: {order.shippingInfo.phone} | WhatsApp: {order.shippingInfo.whatsapp}
            </p>
          </div>

          <div style={styles.summaryInfo}>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div style={styles.summaryRow}>
                <span>Discount Applied:</span>
                <span style={{ color: 'var(--color-success)' }}>-₹{order.discount}</span>
              </div>
            )}
            <div style={styles.totalRow}>
              <span>Paid Total:</span>
              <span>₹{order.total}</span>
            </div>
            {order.status === 'Pending Payment' && (
              <button 
                onClick={() => { setSelectedOrderId(order.id); setRoute('payment'); }} 
                className="btn btn-gold btn-sm"
                style={styles.payBtn}
              >
                Scan & Complete Payment
              </button>
            )}
            {order.status === 'Paid' && (
              <a 
                href={getWhatsAppLink(order)} 
                target="_blank" 
                className="btn btn-primary btn-sm"
                style={{ ...styles.payBtn, backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                Resend WhatsApp Notice
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={styles.container}>
      <div style={styles.headerTitleBlock}>
        <span style={styles.subTitle}>CHECK ORDER TIMELINE</span>
        <h1 style={styles.title}>Track Your Orders</h1>
      </div>

      {/* Guest Tracking Form */}
      <div className="luxury-card" style={styles.searchCard}>
        <h3 style={styles.searchCardTitle}>Track by Order ID</h3>
        <p style={styles.searchCardDesc}>Check status of any order by pasting your Order Reference ID below (e.g. RF-123456).</p>
        <form onSubmit={handleSearchOrder} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Enter Order ID (e.g. RF-546372)"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="form-input"
            style={styles.searchInput}
          />
          <button type="submit" className="btn btn-primary" style={styles.searchBtn}>
            Track Order
          </button>
        </form>

        {searchError && <p style={styles.errorText}>{searchError}</p>}

        {searchResult && (
          <div style={styles.searchResultWrapper}>
            <div style={styles.divider}></div>
            {renderOrderCard(searchResult)}
          </div>
        )}
      </div>

      {/* Logged in orders history list */}
      {currentUser && (
        <div style={styles.ordersListBlock}>
          <h2 style={styles.listHeading}>Your Orders History ({userOrders.length})</h2>
          {userOrders.length > 0 ? (
            <div style={styles.ordersList}>
              {userOrders.map(order => renderOrderCard(order))}
            </div>
          ) : (
            <div style={styles.noHistory}>
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => setRoute('shop')} className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                Go to Shop
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '32px',
    paddingBottom: '80px'
  },
  headerTitleBlock: {
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
  searchCard: {
    padding: '32px',
    marginBottom: '40px',
    border: '1px solid var(--color-border-light)'
  },
  searchCardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '6px'
  },
  searchCardDesc: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginBottom: '20px'
  },
  searchForm: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: 1,
    minWidth: '220px',
    padding: '12px 16px'
  },
  searchBtn: {
    padding: '12px 32px',
    borderRadius: '8px'
  },
  errorText: {
    fontSize: '13px',
    color: 'var(--color-danger)',
    marginTop: '12px',
    fontWeight: '500'
  },
  searchResultWrapper: {
    marginTop: '24px'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border-light)',
    marginBottom: '24px'
  },
  ordersListBlock: {
    marginTop: '40px'
  },
  listHeading: {
    fontSize: '22px',
    color: 'var(--color-primary-dark)',
    marginBottom: '20px'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  noHistory: {
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  orderCard: {
    padding: '28px',
    backgroundColor: 'var(--color-bg-white)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '28px'
  },
  orderIdLabel: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  orderIdVal: {
    fontSize: '20px',
    color: 'var(--color-primary-dark)',
    lineHeight: '1.2'
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  orderDate: {
    fontSize: '12px',
    color: 'var(--color-text-muted)'
  },
  timelineContainer: {
    position: 'relative',
    margin: '28px 0 36px 0',
    padding: '0 10px'
  },
  progressLineWrapper: {
    position: 'absolute',
    top: '12px',
    left: '10px',
    right: '10px',
    height: '4px',
    backgroundColor: 'var(--color-border-light)',
    zIndex: 1
  },
  progressLineActive: {
    height: '100%',
    backgroundColor: 'var(--color-primary)',
    transition: 'width 0.4s ease'
  },
  stepsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2
  },
  stepNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80px'
  },
  stepDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
    border: '3px solid transparent',
    transition: 'var(--transition-fast)'
  },
  stepLabel: {
    fontSize: '10px',
    textAlign: 'center',
    marginTop: '8px',
    whiteSpace: 'nowrap'
  },
  cardBody: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '32px',
    borderTop: '1px solid var(--color-border-light)',
    paddingTop: '24px'
  },
  itemsBlock: {
    display: 'flex',
    flexDirection: 'column'
  },
  blockTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px'
  },
  itemNameCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1
  },
  miniSwatch: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    flexShrink: 0
  },
  itemName: {
    color: 'var(--color-primary-dark)',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  itemQtyPrice: {
    color: 'var(--color-text-muted)',
    fontSize: '12px'
  },
  metaBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  addressText: {
    fontSize: '12px',
    color: 'var(--color-text-dark)',
    lineHeight: '1.5'
  },
  summaryInfo: {
    backgroundColor: 'var(--color-border-light)',
    padding: '16px',
    borderRadius: '8px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginBottom: '8px'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-accent)',
    marginBottom: '12px'
  },
  payBtn: {
    width: '100%',
    textAlign: 'center',
    padding: '8px 0',
    borderRadius: '6px',
    fontSize: '12px'
  }
};

// Adaptive screen width handling
if (window.innerWidth <= 768) {
  styles.cardBody = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };
}
