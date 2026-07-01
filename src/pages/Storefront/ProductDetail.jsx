import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const ProductDetail = ({ productId, setRoute }) => {
  const { 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    recentlyViewed, 
    addToRecentlyViewed,
    reviews
  } = useContext(ShopContext);

  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const product = products.find((p) => p.id === productId);

  // Gallery images mock
  const [activeImage, setActiveImage] = useState('');

  // Sync active image when productId changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      // Track as recently viewed
      addToRecentlyViewed(product.id);
      // Reset quantity
      setQuantity(1);
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="container" style={styles.notFound}>
        <h2>Product Not Found</h2>
        <button onClick={() => setRoute('shop')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setRoute('cart');
  };

  const handleRecommendClick = (recId) => {
    setRoute(`product-detail/${recId}`); // Trigger hash change internally
  };

  const hasDiscount = product.originalPrice && product.price < product.originalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Alternate images for the mock gallery
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508285869451-140578618bb9?auto=format&fit=crop&w=600&q=80'
  ];

  // Colors mock (using gradients from colors list)
  const mockColors = [
    { name: 'Primary Specimen', color: product.colorPattern || '#7D1D2B' },
    { name: 'Alternative Tint', color: 'linear-gradient(135deg, #cbd5e1 0%, #475569 100%)' },
    { name: 'Highlight Shade', color: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 100%)' }
  ];

  // Recently Viewed Fabrics list
  const recentlyViewedItems = products
    .filter((p) => recentlyViewed.includes(p.id) && p.id !== product.id)
    .slice(0, 4);

  // Reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id);

  return (
    <div className="container animate-fade-in page-bottom-padding" style={styles.detailContainer}>
      
      {/* 1. BACK LINK */}
      <button onClick={() => setRoute('shop')} style={styles.backBtn}>
        ← Back to Shop Collection
      </button>

      <div style={styles.layout}>
        
        {/* 2. GALLERY IMAGE COLUMN */}
        <div style={styles.galleryColumn}>
          <div style={styles.mainImageWrapper}>
            <img src={activeImage || product.image} alt={product.name} style={styles.mainImage} />
            {hasDiscount && (
              <span style={styles.discountBadge}>
                {discountPercent}% OFF
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          <div style={styles.thumbnailsRow}>
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img)}
                style={{
                  ...styles.thumbnail,
                  borderColor: (activeImage === img || (!activeImage && idx === 0)) ? 'var(--color-primary)' : '#eaeaec'
                }}
              >
                <img src={img} alt="Specimen Thumbnail" style={styles.thumbnailImg} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT SPECIFICATIONS COLUMN */}
        <div style={styles.infoColumn}>
          <span style={styles.categoryBadge}>{product.category}</span>
          <h1 style={styles.productTitle}>{product.name}</h1>
          
          <div style={styles.ratingRow}>
            <span style={styles.ratingBadge}>★ {product.rating}</span>
            <span style={styles.ratingText}>Verified Customer Rating</span>
          </div>

          <div style={styles.priceSection}>
            <div style={styles.priceFlex}>
              <span style={styles.priceCurrent}>₹{product.price}</span>
              {hasDiscount && (
                <>
                  <span style={styles.priceOriginal}>₹{product.originalPrice}</span>
                  <span style={styles.priceDiscount}>({discountPercent}% OFF)</span>
                </>
              )}
            </div>
            <span style={styles.priceUnit}>
              {product.category === 'Ready-to-Wear' ? 'per piece' : 'per meter'}
            </span>
          </div>

          {/* Color options */}
          <div style={styles.detailGroup}>
            <span style={styles.groupLabel}>Available Colors:</span>
            <div style={styles.colorsRow}>
              {mockColors.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  style={{
                    ...styles.colorCircle,
                    background: col.color,
                    borderColor: selectedColor === idx ? 'var(--color-primary)' : 'transparent',
                    transform: selectedColor === idx ? 'scale(1.15)' : 'scale(1)'
                  }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Product Description */}
          <div style={styles.descriptionBox}>
            <p style={styles.descriptionText}>{product.description}</p>
          </div>

          {/* Care & details */}
          <div style={styles.specificationsBox}>
            <h3 style={styles.specTitle}>Fabric Details</h3>
            <table style={styles.specTable}>
              <tbody>
                <tr>
                  <td style={styles.specKey}>Material Type</td>
                  <td style={styles.specVal}>100% {product.category}</td>
                </tr>
                <tr>
                  <td style={styles.specKey}>Width</td>
                  <td style={styles.specVal}>44 inches (112 cm)</td>
                </tr>
                <tr>
                  <td style={styles.specKey}>Pattern</td>
                  <td style={styles.specVal}>{product.name.includes('Print') ? 'Printed' : product.name.includes('Embroidery') ? 'Embroidered' : 'Solid / Handwoven'}</td>
                </tr>
                <tr>
                  <td style={styles.specKey}>Transparency</td>
                  <td style={styles.specVal}>{['Organza', 'Chiffon', 'Muslin'].includes(product.category) ? 'Semi-Transparent' : 'Opaque'}</td>
                </tr>
                <tr>
                  <td style={styles.specKey}>Wash Care</td>
                  <td style={styles.specVal}>{['Silk', 'Organza', 'Chiffon', 'Velvet'].includes(product.category) ? 'Dry Clean Only' : 'Hand wash cold. Do not bleach.'}</td>
                </tr>
                <tr>
                  <td style={styles.specKey}>Returns</td>
                  <td style={styles.specVal}>7-days easy returns policy.</td>
                </tr>
                <tr>
                  <td style={styles.specKey}>Delivery</td>
                  <td style={styles.specVal}>Dispatched in 24 hours.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stock availability details */}
          <div style={styles.stockDetails}>
            {product.stock > 0 ? (
              <div style={styles.stockStatus}>
                <span style={styles.inStockDot}></span>
                <span style={styles.stockText}>
                  In Stock: <strong>{product.stock} {product.category === 'Ready-to-Wear' ? 'pieces' : 'meters'}</strong> remaining.
                </span>
                {product.stock <= 5 && (
                  <span style={styles.lowStockWarning}>Running Low!</span>
                )}
              </div>
            ) : (
              <div style={styles.stockStatus}>
                <span style={styles.outOfStockDot}></span>
                <span style={styles.outOfStockText}>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Desk Purchase Controls */}
          {product.stock > 0 ? (
            <div style={styles.purchaseControls} className="desktop-only">
              <div style={styles.quantityFlex}>
                <span style={styles.groupLabel}>Quantity:</span>
                <div style={styles.qtyBox}>
                  <button onClick={handleDecrement} style={styles.qtyBtn}>-</button>
                  <span style={styles.qtyVal}>{quantity}</span>
                  <button onClick={handleIncrement} style={styles.qtyBtn}>+</button>
                </div>
              </div>
              <div style={styles.actionButtonsRow}>
                <button onClick={handleAddToCart} style={styles.cartBtn}>
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} style={styles.buyBtn}>
                  Buy Now
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.outOfStockBox} className="desktop-only">
              Currently Unavailable
            </div>
          )}

          {/* Wishlist toggle */}
          <button 
            onClick={() => toggleWishlist(product.id)}
            style={{
              ...styles.wishlistToggleBtn,
              color: wishlist.includes(product.id) ? 'var(--color-primary)' : '#282c3f',
              borderColor: wishlist.includes(product.id) ? 'var(--color-primary)' : '#e5e7eb'
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill={wishlist.includes(product.id) ? 'var(--color-primary)' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2" 
              style={{ marginRight: '8px' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{wishlist.includes(product.id) ? 'WISHLISTED' : 'ADD TO WISHLIST'}</span>
          </button>

          {/* Success messages */}
          {successMsg && (
            <div style={styles.toast}>
              <span>Item added successfully to your shopping cart!</span>
            </div>
          )}

        </div>
      </div>

      {/* 3.5 REVIEWS SECTION */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.recentTitle}>Customer Reviews</h2>
        {productReviews.length === 0 ? (
          <p style={{ color: '#7e818c', fontSize: '13px' }}>No reviews yet. Be the first to review this product!</p>
        ) : (
          <div style={styles.reviewsList}>
            {productReviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewAuthor}>
                    <div style={styles.reviewAvatar}>{review.userName.charAt(0).toUpperCase()}</div>
                    <span style={styles.reviewName}>{review.userName}</span>
                  </div>
                  <div style={styles.reviewRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < review.rating ? '#ff9f00' : '#e2e8f0', fontSize: '16px' }}>★</span>
                    ))}
                  </div>
                </div>
                <p style={styles.reviewComment}>{review.comment}</p>
                <span style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECENTLY VIEWED PRODUCTS CAROUSEL */}
      {recentlyViewedItems.length > 0 && (
        <div style={styles.recentlyViewedSection}>
          <h2 style={styles.recentTitle}>Recently Viewed Fabrics</h2>
          <div style={styles.recentGrid}>
            {recentlyViewedItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleRecommendClick(item.id)}
                style={styles.recentCard}
              >
                <div style={styles.recentImgContainer}>
                  <img src={item.image} alt={item.name} style={styles.recentImg} />
                </div>
                <div style={styles.recentInfo}>
                  <span style={styles.recentCat}>{item.category.toUpperCase()}</span>
                  <span style={styles.recentName}>{item.name}</span>
                  <span style={styles.recentPrice}>₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM ACTION BAR (MOBILE ONLY) */}
      {product.stock > 0 && (
        <div className="sticky-details-bar" style={styles.stickyMobileBar}>
          <button onClick={handleAddToCart} style={styles.stickyCartBtn}>
            Add to Cart
          </button>
          <button onClick={handleBuyNow} style={styles.stickyBuyBtn}>
            Buy Now
          </button>
        </div>
      )}

    </div>
  );
};

const styles = {
  notFound: {
    padding: '80px 24px',
    textAlign: 'center'
  },
  detailContainer: {
    paddingTop: '32px',
    paddingBottom: '80px'
  },
  backBtn: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#7e818c',
    marginBottom: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    alignItems: 'flex-start'
  },
  galleryColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '3 / 4',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f6',
    border: '1px solid #eaeaec'
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  discountBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '4px'
  },
  thumbnailsRow: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto'
  },
  thumbnail: {
    width: '64px',
    height: '84px',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '2px solid transparent',
    cursor: 'pointer',
    flexShrink: 0,
    backgroundColor: '#f5f5f6'
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'left'
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(125,29,43,0.08)',
    color: 'var(--color-primary)',
    fontSize: '10px',
    fontWeight: '800',
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  productTitle: {
    fontSize: '20px',
    lineHeight: '1.3',
    color: '#282c3f',
    fontWeight: '700',
    fontFamily: 'var(--font-sans)',
    margin: 0
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  ratingBadge: {
    backgroundColor: '#14c4a6',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  ratingText: {
    fontSize: '12px',
    color: '#7e818c'
  },
  priceSection: {
    borderBottom: '1px solid #eaeaec',
    paddingBottom: '16px'
  },
  priceFlex: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px'
  },
  priceCurrent: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--color-primary)'
  },
  priceOriginal: {
    fontSize: '14px',
    textDecoration: 'line-through',
    color: '#7e818c'
  },
  priceDiscount: {
    fontSize: '13px',
    color: '#ff9f00',
    fontWeight: '700'
  },
  priceUnit: {
    fontSize: '11px',
    color: '#7e818c',
    marginTop: '2px',
    display: 'block'
  },
  detailGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  groupLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#282c3f'
  },
  colorsRow: {
    display: 'flex',
    gap: '12px'
  },
  colorCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid transparent',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    padding: 0
  },
  descriptionBox: {
    margin: '12px 0 20px',
  },
  descriptionText: {
    fontSize: '14.5px',
    color: '#475569',
    lineHeight: '1.6',
  },
  specificationsBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #eaeaec',
    borderRadius: '12px',
    padding: '16px'
  },
  specTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#282c3f',
    marginBottom: '12px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)'
  },
  specTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px'
  },
  specKey: {
    color: '#7e818c',
    padding: '6px 0',
    width: '35%',
    fontWeight: '500'
  },
  specVal: {
    color: '#282c3f',
    padding: '6px 0',
    fontWeight: '600'
  },
  stockDetails: {
    padding: '4px 0'
  },
  stockStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  inStockDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10B981'
  },
  outOfStockDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#EF4444'
  },
  stockText: {
    fontSize: '12px',
    color: '#535766'
  },
  outOfStockText: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#ef4444'
  },
  lowStockWarning: {
    color: '#ff9f00',
    fontWeight: '700',
    fontSize: '11px',
    backgroundColor: '#fffbeb',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  purchaseControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: '1px solid #eaeaec',
    paddingTop: '16px'
  },
  quantityFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-primary)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    backgroundColor: '#f8fafc',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)'
  },
  qtyVal: {
    padding: '0 16px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-primary)'
  },
  actionButtonsRow: {
    display: 'flex',
    gap: '12px'
  },
  cartBtn: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    color: 'var(--color-primary)',
    border: '2px solid var(--color-primary)',
    padding: '12px 0',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  buyBtn: {
    flexGrow: 1,
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 0',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  outOfStockBox: {
    textAlign: 'center',
    padding: '12px 0',
    backgroundColor: '#f3f4f6',
    color: '#9496a2',
    fontWeight: '700',
    fontSize: '13px',
    borderRadius: '6px'
  },
  wishlistToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px 0',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.2s ease',
    marginTop: '8px'
  },
  toast: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    animation: 'fadeIn 0.2s ease'
  },
  recentlyViewedSection: {
    marginTop: '40px',
    borderTop: '1px solid #eaeaec',
    paddingTop: '24px'
  },
  recentTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#282c3f',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '20px',
    textAlign: 'left'
  },
  reviewsSection: {
    marginTop: '40px',
    borderTop: '1px solid #eaeaec',
    paddingTop: '24px'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  reviewCard: {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  reviewAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  reviewAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  reviewName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b'
  },
  reviewComment: {
    fontSize: '13.5px',
    color: '#475569',
    lineHeight: '1.5',
    marginBottom: '8px'
  },
  reviewDate: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  recentGrid: {
    marginTop: '12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '16px',
  },
  recentCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #eaeaec',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  recentImgContainer: {
    width: '100%',
    aspectRatio: '3 / 4',
    overflow: 'hidden',
    backgroundColor: '#f5f5f6'
  },
  recentImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  recentInfo: {
    padding: '8px',
    textAlign: 'left'
  },
  recentCat: {
    fontSize: '8.5px',
    fontWeight: '700',
    color: '#7e818c',
    display: 'block'
  },
  recentName: {
    fontSize: '11px',
    color: '#282c3f',
    fontWeight: '600',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '2px'
  },
  recentPrice: {
    fontSize: '11.5px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    display: 'block',
    marginTop: '4px'
  },
  stickyMobileBar: {
    // Media query handles showing it on mobile, styles defined in index.css
  },
  stickyCartBtn: {
    width: '50%',
    backgroundColor: '#ffffff',
    color: 'var(--color-primary)',
    border: '1.5px solid var(--color-primary)',
    padding: '12px 0',
    borderRadius: '4px',
    fontWeight: '700',
    fontSize: '12.5px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  stickyBuyBtn: {
    width: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    padding: '12px 0',
    borderRadius: '4px',
    fontWeight: '700',
    fontSize: '12.5px',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    textAlign: 'center'
  }
};
