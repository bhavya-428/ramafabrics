import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Offers = ({ setRoute }) => {
  const { offers, products, addToCart } = useContext(ShopContext);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const discountedProducts = products.filter(p => p.originalPrice && p.price < p.originalPrice);

  return (
    <div className="container animate-fade-in" style={styles.offersContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>RAMA FABRICS SPECIALS</span>
        <h1 style={styles.title}>Fabrics Selling at Low Cost</h1>
      </div>

      <div style={styles.descBanner}>
        <p>Explore our seasonal markdown items and handcrafted fabrics selling at direct-from-weaver low costs. Save on luxury silks, georgettes, and ready-to-wear sets!</p>
      </div>

      {/* Markdown products grid */}
      <h2 style={{ ...styles.subTitle, fontSize: '13px', marginBottom: '24px', color: 'var(--color-primary)' }}>Active Sale Fabrics ({discountedProducts.length} items)</h2>
      <div style={styles.discountedGrid}>
        {discountedProducts.map((product) => {
          const savings = product.originalPrice - product.price;
          const savingsPercent = Math.round((savings / product.originalPrice) * 100);
          return (
            <div key={product.id} className="luxury-card" style={styles.productCard}>
              <div 
                style={{ ...styles.productSwatch, background: product.colorPattern }}
                onClick={() => { window.location.hash = `product-detail/${product.id}`; }}
              >
                <span style={styles.swatchText}>Fabric Preview</span>
                <span style={styles.discountBadge}>
                  {savingsPercent}% OFF
                </span>
              </div>
              <div style={styles.productInfo}>
                <span style={styles.productCat}>{product.category}</span>
                <h3 
                  style={styles.productName}
                  onClick={() => { window.location.hash = `product-detail/${product.id}`; }}
                >
                  {product.name}
                </h3>
                <div style={styles.priceRow}>
                  <div style={styles.priceCol}>
                    <span style={styles.strikePrice}>₹{product.originalPrice}</span>
                    <strong style={styles.salePrice}>
                      ₹{product.price} <span style={styles.priceUnit}>{product.category === 'Ready-to-Wear' ? '/pc' : '/m'}</span>
                    </strong>
                  </div>
                  {product.stock > 0 ? (
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="btn btn-primary btn-sm"
                      style={styles.addBtn}
                    >
                      + Add
                    </button>
                  ) : (
                    <span style={styles.soldOut}>Sold Out</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.divider}></div>

      {/* Coupons grid */}
      <h2 style={{ ...styles.subTitle, fontSize: '13px', marginBottom: '24px', textAlign: 'center', color: 'var(--color-primary)' }}>Active Extra Discount Coupons</h2>
      <div style={styles.grid}>
        {offers.map((offer) => (
          <div key={offer.id} className="luxury-card" style={styles.offerCard}>
            <div style={styles.cardHeader}>
              <div style={styles.badgeWrapper}>
                <span style={styles.offerBadge}>
                  {offer.type === 'percentage' ? `${offer.discount}% OFF` : `₹${offer.discount} OFF`}
                </span>
              </div>
              <h3 style={styles.offerCode} onClick={() => handleCopyCoupon(offer.code)}>
                <code>{offer.code}</code>
                <span style={styles.copyText}>
                  {copiedCoupon === offer.code ? 'Copied!' : 'Click to copy'}
                </span>
              </h3>
            </div>

            <div style={styles.cardBody}>
              <p style={styles.offerDesc}>{offer.description}</p>
              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <span style={styles.ruleLabel}>Minimum Purchase:</span>
                  <span style={styles.ruleVal}>₹{offer.minPurchase}</span>
                </div>
                <div style={styles.ruleItem}>
                  <span style={styles.ruleLabel}>Applicable On:</span>
                  <span style={styles.ruleVal}>All fabrics catalog</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  offersContainer: {
    paddingTop: '32px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '24px'
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
  descBanner: {
    backgroundColor: 'var(--color-bg-white)',
    borderLeft: '4px solid var(--color-secondary)',
    borderRadius: '4px',
    padding: '16px 20px',
    fontSize: '14px',
    color: 'var(--color-text-dark)',
    marginBottom: '40px',
    boxShadow: 'var(--shadow-sm)'
  },
  discountedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    overflow: 'hidden'
  },
  productSwatch: {
    height: '150px',
    width: '100%',
    cursor: 'pointer',
    position: 'relative'
  },
  swatchText: {
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: '4px 12px',
    borderRadius: '12px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    transition: 'var(--transition-fast)'
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '4px'
  },
  productInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  productCat: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-secondary-dark)',
    textTransform: 'uppercase'
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)',
    margin: '4px 0 12px 0',
    cursor: 'pointer',
    lineHeight: '1.3',
    flexGrow: 1
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  priceCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  strikePrice: {
    textDecoration: 'line-through',
    color: 'var(--color-text-muted)',
    fontSize: '11px'
  },
  salePrice: {
    color: 'var(--color-accent)',
    fontSize: '15px'
  },
  priceUnit: {
    fontSize: '10px',
    fontWeight: '400',
    color: 'var(--color-text-muted)'
  },
  addBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    borderRadius: '8px'
  },
  soldOut: {
    fontSize: '12px',
    color: 'var(--color-danger)',
    fontWeight: '600'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '48px 0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '32px'
  },
  offerCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
    border: '2px dashed var(--color-border)'
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    borderBottom: '1px dashed var(--color-border-light)',
    paddingBottom: '20px'
  },
  badgeWrapper: {
    display: 'flex'
  },
  offerBadge: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  offerCode: {
    fontSize: '24px',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-border-light)',
    padding: '10px 32px',
    borderRadius: '6px',
    width: '100%',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  copyText: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    fontWeight: '400',
    textTransform: 'none'
  },
  cardBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  offerDesc: {
    fontSize: '13px',
    color: 'var(--color-text-dark)',
    lineHeight: '1.5',
    textAlign: 'center'
  },
  ruleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: 'var(--color-bg-cream)',
    padding: '16px',
    borderRadius: '8px'
  },
  ruleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px'
  },
  ruleLabel: {
    color: 'var(--color-text-muted)'
  },
  ruleVal: {
    fontWeight: '600',
    color: 'var(--color-primary-dark)'
  }
};
