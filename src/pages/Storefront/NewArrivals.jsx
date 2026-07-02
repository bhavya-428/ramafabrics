import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const NewArrivals = ({ setRoute, setSelectedProductId }) => {
  const { newArrivals, addToCart, cart, updateCartQty } = useContext(ShopContext);

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
  };

  return (
    <div className="container animate-fade-in" style={styles.pageContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>FRESH OFF THE LOOM</span>
        <h1 style={styles.title}>New Arrivals</h1>
        <p style={styles.desc}>Discover our latest collection of premium fabrics, featuring fresh designs and modern weaves for the season.</p>
      </div>

      <div className="grid grid-4 gap-3">
        {newArrivals.map((product) => (
          <div key={product.id} className="luxury-card" style={{...styles.productCard, cursor: 'pointer'}} onClick={() => handleViewProduct(product.id)}>
            <div 
              style={{ ...styles.productImage, backgroundImage: `url(${product.image})` }}
            >
              <span style={styles.newBadge}>NEW</span>
            </div>
            
            <div style={styles.productInfo}>
              <span style={styles.productCat}>{product.category}</span>
              <h3 style={styles.productName}>
                {product.name}
              </h3>
              <div style={styles.priceRow}>
                <span style={styles.productPrice}>₹{product.price}</span>
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
  newBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#10b981',
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
    marginBottom: '16px',
    lineHeight: '1.3'
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
