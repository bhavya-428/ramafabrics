import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const BestSellers = ({ setRoute, setSelectedProductId }) => {
  const { products, addToCart, toggleWishlist, wishlist } = useContext(ShopContext);

  // Best Sellers: manually curated
  const bestSellers = products.filter(p => p.isBestSeller);

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    setRoute('product-detail');
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>Best Sellers</h1>
          <p style={styles.subtitle}>Our most loved fabrics, highly rated by our customers.</p>
        </div>

        <div style={styles.grid}>
          {bestSellers.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div key={product.id} style={styles.productCard}>
                <div 
                  style={{ ...styles.productImage, backgroundImage: `url(${product.image})` }} 
                  onClick={() => handleViewProduct(product.id)}
                >
                  <span style={styles.bestsellerBadge}>BESTSELLER</span>
                  <div 
                    style={styles.wishlistBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "currentColor"} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <span style={styles.productCat}>{product.category}</span>
                  <div style={styles.priceRow}>
                    <span style={styles.productPrice}>₹{product.price}</span>
                    <div style={styles.ratingRow}>
                      <span style={styles.stars}>★</span>
                      <span style={styles.ratingNumber}>{product.rating}</span>
                    </div>
                  </div>
                </div>
                <button style={styles.addToCartBtn} onClick={() => addToCart(product, 1)}>
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '36px',
    fontFamily: 'var(--font-serif)',
    color: '#1e293b',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px',
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
    height: '240px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#C5A059',
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
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stars: {
    color: '#fbbf24',
    fontSize: '14px',
  },
  ratingNumber: {
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
  },
  addToCartBtn: {
    backgroundColor: '#6C1425',
    color: '#fff',
    padding: '12px',
    fontSize: '13px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  }
};
