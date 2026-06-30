import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Wishlist = ({ setRoute }) => {
  const { wishlist, products, addToCart, toggleWishlist } = useContext(ShopContext);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>My Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h2 style={{ fontSize: '20px', color: '#475569', marginBottom: '12px' }}>Your wishlist is empty</h2>
          <p style={{ color: '#94A3B8', marginBottom: '24px' }}>Save your favorite fabrics here to find them quickly later.</p>
          <button onClick={() => setRoute('shop')} style={styles.btnPrimary}>
            Explore Fabrics
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {wishlistProducts.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <div 
                style={{ ...styles.productImage, backgroundImage: `url(${product.image})` }} 
                onClick={() => {
                  window.location.hash = `product-detail/${product.id}`;
                }}
              >
                <div 
                  style={styles.wishlistBtnActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
              </div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                <span style={styles.productCat}>{product.category}</span>
                <div style={styles.priceRow}>
                  <span style={styles.productPrice}>₹{product.price}</span>
                </div>
              </div>
              <button style={styles.addToCartBtn} onClick={() => addToCart(product, 1)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '48px 24px',
    minHeight: '60vh',
  },
  title: {
    fontSize: '28px',
    fontFamily: 'var(--font-serif)',
    color: '#1e293b',
    marginBottom: '32px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 0',
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: '#6C1425',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  productImage: {
    height: '240px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    cursor: 'pointer',
  },
  wishlistBtnActive: {
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
    marginTop: 'auto',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
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
