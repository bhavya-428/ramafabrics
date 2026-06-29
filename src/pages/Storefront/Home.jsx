import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Home = ({ setRoute, setCategoryFilter, setSelectedProductId }) => {
  const { products, offers, settings, addToCart } = useContext(ShopContext);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.7).slice(0, 4);
  const discountedProducts = products.filter(p => p.originalPrice && p.price < p.originalPrice).slice(0, 4);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    setRoute('shop');
  };

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    setRoute('product-detail');
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 1. HERO SECTION */}
      <section style={styles.hero} className="fabric-pattern-bg">
        <div style={styles.heroOverlay}>
          <div className="container" style={styles.heroContent}>
            <span style={styles.heroTag}>SINCE 2022</span>
            <h1 style={styles.heroTitle}>{settings.heroTitle}</h1>
            <p style={styles.heroSubtitle}>{settings.heroSubtitle}</p>
            <div style={styles.heroButtons}>
              <button 
                onClick={() => { setCategoryFilter('All'); setRoute('shop'); }} 
                className="btn btn-gold"
              >
                Shop Collection
              </button>
              <button 
                onClick={() => setRoute('offers')} 
                className="btn btn-secondary" 
                style={{ color: 'white', borderColor: 'white' }}
              >
                View Offers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OFFERS & DISCOUNTS BOARD */}
      <section className="container" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionSub}>FABRICS AT LOW COST</span>
          <h2 style={styles.sectionTitle}>Special Offers & Markdown Deals</h2>
        </div>
        <div className="grid grid-4 gap-3">
          {discountedProducts.map((product) => {
            const savings = product.originalPrice - product.price;
            const savingsPercent = Math.round((savings / product.originalPrice) * 100);
            return (
              <div key={product.id} className="luxury-card" style={styles.productCard}>
                <div 
                  style={{ ...styles.productSwatch, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  onClick={() => handleViewProduct(product.id)}
                >
                  <span style={styles.swatchText}>Fabric Preview</span>
                  <span style={{ ...styles.lowStockBadge, backgroundColor: 'var(--color-accent)' }}>
                    {savingsPercent}% OFF
                  </span>
                </div>
                <div style={styles.productInfo}>
                  <span style={styles.productCat}>{product.category}</span>
                  <h3 style={styles.productName} onClick={() => handleViewProduct(product.id)}>
                    {product.name}
                  </h3>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingStars}>★</span> {product.rating}
                  </div>
                  <div style={styles.priceRow}>
                    <span style={{ ...styles.productPrice, color: 'var(--color-accent)' }}>
                      ₹{product.price}
                      <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '11px', marginLeft: '6px', fontWeight: '400' }}>
                        ₹{product.originalPrice}
                      </span>
                      <span style={styles.priceUnit}>
                        {product.category === 'Ready-to-Wear' ? '/pc' : '/m'}
                      </span>
                    </span>
                    {product.stock > 0 ? (
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="btn btn-primary btn-sm"
                        style={styles.addBtn}
                      >
                        + Add
                      </button>
                    ) : (
                      <span style={styles.outOfStock}>Sold Out</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Additional Coupons list at the bottom of the section */}
        <div style={{ marginTop: '40px', borderTop: '1px dashed var(--color-border)', paddingTop: '32px' }}>
          <h4 style={{ ...styles.sectionSub, textAlign: 'center', marginBottom: '16px' }}>Extra Savings Coupon Codes</h4>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                onClick={() => handleCopyCoupon(offer.code)}
                style={{ 
                  backgroundColor: 'var(--color-bg-white)', 
                  border: '1px dashed var(--color-secondary)', 
                  borderRadius: '8px', 
                  padding: '12px 24px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title="Click to copy coupon code"
              >
                <code style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)' }}>{offer.code}</code>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {copiedCoupon === offer.code ? 'Copied!' : `(Click to Copy: ${offer.type === 'percentage' ? `${offer.discount}%` : `₹${offer.discount}`} Off)`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES NAVIGATOR */}
      <section style={styles.categoriesSection}>
        <div className="container">
          <div style={styles.sectionHeaderCentered}>
            <span style={styles.sectionSub}>DISCOVER BY FABRIC</span>
            <h2 style={styles.sectionTitle}>Shop by Fabric Type</h2>
          </div>
          <div style={styles.categoriesGrid}>
            {[
              { name: 'Silk', desc: 'Luxury Banarasi, Batik & Brocades', color: '#7D1D2B' },
              { name: 'Cotton', desc: 'Fine Mangalagiri & Block Prints', color: '#0B4A3A' },
              { name: 'Handloom', desc: 'Craftsman Organic Weaves', color: '#9B7834' },
              { name: 'Georgette', desc: 'Flowy Florals & Crepe Prints', color: '#126A54' },
              { name: 'Ready-to-Wear', desc: 'Designer Kurtas & Suit Sets', color: '#A61C39' }
            ].map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => handleCategoryClick(cat.name)}
                style={{ ...styles.categoryCard, borderTopColor: cat.color }}
              >
                <div style={{ ...styles.categoryIconCircle, backgroundColor: cat.color }}>
                  {cat.name.substring(0, 2)}
                </div>
                <h3 style={styles.categoryName}>{cat.name}</h3>
                <p style={styles.categoryDesc}>{cat.desc}</p>
                <span style={styles.categoryLink}>Explore →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="container" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionSub}>HANDPICKED SELECTION</span>
          <h2 style={styles.sectionTitle}>Featured Fabrics & Wear</h2>
        </div>
        <div className="grid grid-4 gap-3">
          {featuredProducts.map((product) => (
            <div key={product.id} className="luxury-card" style={styles.productCard}>
              {/* Visual Swatch Mock */}
              <div 
                style={{ ...styles.productSwatch, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => handleViewProduct(product.id)}
              >
                <span style={styles.swatchText}>Fabric Texture Preview</span>
                {product.stock <= 5 && <span style={styles.lowStockBadge}>Low Stock</span>}
              </div>
              <div style={styles.productInfo}>
                <span style={styles.productCat}>{product.category}</span>
                <h3 style={styles.productName} onClick={() => handleViewProduct(product.id)}>
                  {product.name}
                </h3>
                <div style={styles.ratingRow}>
                  <span style={styles.ratingStars}>★</span> {product.rating} (Google Verified)
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.productPrice}>₹{product.price} <span style={styles.priceUnit}>{product.category === 'Ready-to-Wear' ? '/piece' : '/meter'}</span></span>
                  {product.stock > 0 ? (
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="btn btn-primary btn-sm"
                      style={styles.addBtn}
                    >
                      + Add
                    </button>
                  ) : (
                    <span style={styles.outOfStock}>Sold Out</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.viewMoreRow}>
          <button 
            onClick={() => { setCategoryFilter('All'); setRoute('shop'); }}
            className="btn btn-secondary"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section style={styles.testimonialSection}>
        <div className="container">
          <div style={styles.sectionHeaderCentered}>
            <span style={styles.sectionSub}>WHAT PEOPLE SAY</span>
            <h2 style={{ ...styles.sectionTitle, color: 'white' }}>Reviews from Google</h2>
          </div>
          <div style={styles.testimonialsGrid}>
            {[
              {
                text: "Staff also customer friendly. Very good range of fabrics at reasonable prices.",
                author: "Google Reviewer",
                rating: 5
              },
              {
                text: "Good place good atmosphere. The collection of handlooms is excellent.",
                author: "Vijayawada Local",
                rating: 5
              },
              {
                text: "Beautiful store with a premium selection of contemporary prints and borders.",
                author: "Happy Customer",
                rating: 4.5
              }
            ].map((testi, idx) => (
              <div key={idx} style={styles.testimonialCard}>
                <div style={styles.stars}>{'★'.repeat(Math.floor(testi.rating))}</div>
                <p style={styles.testimonialText}>"{testi.text}"</p>
                <h4 style={styles.testimonialAuthor}>- {testi.author}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    width: '100%'
  },
  hero: {
    height: '450px',
    position: 'relative',
    color: 'var(--color-bg-cream)',
    overflow: 'hidden'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(6, 46, 36, 0.9), rgba(6, 46, 36, 0.7))',
    display: 'flex',
    alignItems: 'center'
  },
  heroContent: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  heroTag: {
    color: 'var(--color-secondary)',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '4px',
    textTransform: 'uppercase'
  },
  heroTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '38px',
    fontWeight: '700',
    color: 'var(--color-bg-cream)',
    maxWidth: '800px',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '16px',
    color: 'rgba(250, 248, 245, 0.8)',
    maxWidth: '600px',
    fontWeight: '300'
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px'
  },
  section: {
    padding: '64px 24px'
  },
  sectionHeader: {
    marginBottom: '32px'
  },
  sectionHeaderCentered: {
    marginBottom: '48px',
    textAlign: 'center'
  },
  sectionSub: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: 'var(--color-secondary-dark)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px'
  },
  sectionTitle: {
    fontSize: '28px',
    color: 'var(--color-primary-dark)',
    position: 'relative'
  },
  offersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  offerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '32px 24px',
    border: '2px dashed var(--color-secondary-light)'
  },
  offerTag: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '0.5px',
    marginBottom: '16px'
  },
  offerCode: {
    fontSize: '22px',
    cursor: 'pointer',
    color: 'var(--color-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '12px',
    backgroundColor: 'var(--color-border-light)',
    padding: '8px 24px',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box'
  },
  copyTooltip: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    fontWeight: '400',
    textTransform: 'none'
  },
  offerDesc: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '20px',
    flexGrow: 1
  },
  offerFooter: {
    fontSize: '12px',
    color: 'var(--color-text-dark)',
    borderTop: '1px solid var(--color-border-light)',
    paddingTop: '12px',
    width: '100%'
  },
  categoriesSection: {
    backgroundColor: 'var(--color-border-light)',
    padding: '64px 0'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '20px'
  },
  categoryCard: {
    backgroundColor: 'var(--color-bg-white)',
    borderTop: '4px solid var(--color-primary)',
    borderRadius: '8px',
    padding: '24px 16px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  categoryIconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'var(--color-primary-dark)'
  },
  categoryDesc: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginBottom: '16px',
    lineHeight: '1.4',
    flexGrow: 1
  },
  categoryLink: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-primary)'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
    overflow: 'hidden'
  },
  productSwatch: {
    height: '180px',
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)'
  },
  swatchText: {
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '4px 12px',
    borderRadius: '12px',
    opacity: 0,
    transition: 'var(--transition-fast)'
  },
  lowStockBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    fontSize: '9px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase'
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
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)',
    cursor: 'pointer',
    marginBottom: '6px',
    lineHeight: '1.3',
    flexGrow: 1
  },
  ratingRow: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '12px'
  },
  ratingStars: {
    color: 'var(--color-secondary)'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)'
  },
  priceUnit: {
    fontSize: '11px',
    fontWeight: '400',
    color: 'var(--color-text-muted)'
  },
  addBtn: {
    borderRadius: '12px',
    padding: '6px 12px',
    fontSize: '11px'
  },
  outOfStock: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-danger)'
  },
  viewMoreRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px'
  },
  testimonialSection: {
    backgroundColor: 'var(--color-primary-dark)',
    padding: '80px 0'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '32px'
  },
  testimonialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '32px 24px',
    color: 'var(--color-bg-cream)'
  },
  stars: {
    color: 'var(--color-secondary)',
    fontSize: '18px',
    marginBottom: '12px'
  },
  testimonialText: {
    fontSize: '13px',
    fontStyle: 'italic',
    lineHeight: '1.6',
    marginBottom: '16px',
    color: 'rgba(250, 248, 245, 0.8)'
  },
  testimonialAuthor: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-secondary-light)'
  }
};

// Add category cards styling hover trigger via standard script logic or CSS files.
// Our CSS index.css covers card effects!
