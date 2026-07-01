import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const Footer = ({ setRoute }) => {
  const { settings } = useContext(ShopContext);

  const handleNav = (route, e) => {
    e.preventDefault();
    setRoute(route);
  };

  return (
    <footer style={styles.footer}>
      <div className="container grid grid-4 gap-4" style={styles.gridContainer}>
        {/* Brand column */}
        <div style={styles.column}>
          <div style={styles.brand}>
            <span style={styles.logoIcon}>RF</span>
            <span style={styles.brandName}>RAMA FABRICS</span>
          </div>
          <p style={styles.description}>
            Established in 2022, Rama Fabrics is Vijayawada's premier destination for exquisite clothing and fabrics. We source the finest handloom, silk, and contemporary textiles for you.
          </p>
        </div>

        {/* Links column */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.linkList}>
            <li><a href="#home" onClick={(e) => handleNav('', e)} style={styles.link}>Home</a></li>
            <li><a href="#shop" onClick={(e) => handleNav('shop', e)} style={styles.link}>Shop Fabrics</a></li>
            <li><a href="#offers" onClick={(e) => handleNav('offers', e)} style={styles.link}>Discounts & Offers</a></li>
            <li><a href="#contact" onClick={(e) => handleNav('contact', e)} style={styles.link}>Contact Us</a></li>
          </ul>
        </div>

        {/* Customer area column */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Customer Portal</h4>
          <ul style={styles.linkList}>
            <li><a href="#orders" onClick={(e) => handleNav('orders', e)} style={styles.link}>Track Orders</a></li>
            <li><a href="#cart" onClick={(e) => handleNav('cart', e)} style={styles.link}>Shopping Cart</a></li>
            <li><a href="#login" onClick={(e) => handleNav('login', e)} style={styles.link}>Sign In / Sign Up</a></li>
          </ul>
        </div>

        {/* Contact info column */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Store Information</h4>
          <p style={styles.contactInfo}>
            <strong>Address:</strong><br />
            {settings.storeAddress}
          </p>
          <p style={styles.contactInfo}>
            <strong>Phone:</strong> {settings.phone}<br />
            <strong>Hours:</strong> {settings.hours}
          </p>
          <div style={styles.socials}>
            <span style={styles.socialIcon} title="Facebook">FB</span>
            <span style={styles.socialIcon} title="Instagram">IG</span>
            <span style={styles.socialIcon} title="WhatsApp">WA</span>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div className="container flex align-center justify-between" style={styles.bottomBarFlex}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} Rama Fabrics. All rights reserved.
          </p>
          <p style={styles.tagline}>
            Designed with Premium Indian Handlooms
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--color-primary-dark)',
    color: 'var(--color-bg-cream)',
    paddingTop: '64px',
    borderTop: '3px solid var(--color-secondary)',
    marginTop: '64px'
  },
  gridContainer: {
    paddingBottom: '48px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoIcon: {
    backgroundColor: 'var(--color-bg-cream)',
    color: 'var(--color-primary-dark)',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    fontSize: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-secondary)'
  },
  brandName: {
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '1px',
    color: 'var(--color-secondary)'
  },
  description: {
    fontSize: '13px',
    color: 'rgba(250, 248, 245, 0.7)',
    lineHeight: '1.6'
  },
  heading: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-secondary-light)',
    borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
    paddingBottom: '8px',
    fontFamily: 'var(--font-sans)'
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  link: {
    fontSize: '13px',
    color: 'rgba(250, 248, 245, 0.7)',
    transition: 'var(--transition-fast)'
  },
  contactInfo: {
    fontSize: '13px',
    color: 'rgba(250, 248, 245, 0.7)',
    lineHeight: '1.5'
  },
  socials: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px'
  },
  socialIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--color-secondary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'var(--transition-fast)'
  },
  bottomBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: '24px 0'
  },
  bottomBarFlex: {
    flexWrap: 'wrap',
    gap: '12px'
  },
  copyright: {
    fontSize: '12px',
    color: 'rgba(250, 248, 245, 0.5)'
  },
  tagline: {
    fontSize: '12px',
    color: 'var(--color-secondary-dark)',
    fontStyle: 'italic',
    fontFamily: 'var(--font-serif)'
  }
};

// Add hover effects via window variables or inline style triggers if needed,
// but the current structure keeps styling simple and elegant.
// We can also let the CSS handle general layouts.
styles.link[':hover'] = {
  color: 'var(--color-secondary)',
  paddingLeft: '4px'
};
