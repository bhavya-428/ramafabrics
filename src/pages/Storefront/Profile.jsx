import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Profile = ({ setRoute }) => {
  const { currentUser, logout, orders } = useContext(ShopContext);

  if (!currentUser) {
    // Should be handled by App.jsx or Navbar routing, but just in case
    return (
      <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2>Please login to view your profile</h2>
        <button onClick={() => setRoute('login')} style={styles.btnPrimary}>Go to Login</button>
      </div>
    );
  }

  // Filter orders for the current user
  const userOrders = orders.filter(o => o.userEmail === currentUser.email);

  const handleLogout = () => {
    logout();
    setRoute('');
  };

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>My Profile</h1>
      
      <div style={styles.layout}>
        {/* Profile Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.avatarCircle}>
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={styles.userName}>{currentUser.name}</h2>
          <p style={styles.userEmail}>{currentUser.email}</p>
          
          <div style={styles.accountDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Account Type:</span>
              <span style={styles.detailValue}>{currentUser.isAdmin ? 'Administrator' : 'Customer'}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total Orders:</span>
              <span style={styles.detailValue}>{userOrders.length}</span>
            </div>
          </div>

          {currentUser.isAdmin && (
            <button onClick={() => setRoute('admin')} style={styles.adminBtn}>
              Go to Admin Dashboard
            </button>
          )}

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* Orders List */}
        <div style={styles.mainContent}>
          <h3 style={styles.sectionTitle}>Order History</h3>
          
          {userOrders.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ color: '#64748b', marginBottom: '16px' }}>You haven't placed any orders yet.</p>
              <button onClick={() => setRoute('shop')} style={styles.btnPrimary}>Start Shopping</button>
            </div>
          ) : (
            <div style={styles.ordersList}>
              {userOrders.map(order => (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>Order {order.id}</span>
                      <span style={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span style={{ 
                      ...styles.statusBadge, 
                      backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#fef9c3',
                      color: order.status === 'Delivered' ? '#166534' : '#854d0e'
                    }}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div style={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={styles.itemRow}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <img src={item.product.image} alt={item.product.name} style={styles.itemImage} />
                          <div>
                            <p style={styles.itemName}>{item.product.name}</p>
                            <p style={styles.itemMeta}>Qty: {item.quantity} × ₹{item.product.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.orderFooter}>
                    <span style={styles.orderTotal}>Total: ₹{order.total}</span>
                    <button style={styles.btnOutline} onClick={() => {
                      window.location.hash = `payment/${order.id}`;
                    }}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '48px 24px',
    minHeight: '60vh',
  },
  title: {
    fontSize: '28px',
    fontFamily: 'var(--font-serif)',
    color: '#1e293b',
    marginBottom: '32px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
  },
  layout: {
    display: 'flex',
    gap: '40px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  avatarCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#C5A059',
    color: '#fff',
    fontSize: '32px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  userName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
  },
  accountDetails: {
    width: '100%',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
    padding: '16px 0',
    marginBottom: '24px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
  },
  detailLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '600',
  },
  adminBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#fff',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnPrimary: {
    backgroundColor: '#6C1425',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '16px',
  },
  mainContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
  },
  emptyState: {
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  orderCard: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  orderHeader: {
    backgroundColor: '#f8fafc',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    display: 'block',
    marginBottom: '4px',
  },
  orderDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
  },
  orderItems: {
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: '13px',
    color: '#64748b',
  },
  orderFooter: {
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  orderTotal: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
  },
  btnOutline: {
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
