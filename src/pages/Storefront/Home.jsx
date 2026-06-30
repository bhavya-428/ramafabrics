import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Home = ({ setRoute, setCategoryFilter, setSelectedProductId }) => {
  const { products, addToCart, cart, updateCartQty } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroBanners = [
    {
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80',
      tag: 'PREMIUM COLLECTION',
      title: 'WEDDING FABRICS',
      subtitle: 'Exclusive fabrics for your special moments'
    },
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      tag: 'NEW ARRIVALS',
      title: 'PURE SILK ELEGANCE',
      subtitle: 'Discover our latest Banarasi collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1600&q=80',
      tag: 'SUMMER ESSENTIALS',
      title: 'BREATHABLE COTTONS',
      subtitle: 'Stay cool with our handblock prints'
    },
    {
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1600&q=80',
      tag: 'DESIGNER CHOICE',
      title: 'FLORAL ORGANZA',
      subtitle: 'Perfect for contemporary drapes'
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));

  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.7).slice(0, 4);

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    setRoute('shop');
  };

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    setRoute('product-detail');
  };

  const categories = [
    { name: 'Cotton', img: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=200&q=80' },
    { name: 'Silk', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80' },
    { name: 'Linen', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=200&q=80' },
    { name: 'Rayon', img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=200&q=80' },
    { name: 'Muslin', img: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=200&q=80' },
    { name: 'Organza', img: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=200&q=80' },
    { name: 'Chiffon', img: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=200&q=80' },
    { name: 'Velvet', img: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=200&q=80' },
    { name: 'Embroidery', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80' },
    { name: 'Printed Fabrics', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Dress Materials', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80' }
  ];

  const getBadgeStyle = (index) => {
    if (index === 0) return { text: '20% OFF', bg: '#ef4444' }; // Red
    if (index === 1) return { text: 'NEW', bg: '#10b981' }; // Green
    if (index === 2) return { text: '15% OFF', bg: '#ef4444' };
    if (index === 3) return { text: 'BESTSELLER', bg: '#10b981' };
    return { text: '10% OFF', bg: '#ef4444' };
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ ...styles.heroBanner, backgroundImage: `url(${heroBanners[currentSlide].image})` }}>
            {/* Left Nav Arrow */}
            <div style={styles.heroNavLeft} onClick={prevSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            
            <div style={styles.heroContent}>
              <span style={styles.heroTag}>{heroBanners[currentSlide].tag}</span>
              <h1 style={styles.heroTitle}>{heroBanners[currentSlide].title}</h1>
              <p style={styles.heroSubtitle}>{heroBanners[currentSlide].subtitle}</p>
              <button 
                onClick={() => { setCategoryFilter('All'); setRoute('shop'); }} 
                style={styles.heroBtn}
              >
                SHOP NOW
              </button>
            </div>

            {/* Right Nav Arrow */}
            <div style={styles.heroNavRight} onClick={nextSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>

            {/* Dots */}
            <div style={styles.heroDots}>
              {heroBanners.map((_, idx) => (
                <div 
                  key={idx} 
                  style={{ ...styles.dot, backgroundColor: currentSlide === idx ? '#C5A059' : 'rgba(255,255,255,0.5)' }}
                  onClick={() => setCurrentSlide(idx)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="container" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>SHOP BY CATEGORY</h2>
          <span style={styles.viewAllLink} onClick={() => { setCategoryFilter('All'); setRoute('shop'); }}>View All →</span>
        </div>
        
        <div style={styles.categoriesWrapper}>
          {categories.map((cat, idx) => (
            <div key={idx} style={styles.categoryCircleCard} onClick={() => handleCategoryClick(cat.name)}>
              <div style={{ ...styles.categoryCircleImg, backgroundImage: `url(${cat.img})` }}></div>
              <span style={styles.categoryCircleName}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="container" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>FEATURED PRODUCTS</h2>
          <div style={styles.carouselControls}>
            <div style={styles.controlCircle}>&lt;</div>
            <div style={styles.controlCircle}>&gt;</div>
          </div>
        </div>
        
        <div className="grid grid-4 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {featuredProducts.concat(featuredProducts[0] || []).slice(0, 5).map((product, idx) => {
            const badge = getBadgeStyle(idx);
            return (
              <div key={idx} style={styles.productCard}>
                <div style={{ ...styles.productImage, backgroundImage: `url(${product.image})` }} onClick={() => handleViewProduct(product.id)}>
                  <span style={{ ...styles.productBadge, backgroundColor: badge.bg }}>{badge.text}</span>
                  <div style={styles.wishlistBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </div>
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <span style={styles.productCat}>{product.category}</span>
                  <div style={styles.priceRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={styles.productPrice}>₹{product.price}</span>
                      {product.originalPrice && (
                        <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div style={styles.ratingRow}>
                      <span style={styles.stars}>★★★★★</span>
                      <span style={styles.reviewCount}>({Math.floor(Math.random() * 100) + 20})</span>
                    </div>
                  </div>
                </div>
                {cart.find(c => c.product.id === product.id) ? (
                  <div style={{...styles.addToCartBtn, display: 'flex', justifyContent: 'space-between', padding: '8px 16px', backgroundColor: '#FDF8F5', color: '#1e293b', borderTop: '1px solid #f1f5f9'}}>
                    <button style={styles.qtyBtn} onClick={() => updateCartQty(product.id, cart.find(c => c.product.id === product.id).quantity - 1)}>-</button>
                    <span style={{fontWeight: '700'}}>{cart.find(c => c.product.id === product.id).quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => updateCartQty(product.id, cart.find(c => c.product.id === product.id).quantity + 1)}>+</button>
                  </div>
                ) : (
                  <button style={styles.addToCartBtn} onClick={() => addToCart(product, 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURES FOOTER */}
      <section style={styles.featuresFooter}>
        <div className="container" style={styles.featuresGrid}>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>🚚</div>
            <div>
              <h4 style={styles.featureTitle}>FREE SHIPPING</h4>
              <p style={styles.featureDesc}>On orders above ₹999</p>
            </div>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>🛡️</div>
            <div>
              <h4 style={styles.featureTitle}>PREMIUM QUALITY</h4>
              <p style={styles.featureDesc}>Finest fabrics assured</p>
            </div>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>↩️</div>
            <div>
              <h4 style={styles.featureTitle}>EASY RETURNS</h4>
              <p style={styles.featureDesc}>7 days easy return</p>
            </div>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>🎧</div>
            <div>
              <h4 style={styles.featureTitle}>CUSTOMER SUPPORT</h4>
              <p style={styles.featureDesc}>We're here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#FAF9F6', // Very light cream
  },
  heroSection: {
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  heroBanner: {
    width: '100%',
    height: '400px',
    borderRadius: '16px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    transition: 'background-image 0.5s ease-in-out',
  },
  heroNavLeft: {
    position: 'absolute',
    left: '20px',
    color: '#fff',
    cursor: 'pointer',
  },
  heroNavRight: {
    position: 'absolute',
    right: '20px',
    color: '#fff',
    cursor: 'pointer',
  },
  heroDots: {
    position: 'absolute',
    bottom: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
  },
  heroContent: {
    paddingLeft: '80px',
    color: '#fff',
    maxWidth: '500px',
  },
  heroTag: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '2px',
    color: '#C5A059',
    display: 'block',
    marginBottom: '12px',
  },
  heroTitle: {
    fontSize: '48px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    lineHeight: '1.1',
    color: '#fff',
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: '16px',
    fontWeight: '400',
    marginBottom: '32px',
    opacity: 0.9,
  },
  heroBtn: {
    backgroundColor: '#C5A059',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
  },
  section: {
    padding: '40px 24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#334155',
    letterSpacing: '0.5px',
  },
  viewAllLink: {
    fontSize: '14px',
    color: '#6C1425',
    fontWeight: '600',
    cursor: 'pointer',
  },
  categoriesWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '16px',
  },
  categoryCircleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    minWidth: '80px',
  },
  categoryCircleImg: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  categoryCircleName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#334155',
    textAlign: 'center',
  },
  carouselControls: {
    display: 'flex',
    gap: '8px',
  },
  controlCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '14px',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #f1f5f9',
  },
  productImage: {
    height: '220px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  productBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    color: '#fff',
    fontSize: '9px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  productInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
    lineHeight: '1.3',
  },
  productCat: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '12px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
  },
  originalPrice: {
    fontSize: '12px',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stars: {
    color: '#fbbf24',
    fontSize: '12px',
  },
  reviewCount: {
    color: '#94a3b8',
    fontSize: '11px',
  },
  addToCartBtn: {
    backgroundColor: '#6C1425',
    color: '#fff',
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  qtyBtn: {
    backgroundColor: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: '700',
    color: '#64748b'
  },
  featuresFooter: {
    backgroundColor: '#FDF8F5',
    borderTop: '1px solid #f1f5f9',
    padding: '40px 0',
    marginTop: '40px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: '28px',
  },
  featureTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '12px',
    color: '#64748b',
  }
};
