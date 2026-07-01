import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const BestSellers = ({ setRoute, setSelectedProductId }) => {
  const { products, addToCart, cart, updateCartQty } = useContext(ShopContext);

  // Filter best sellers (using high rating and reviews as proxy)
  const bestSellers = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
    setRoute('product-detail');
  };

  return (
    <div className="container animate-fade-in" style={styles.pageContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>CUSTOMER FAVORITES</span>
        <h1 style={styles.title}>Best Sellers</h1>
        <p style={styles.desc}>Shop our most loved and highest-rated fabrics, trusted by thousands of customers for their exceptional quality.</p>
      </div>

      <div className="grid grid-4 gap-3">
        {bestSellers.map((product) => (
          <div key={product.id} className="luxury-card" style={styles.productCard}>
            <div 
              style={{ ...styles.productImage, backgroundImage: `url(${product.image})` }}
              onClick={() => handleViewProduct(product.id)}
            >
              <span style={styles.bestsellerBadge}>BEST SELLER</span>
            </div>
            
            <div style={styles.productInfo}>
              <span style={styles.productCat}>{product.category}</span>
              <h3 style={styles.productName} onClick={() => handleViewProduct(product.id)}>
                {product.name}
              </h3>
              
              <div style={styles.ratingRow}>
                <span style={styles.stars}>★★★★★</span>
                <span style={styles.ratingText}>{product.rating}</span>
              </div>

              <div style={styles.priceRow}>
                <span style={styles.productPrice}>₹{product.price}</span>
                {cart.find(c => c.product.id === product.id) ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <button 
                      style={{...styles.qtyBtn, border: 'none', backgroundColor: '#f8fafc', color: 'var(--color-primary)'}} 
                      onClick={() => updateCartQty(product.id, cart.find(c => c.product.id === product.id).quantity - 1)}
                    >-</button>
                    <span style={{fontWeight: '700', fontSize: '13px', color: 'var(--color-primary)', padding: '0 8px'}}>{cart.find(c => c.product.id === product.id).quantity}</span>
                    <button 
                      style={{...styles.qtyBtn, border: 'none', backgroundColor: '#f8fafc', color: 'var(--color-primary)'}} 
                      onClick={() => updateCartQty(product.id, cart.find(c => c.product.id === product.id).quantity + 1)}
                    >+</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(product, 1)}
                    className="btn btn-primary btn-sm"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    paddingTop: '40px',
    paddingBottom: '80px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
    maxWidth: '600px',
    margin: '0 auto 48px auto'
  },
  subTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-secondary-dark)',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  title: {
    fontSize: '36px',
    color: 'var(--color-primary-dark)',
    marginTop: '8px',
    marginBottom: '16px'
  },
  desc: {
    fontSize: '15px',
    color: 'var(--color-text-muted)'
  },
  productCard: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  productImage: {
    height: '240px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  bestsellerBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#C5A059',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px'
  },
  productInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  productCat: {
    fontSize: '11px',
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
    marginBottom: '8px',
    lineHeight: '1.3'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '16px'
  },
  stars: {
    color: '#fbbf24',
    fontSize: '14px'
  },
  ratingText: {
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    fontWeight: '500'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)'
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: '700',
  }
};
