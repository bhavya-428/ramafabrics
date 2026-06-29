import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const ProductDetail = ({ productId, setRoute }) => {
  const { products, addToCart } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState(false);

  const product = products.find(p => p.id === productId);

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

  return (
    <div className="container animate-fade-in" style={styles.detailContainer}>
      {/* Back link */}
      <button onClick={() => setRoute('shop')} style={styles.backBtn}>
        ← Back to Shop Collection
      </button>

      <div style={styles.layout}>
        {/* Swatch Display */}
        <div style={styles.swatchColumn}>
          <div style={{ ...styles.swatchBig, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span style={styles.swatchLabel}>Fabric Specimen Zoom</span>
          </div>
          <div style={styles.swatchDetails}>
            <div style={styles.specCard}>
              <span style={styles.specLabel}>Width</span>
              <span style={styles.specValue}>44 inches (112 cm)</span>
            </div>
            <div style={styles.specCard}>
              <span style={styles.specLabel}>Material</span>
              <span style={styles.specValue}>{product.category} blend</span>
            </div>
            <div style={styles.specCard}>
              <span style={styles.specLabel}>Care</span>
              <span style={styles.specValue}>Dry clean / Handwash</span>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div style={styles.infoColumn}>
          <span style={styles.categoryBadge}>{product.category}</span>
          <h1 style={styles.productTitle}>{product.name}</h1>
          
          <div style={styles.ratingRow}>
            <span style={styles.stars}>★★★★★</span>
            <span style={styles.ratingText}>{product.rating} / 5.0 (Google verified review)</span>
          </div>

          <div style={styles.priceContainer}>
            {product.originalPrice ? (
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: '400' }}>
                  Original: ₹{product.originalPrice}
                </span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ ...styles.price, color: 'var(--color-accent)' }}>₹{product.price}</span>
                  <span style={styles.priceUnit}>{product.category === 'Ready-to-Wear' ? 'per piece' : 'per meter'}</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '12px', backgroundColor: 'rgba(30, 126, 52, 0.08)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', marginLeft: '12px' }}>
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </span>
              </span>
            ) : (
              <>
                <span style={styles.price}>₹{product.price}</span>
                <span style={styles.priceUnit}>{product.category === 'Ready-to-Wear' ? 'per piece' : 'per meter'}</span>
              </>
            )}
          </div>

          {/* Description */}
          <div style={styles.descriptionSection}>
            <h3 style={styles.sectionHeading}>Product Description</h3>
            <p style={styles.descriptionText}>{product.description}</p>
          </div>

          {/* Stock and Purchase Section */}
          <div style={styles.purchaseSection}>
            <div style={styles.stockStatus}>
              {product.stock > 0 ? (
                <div style={styles.stockDetails}>
                  <span style={styles.inStockDot}></span>
                  <span style={styles.stockText}>
                    In Stock: <strong>{product.stock} {product.category === 'Ready-to-Wear' ? 'pieces' : 'meters'}</strong> available
                  </span>
                  {product.stock <= 5 && (
                    <span style={styles.stockAlert}>Running extremely low!</span>
                  )}
                </div>
              ) : (
                <div style={styles.stockDetails}>
                  <span style={styles.outOfStockDot}></span>
                  <span style={styles.outOfStockText}>Currently Out of Stock</span>
                </div>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div style={styles.quantityRow}>
                  <span style={styles.quantityLabel}>Select Quantity ({product.category === 'Ready-to-Wear' ? 'pcs' : 'meters'}):</span>
                  <div style={styles.quantitySelector}>
                    <button onClick={handleDecrement} style={styles.qtyBtn}>-</button>
                    <span style={styles.qtyValue}>{quantity}</span>
                    <button onClick={handleIncrement} style={styles.qtyBtn}>+</button>
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  <button onClick={handleAddToCart} className="btn btn-primary" style={styles.cartBtn}>
                    Add To Cart
                  </button>
                  <button onClick={handleBuyNow} className="btn btn-gold" style={styles.buyBtn}>
                    Buy It Now
                  </button>
                </div>

                {successMsg && (
                  <div style={styles.toast}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Added {quantity} {product.category === 'Ready-to-Wear' ? 'pc(s)' : 'meter(s)'} to your shopping cart!</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sourcing Notes */}
          <div style={styles.sourcingBox}>
            <strong>Quality Assured:</strong> Sourced directly from local weavers. Colors may vary slightly due to screen resolutions and artisanal handloom hand dyeing processes.
          </div>
        </div>
      </div>
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
    color: 'var(--color-primary-light)',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '28px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'var(--transition-fast)'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '48px'
  },
  swatchColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  swatchBig: {
    height: '380px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-border-light)',
    position: 'relative'
  },
  swatchLabel: {
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '6px 16px',
    borderRadius: '20px'
  },
  swatchDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px'
  },
  specCard: {
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  specLabel: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  specValue: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)'
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    color: 'var(--color-secondary-dark)',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    marginBottom: '12px'
  },
  productTitle: {
    fontSize: '32px',
    lineHeight: '1.2',
    color: 'var(--color-primary-dark)',
    marginBottom: '12px'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px'
  },
  stars: {
    color: 'var(--color-secondary)',
    fontSize: '16px'
  },
  ratingText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px',
    marginBottom: '24px'
  },
  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-primary)'
  },
  priceUnit: {
    fontSize: '14px',
    color: 'var(--color-text-muted)'
  },
  descriptionSection: {
    marginBottom: '28px'
  },
  sectionHeading: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  },
  descriptionText: {
    fontSize: '14px',
    color: 'var(--color-text-dark)',
    lineHeight: '1.6'
  },
  purchaseSection: {
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '28px'
  },
  stockStatus: {
    marginBottom: '20px'
  },
  stockDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  inStockDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success)'
  },
  outOfStockDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-danger)'
  },
  stockText: {
    fontSize: '13px',
    color: 'var(--color-text-dark)'
  },
  stockAlert: {
    backgroundColor: 'rgba(189, 33, 48, 0.1)',
    color: 'var(--color-danger)',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    marginLeft: '8px',
    textTransform: 'uppercase'
  },
  outOfStockText: {
    fontSize: '13px',
    color: 'var(--color-danger)',
    fontWeight: '600'
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  quantityLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-dark)'
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-border-light)',
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-primary-dark)',
    transition: 'var(--transition-fast)'
  },
  qtyValue: {
    width: '44px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  cartBtn: {
    borderRadius: '8px',
    padding: '14px 20px',
    fontSize: '13px'
  },
  buyBtn: {
    borderRadius: '8px',
    padding: '14px 20px',
    fontSize: '13px'
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(30, 126, 52, 0.08)',
    color: 'var(--color-success)',
    border: '1px solid rgba(30, 126, 52, 0.2)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '16px'
  },
  sourcingBox: {
    borderLeft: '3px solid var(--color-secondary)',
    backgroundColor: 'var(--color-border-light)',
    padding: '16px',
    borderRadius: '0 8px 8px 0',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5'
  }
};

// Adaptive screen width handling
if (window.innerWidth <= 768) {
  styles.layout = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  };
}
