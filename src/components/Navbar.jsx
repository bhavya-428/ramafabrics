import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

export const Navbar = ({ currentPath, setRoute }) => {
  const { cart, currentUser, logout } = useContext(ShopContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNav = (route, e) => {
    e.preventDefault();
    setRoute(route);
  };

  return (
    <header style={styles.header}>
      <div className="container flex align-center justify-between" style={{ height: '100%' }}>
        {/* Brand Logo */}
        <a href="#home" onClick={(e) => handleNav('', e)} style={styles.logoContainer}>
          <div style={styles.logoCircle}>
            <img src="/logo.png" alt="Rama Fabrics Logo" style={styles.logoImage} />
          </div>
          <div style={styles.logoTextWrapper}>
            <span style={styles.logoTitle}>RAMA FABRICS</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={styles.navLinks}>
          <a
            href="#home"
            onClick={(e) => handleNav('', e)}
            style={{
              ...styles.navLink,
              ...(currentPath === '' ? styles.activeNavLink : {})
            }}
          >
            Home
          </a>
          <a
            href="#shop"
            onClick={(e) => handleNav('shop', e)}
            style={{
              ...styles.navLink,
              ...(currentPath === 'shop' ? styles.activeNavLink : {})
            }}
          >
            Shop Fabrics
          </a>
          <a
            href="#offers"
            onClick={(e) => handleNav('offers', e)}
            style={{
              ...styles.navLink,
              ...(currentPath === 'offers' ? styles.activeNavLink : {})
            }}
          >
            Offers
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNav('contact', e)}
            style={{
              ...styles.navLink,
              ...(currentPath === 'contact' ? styles.activeNavLink : {})
            }}
          >
            Contact Us
          </a>
          {currentUser && (
            <a
              href="#orders"
              onClick={(e) => handleNav('orders', e)}
              style={{
                ...styles.navLink,
                ...(currentPath === 'orders' ? styles.activeNavLink : {})
              }}
            >
              My Orders
            </a>
          )}
        </nav>

        {/* Action Buttons (Cart, Account) */}
        <div style={styles.actions}>
          
          {/* Cart Icon */}
          <a href="#cart" onClick={(e) => handleNav('cart', e)} style={styles.cartIconWrapper}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: currentPath === 'cart' ? 'var(--color-secondary)' : 'var(--color-primary-dark)' }}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </a>

          {/* Profile Session */}
          {/* Profile Session */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                style={styles.profileTrigger}
                className="navbar-profile-trigger"
              >
                <div style={styles.avatarCircle}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={styles.profileName}>
                  {currentUser.name.split(' ')[0] || currentUser.email.split('@')[0]}
                </span>
                {currentUser.isAdmin && (
                  <span style={styles.admBadge}>ADM</span>
                )}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b', marginLeft: '4px' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div style={styles.dropdownOverlay} onClick={() => setDropdownOpen(false)} />
                  <div style={styles.dropdownCard}>
                    <div style={styles.dropdownHeader}>
                      <span style={styles.dropdownUser}>{currentUser.name}</span>
                      <span style={styles.dropdownEmail}>{currentUser.email}</span>
                    </div>
                    <div style={styles.divider} />
                    <ul style={styles.dropdownList}>
                      {currentUser.isAdmin && (
                        <li>
                          <a 
                            href="/admin.html"
                            style={styles.dropdownItem}
                            onClick={() => setDropdownOpen(false)}
                            className="navbar-profile-item"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                              <rect x="3" y="3" width="7" height="9" />
                              <rect x="14" y="3" width="7" height="5" />
                              <rect x="14" y="12" width="7" height="9" />
                              <rect x="3" y="16" width="7" height="5" />
                            </svg>
                            <span style={{ color: '#C5A059', fontWeight: '600' }}>Admin Panel</span>
                          </a>
                        </li>
                      )}
                      <li>
                        <a 
                          href="#orders" 
                          style={styles.dropdownItem}
                          onClick={(e) => {
                            setDropdownOpen(false);
                            handleNav('orders', e);
                          }}
                          className="navbar-profile-item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                          My Orders
                        </a>
                      </li>
                      <li style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }} 
                          style={{ ...styles.dropdownItem, width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
                          className="navbar-profile-item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          <span style={{ color: '#ef4444' }}>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            <a href="#login" onClick={(e) => handleNav('login', e)} style={styles.loginBtn}>
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '76px',
    backgroundColor: 'var(--color-bg-white)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-sm)'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    boxShadow: 'var(--shadow-sm)'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  logoTextWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoTitle: {
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '1px',
    color: 'var(--color-primary-dark)',
    lineHeight: '1.2'
  },
  logoSubtitle: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontWeight: '600',
    color: 'var(--color-secondary-dark)',
    textTransform: 'uppercase'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px'
  },
  navLink: {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-dark)',
    padding: '8px 0',
    borderBottom: '2px solid transparent',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  activeNavLink: {
    color: 'var(--color-primary)',
    borderBottom: '2px solid var(--color-secondary)',
    fontWeight: '700'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  adminBtn: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
    padding: '6px 12px',
    borderRadius: '4px'
  },
  activeAdminBtn: {
    color: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    backgroundColor: 'var(--color-border-light)'
  },
  cartIconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    transition: 'var(--transition-fast)'
  },
  cartBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '4px 12px 4px 4px',
    borderRadius: '9999px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
  },
  avatarCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
  },
  admBadge: {
    fontSize: '9px',
    fontWeight: '700',
    backgroundColor: '#ffe4e6',
    color: '#e11d48',
    padding: '1px 5px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },
  dropdownCard: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '220px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    padding: '10px 0',
    textAlign: 'left',
  },
  dropdownHeader: {
    padding: '4px 16px 8px 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownUser: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
  },
  dropdownEmail: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '2px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '6px 0',
  },
  dropdownList: {
    listStyle: 'none',
    padding: '0 6px',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  loginBtn: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'var(--transition-fast)'
  }
};
