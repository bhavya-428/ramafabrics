import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Home = ({ setRoute, setCategoryFilter, setSelectedProductId }) => {
  const { products, addToCart, cart, updateCartQty, heroBanners } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);

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
  };

  const categories = [
    { name: 'Cotton', img: 'https://4.imimg.com/data4/GA/RI/MY-27997219/cotton-fabric.jpg' },
    { name: 'Silk', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxF4mZjvZhZkuUdrzLmDh2PfpUM8M3D8W13Hvworpa1OX69LaXv35A4Gvi&s=10' },
    { name: 'Linen', img: 'https://fabricshreeom.com/cdn/shop/files/PureLinen.jpg?v=1746276619' },
    { name: 'Rayon', img: 'https://www.tradeuno.com/cdn/shop/products/PinkPolkaDotsPrintRayonFabric_1.jpg?v=1755693935&width=1946' },
    { name: 'Muslin', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThl5jffZGyYUeeNmLiCO8-LX9_HGAJIQkagNMFjM2HEXOKJpAyWPOS5Jce&s=10' },
    { name: 'Organza', img: 'https://akrithi.com/cdn/shop/collections/IMG_8641_1.jpg?v=1591716643'},
    { name: 'Chiffon', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3dMHeVW1P8kLQAjtsmFR6JnyYg-LVhTzbVH_dXOMDID-w9apA3cUeumI&s=10' },
    { name: 'Velvet', img: 'https://mmcdn.onlinefabricstore.com/wp-content/uploads/2017/03/IMG_0286-edit.jpg' },
    { name: 'Embroidery', img: 'https://www.tradeuno.com/cdn/shop/files/IMG_E9604_8fdffa25-d443-4c70-b4d0-75140b29a8d6.jpg?v=1755798568&width=1108' },
    { name: 'Printed Fabrics', img: 'https://akrithi.com/cdn/shop/files/IMG_8134.jpg?v=1722780291&width=F' },
    { name: 'Dress Materials', img: 'https://www.royalexport.in/product-img/elegant-simmer-silk-dress-mate-1734689863.jpg' }
  ];

  const premiumSpotlight = [
    {
      id: 'spotlight1',
      title: 'Midnight Velvet Elegance',
      subtitle: 'Experience the soft touch of our premium micro velvet.',
      image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'spotlight2',
      title: 'Banarasi Silk Heritage',
      subtitle: 'Handwoven pure silk that defines royal luxury.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    }
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
        
        <div className="mobile-carousel" style={styles.categoriesWrapper}>
          {categories.map((cat, idx) => (
            <div key={idx} style={styles.categoryCircleCard} onClick={() => handleCategoryClick(cat.name)}>
              <div style={{ ...styles.categoryCircleImg, backgroundImage: `url(${cat.img})` }}></div>
              <span style={styles.categoryCircleName}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PREMIUM SPOTLIGHT */}
      <section className="container" style={styles.spotlightSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>THE PREMIUM EDIT</h2>
          <span style={styles.viewAllLink} onClick={() => { setCategoryFilter('Silk'); setRoute('shop'); }}>Explore Silks →</span>
        </div>
        <div className="grid grid-2 gap-3" style={{ marginTop: '16px' }}>
          {premiumSpotlight.map((spot, idx) => (
            <div 
              key={idx} 
              style={{ ...styles.spotlightCard, backgroundImage: `url(${spot.image})` }}
              onClick={() => handleViewProduct(spot.id)}
            >
              <div style={styles.spotlightOverlay}>
                <h3 style={styles.spotlightTitle}>{spot.title}</h3>
                <p style={styles.spotlightSubtitle}>{spot.subtitle}</p>
                <button style={styles.spotlightBtn}>SHOP NOW</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="container" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>FEATURED PRODUCTS</h2>
          <div style={styles.carouselControls}>
            <div style={styles.controlCircle}>&lt;</div>
            <div style={styles.controlCircle}>&gt;</div>
          </div>
        </div>
        
        <div className="mobile-carousel grid grid-4 gap-3">
          {featuredProducts.concat(featuredProducts[0] || []).slice(0, 4).map((product, idx) => {
            const badge = getBadgeStyle(idx);
            return (
              <div key={idx} style={{...styles.productCard, cursor: 'pointer'}} onClick={() => handleViewProduct(product.id)}>
                <div style={{ ...styles.productImage, backgroundImage: `url(${product.image})` }}>
                  <span style={{ ...styles.productBadge, backgroundColor: badge.bg }}>{badge.text}</span>
                  <div style={styles.wishlistBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </div>
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>
                    {product.name}
                  </h3>
                  <span style={styles.productCat}>{product.category}</span>
                  <div style={styles.priceRow}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.productPrice}>₹{product.price}</span>
                        {product.originalPrice && (
                          <span style={styles.originalPrice}>₹{product.originalPrice}</span>
                        )}
                      </div>
                      <div style={styles.ratingRow}>
                        <span style={styles.stars}>★★★★★</span>
                        <span style={styles.reviewCount}>({(product.id.charCodeAt(product.id.length-1) * 3) % 100 + 40})</span>
                      </div>
                    </div>
                    {cart.find(c => c.product.id === product.id) ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <button 
                          style={{...styles.qtyBtn, border: 'none', backgroundColor: '#f8fafc', color: 'var(--color-primary)'}} 
                          onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, cart.find(c => c.product.id === product.id).quantity - 1); }}
                        >-</button>
                        <span style={{fontWeight: '700', fontSize: '13px', color: 'var(--color-primary)', padding: '0 8px'}}>{cart.find(c => c.product.id === product.id).quantity}</span>
                        <button 
                          style={{...styles.qtyBtn, border: 'none', backgroundColor: '#f8fafc', color: 'var(--color-primary)'}} 
                          onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, cart.find(c => c.product.id === product.id).quantity + 1); }}
                        >+</button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="btn btn-primary btn-sm"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HERITAGE & CRAFTSMANSHIP (ABOUT) */}
      <section className="container" style={styles.heritageSection}>
        <div style={styles.heritageGrid}>
          <div style={styles.heritageImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1606744888344-493238692677?auto=format&fit=crop&w=800&q=80" 
              alt="Craftsmanship" 
              style={styles.heritageImage} 
            />
            <div style={styles.heritageImageOverlay}></div>
          </div>
          <div style={styles.heritageContent}>
            <span style={styles.heritageTag}>THE RAMA EXPERIENCE</span>
            <h2 style={styles.heritageTitle}>Crafting Elegance Since 1995</h2>
            <p style={styles.heritageText}>
              For over two decades, Rama Fabrics has been the ultimate destination for connoisseurs of fine textiles. We source the most exquisite silks, breathable cottons, and intricate handlooms directly from master artisans across the country.
            </p>
            <p style={styles.heritageText}>
              Experience the unparalleled quality and timeless elegance that defines our curated collections. Every thread tells a story of heritage, passion, and unparalleled craftsmanship.
            </p>
            <button 
              onClick={() => setRoute('about')} 
              className="btn btn-secondary"
              style={{ marginTop: '12px' }}
            >
              Discover Our Story
            </button>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SUBSCRIPTION */}
      <section style={styles.newsletterSection}>
        <div className="container">
          <div style={styles.newsletterCard}>
            <div style={styles.newsletterContent}>
              <h2 style={styles.newsletterTitle}>Join Our Exclusive Community</h2>
              <p style={styles.newsletterSubtitle}>Subscribe to receive updates on new arrivals, special offers, and early access to our premium collections.</p>
              <div style={styles.newsletterForm} className="newsletter-form-mobile">
                <input type="email" placeholder="Enter your email address" style={styles.newsletterInput} />
                <button style={styles.newsletterBtn}>SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURES FOOTER */}
      <section style={styles.featuresFooter}>
        <div className="container" style={styles.featuresGrid}>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>🚚</div>
            
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
  qtyBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: '700',
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
  },
  newsletterSection: {
    padding: '60px 0 20px 0',
  },
  newsletterCard: {
    backgroundColor: 'var(--color-primary-dark)',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center',
    backgroundImage: 'radial-gradient(var(--color-primary-light) 0.5px, transparent 0.5px), radial-gradient(var(--color-primary-light) 0.5px, var(--color-primary-dark) 0.5px)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    boxShadow: '0 12px 24px rgba(125, 29, 43, 0.15)',
  },
  newsletterContent: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  newsletterTitle: {
    color: '#ffffff',
    fontSize: '28px',
    marginBottom: '12px',
    fontFamily: 'var(--font-serif)',
  },
  newsletterSubtitle: {
    color: '#e2e8f0',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  newsletterForm: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    flexWrap: 'wrap',
  },
  newsletterInput: {
    flexGrow: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    outline: 'none',
    minWidth: '200px',
  },
  newsletterBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#C5A059',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexGrow: 1,
  },
  heritageSection: {
    padding: '60px 0',
  },
  heritageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '48px',
    alignItems: 'center',
  },
  heritageImageWrapper: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(125, 29, 43, 0.1)',
  },
  heritageImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    aspectRatio: '4 / 3',
  },
  heritageImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
  },
  heritageContent: {
    paddingRight: '24px',
  },
  heritageTag: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--color-secondary-dark)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '16px',
    display: 'inline-block',
    borderBottom: '2px solid var(--color-primary)',
    paddingBottom: '4px',
  },
  heritageTitle: {
    fontSize: '36px',
    lineHeight: '1.2',
    color: 'var(--color-primary-dark)',
    marginBottom: '24px',
    fontFamily: 'var(--font-serif)',
  },
  heritageText: {
    fontSize: '15px',
    color: '#475569',
    marginBottom: '20px',
    lineHeight: '1.7',
  },
  spotlightSection: {
    padding: '40px 0',
  },
  spotlightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginTop: '16px',
  },
  spotlightCard: {
    position: 'relative',
    height: '400px',
    borderRadius: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
  spotlightOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '40px 24px 24px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  spotlightTitle: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: 'var(--font-serif)',
    marginBottom: '8px',
    color: '#ffffff',
  },
  spotlightSubtitle: {
    fontSize: '14px',
    color: '#e2e8f0',
    marginBottom: '16px',
  },
  spotlightBtn: {
    padding: '8px 20px',
    backgroundColor: '#ffffff',
    color: 'var(--color-primary-dark)',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
    textTransform: 'uppercase',
  }
};
