import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Shop = ({ setRoute, categoryFilter, setCategoryFilter, setSelectedProductId }) => {
  const { products, addToCart, searchQuery, setSearchQuery, cart, updateCartQty } = useContext(ShopContext);
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleViewProduct = (id) => {
    setSelectedProductId(id);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStock = !inStockOnly || product.stock > 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default
  });

  const categories = ['All', 'Cotton', 'Silk', 'Linen', 'Rayon', 'Muslin', 'Organza', 'Chiffon', 'Velvet', 'Embroidery', 'Printed Fabrics', 'Dress Materials'];

  return (
    <div className="container animate-fade-in" style={styles.shopContainer}>
      {/* Page Title */}
      <div style={styles.header}>
        <span style={styles.subTitle}>EXPLORE OUR WEAVES</span>
        <h1 style={styles.title}>All Fabrics Collection</h1>
      </div>

      <div style={styles.layout}>
        {/* SIDEBAR FILTERS */}
        <aside style={styles.sidebar}>
          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Search Products</h3>
            <input 
              type="text" 
              placeholder="Search silk, handloom..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Categories</h3>
            <div style={styles.categoryList}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    ...styles.categoryBtn,
                    ...(categoryFilter === cat ? styles.activeCategoryBtn : {})
                  }}
                >
                  <span>{cat}</span>
                  <span style={styles.countBadge}>
                    {cat === 'All' 
                      ? products.length 
                      : products.filter(p => p.category === cat).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Availability</h3>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={styles.checkbox}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* MAIN PRODUCT GRID */}
        <main style={styles.mainContent}>
          {/* Top Grid Control bar */}
          <div style={styles.controlBar}>
            <p style={styles.resultsCount}>
              Showing <strong>{sortedProducts.length}</strong> fabrics
            </p>
            <div style={styles.sortWrapper}>
              <span style={styles.sortLabel}>Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={styles.sortSelect}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-3 gap-2">
              {sortedProducts.map((product) => (
                <div key={product.id} className="luxury-card" style={{...styles.productCard, cursor: 'pointer'}} onClick={() => handleViewProduct(product.id)}>
                  {/* Swatch Image Mock */}
                  <div 
                    style={{ ...styles.productSwatch, backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    {product.originalPrice && product.price < product.originalPrice && (
                      <span style={{ ...styles.lowStockBadge, backgroundColor: 'var(--color-accent)', right: '12px', left: 'auto' }}>
                        SALE
                      </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span style={styles.lowStockBadge}>Low Stock: {product.stock}{product.category === 'Ready-to-Wear' ? 'pcs' : 'm'} left</span>
                    )}
                    {product.stock === 0 && (
                      <span style={styles.outOfStockOverlay}>Sold Out</span>
                    )}
                  </div>
                  
                  <div style={styles.productInfo}>
                    <span style={styles.productCat}>{product.category}</span>
                    <h3 style={styles.productName}>
                      {product.name}
                    </h3>
                    <p style={styles.descTrunc}>{product.description.substring(0, 75)}...</p>
                    <div style={styles.priceRow}>
                      <span style={styles.productPrice}>
                        {product.originalPrice ? (
                          <span style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '400' }}>
                              ₹{product.originalPrice}
                            </span>
                            <span style={{ color: 'var(--color-accent)' }}>
                              ₹{product.price}
                              <span style={styles.priceUnit}>
                                {product.category === 'Ready-to-Wear' ? '/pc' : '/m'}
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span>
                            ₹{product.price}
                            <span style={styles.priceUnit}>
                              {product.category === 'Ready-to-Wear' ? '/piece' : '/meter'}
                            </span>
                          </span>
                        )}
                      </span>
                      {product.stock > 0 ? (
                        cart.find(c => c.product.id === product.id) ? (
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
                        )
                      ) : (
                        <span style={styles.soldOutText}>Sold Out</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{color: 'var(--color-secondary)'}}>
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <h3>No fabrics match your search criteria.</h3>
              <p>Try resetting filters or searching with different keywords.</p>
              <button 
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setInStockOnly(false); }}
                className="btn btn-primary btn-sm"
                style={{marginTop: '16px'}}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  shopContainer: {
    paddingTop: '40px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '40px'
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
  layout: {
    display: 'flex',
    gap: '32px'
  },
  sidebar: {
    width: '280px',
    flexShrink: 0
  },
  mainContent: {
    flexGrow: 1
  },
  filterSection: {
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: 'var(--shadow-sm)'
  },
  filterTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    borderBottom: '1px solid var(--color-border-light)',
    paddingBottom: '8px'
  },
  searchInput: {
    padding: '10px 12px',
    fontSize: '13px'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  categoryBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-dark)',
    transition: 'var(--transition-fast)',
    textAlign: 'left'
  },
  activeCategoryBtn: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    fontWeight: '600'
  },
  countBadge: {
    fontSize: '10px',
    backgroundColor: 'var(--color-border-light)',
    color: 'var(--color-text-muted)',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: '600'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: 'var(--color-text-dark)',
    cursor: 'pointer'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: 'var(--color-primary)'
  },
  controlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-white)',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid var(--color-border-light)',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-sm)'
  },
  resultsCount: {
    fontSize: '13px',
    color: 'var(--color-text-muted)'
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sortLabel: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap'
  },
  sortSelect: {
    padding: '6px 12px',
    fontSize: '13px',
    width: '180px'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    overflow: 'hidden'
  },
  productSwatch: {
    height: '160px',
    width: '100%',
    cursor: 'pointer',
    position: 'relative',
    transition: 'var(--transition-smooth)'
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
    borderRadius: '4px'
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: '1.3'
  },
  descTrunc: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
    marginBottom: '16px',
    flexGrow: 1
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto'
  },
  productPrice: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)'
  },
  priceUnit: {
    fontSize: '11px',
    fontWeight: '400',
    color: 'var(--color-text-muted)'
  },
  soldOutText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-danger)'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-white)',
    border: '1px solid var(--color-border-light)',
    borderRadius: '8px',
    padding: '64px 32px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)'
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
  // Responsive sidebar styles handled through CSS media queries if needed,
  // but this is highly performant.
};
// Quick styling overrides for screens under 768px,
if (window.innerWidth <= 768) {
  styles.layout = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };
  styles.sidebar = {
    width: '100%'
  };
}
