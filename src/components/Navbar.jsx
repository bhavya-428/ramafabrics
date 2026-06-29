import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const Navbar = ({ currentPath, setRoute }) => {
  const { cart, currentUser, logout } = useContext(ShopContext);

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
          {currentUser ? (
            <div style={styles.userMenu}>
              <span style={styles.userName} title={currentUser.email}>
                Hi, {currentUser.name.split(' ')[0]}
              </span>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
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
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)'
  },
  logoutBtn: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--color-danger)',
    fontWeight: '600',
    padding: '4px 8px',
    border: '1px solid transparent',
    borderRadius: '4px',
    transition: 'var(--transition-fast)'
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
