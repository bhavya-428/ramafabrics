import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

export const Navbar = ({ currentPath, setRoute }) => {
  const { cart, currentUser, searchQuery, setSearchQuery } = useContext(ShopContext);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setRoute('shop');
    }
  };

  const handleNav = (route, e) => {
    e.preventDefault();
    setRoute(route);
  };

  return (
    <header style={styles.header}>
     

      {/* Main Header (Logo, Search, Icons) */}
      <div style={styles.mainHeader}>
        <div className="container flex align-center justify-between" style={{ height: '100%', gap: '40px' }}>
          
          {/* Logo */}
          <a href="#home" onClick={(e) => handleNav('', e)} style={styles.logoContainer}>
            <div style={styles.logoIcon}>R</div>
            <div style={styles.logoTextWrapper}>
              <span style={styles.logoTitle}>RAMA</span>
              <span style={styles.logoSubtitle}>FABRICS</span>
              <span style={styles.logoTagline}>Your Style. Our Fabrics.</span>
            </div>
          </a>

          {/* Search Bar */}
          <form style={styles.searchContainer} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search by fabric name, material, color, category..." 
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={styles.searchBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* Action Icons */}
          <div style={styles.actions}>
            {/* Wishlist */}
            <a href="#wishlist" onClick={(e) => handleNav('wishlist', e)} style={styles.actionItem}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span style={styles.actionText}>Wishlist</span>
            </a>

            {/* Cart */}
            <a href="#cart" onClick={(e) => handleNav('cart', e)} style={styles.actionItem}>
              <div style={{ position: 'relative' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
              </div>
              <span style={styles.actionText}>Cart</span>
            </a>

            {/* Profile */}
            <a href="#profile" onClick={(e) => currentUser ? handleNav('profile', e) : handleNav('login', e)} style={styles.actionItem}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span style={styles.actionText}>Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div style={styles.secondaryNav}>
        <div className="container" style={{ display: 'flex', gap: '32px' }}>
          <a href="#home" onClick={(e) => handleNav('', e)} style={{ ...styles.navLink, ...((currentPath === '' || currentPath === 'home') ? styles.activeNavLink : {}) }}>Home</a>
          <a href="#shop" onClick={(e) => handleNav('shop', e)} style={{ ...styles.navLink, ...(currentPath === 'shop' ? styles.activeNavLink : {}) }}>Our Fabrics</a>
          <a href="#new-arrivals" onClick={(e) => handleNav('new-arrivals', e)} style={{ ...styles.navLink, ...(currentPath === 'new-arrivals' ? styles.activeNavLink : {}) }}>New Arrivals</a>
          <a href="#best-sellers" onClick={(e) => handleNav('best-sellers', e)} style={{ ...styles.navLink, ...(currentPath === 'best-sellers' ? styles.activeNavLink : {}) }}>Best Sellers</a>
          <a href="#offers" onClick={(e) => handleNav('offers', e)} style={{ ...styles.navLink, ...(currentPath === 'offers' ? styles.activeNavLink : {}) }}>Offers</a>
          <a href="#about" onClick={(e) => handleNav('about', e)} style={{ ...styles.navLink, ...(currentPath === 'about' ? styles.activeNavLink : {}) }}>About Us</a>
          <a href="#contact" onClick={(e) => handleNav('contact', e)} style={{ ...styles.navLink, ...(currentPath === 'contact' ? styles.activeNavLink : {}) }}>Contact Us</a>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #f1f5f9',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    fontFamily: 'var(--font-sans)',
  },
  announcementBar: {
    backgroundColor: '#6C1425',
    color: '#FDF2E9',
    fontSize: '12px',
    fontWeight: '500',
    padding: '8px 0',
  },
  announcementContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  announcementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  mainHeader: {
    height: '90px',
    borderBottom: '1px solid #f8fafc',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: '2px solid #C5A059',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6C1425',
    fontSize: '32px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    background: '#fff',
  },
  logoTextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.1',
  },
  logoTitle: {
    color: '#6C1425',
    fontSize: '24px',
    fontWeight: '800',
    fontFamily: 'var(--font-serif)',
    letterSpacing: '2px',
  },
  logoSubtitle: {
    color: '#6C1425',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'var(--font-serif)',
    letterSpacing: '3px',
  },
  logoTagline: {
    color: '#C5A059',
    fontSize: '11px',
    fontWeight: '600',
    marginTop: '2px',
  },
  searchContainer: {
    flexGrow: 1,
    maxWidth: '600px',
    display: 'flex',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px',
    paddingRight: '60px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#F8FAFC',
    outline: 'none',
  },
  searchBtn: {
    position: 'absolute',
    right: '0',
    top: '0',
    height: '100%',
    width: '56px',
    backgroundColor: '#6C1425',
    color: '#fff',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    display: 'flex',
    gap: '32px',
  },
  actionItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: '#475569',
    cursor: 'pointer',
    position: 'relative',
    textDecoration: 'none',
  },
  actionText: {
    fontSize: '11px',
    fontWeight: '500',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    backgroundColor: '#C5A059',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryNav: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E2E8F0',
    padding: '0',
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
    padding: '16px 0',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    borderBottom: '2px solid transparent',
  },
  activeNavLink: {
    color: '#6C1425',
    fontWeight: '600',
    borderBottomColor: '#6C1425',
  },
  dropdownArrow: {
    fontSize: '9px',
    color: '#94A3B8',
  },
  dropdownCard: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '8px 0',
    minWidth: '150px',
    zIndex: 110,
    border: '1px solid #E2E8F0',
  },
  dropdownHeader: {
    padding: '8px 16px',
    borderBottom: '1px solid #f1f5f9',
    fontWeight: '600',
    fontSize: '13px',
    color: '#334155',
  },
  dropdownItem: {
    display: 'block',
    padding: '10px 16px',
    fontSize: '13px',
    color: '#475569',
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
  }
};
