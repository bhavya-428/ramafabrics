import React, { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Page Imports
import { Home } from './pages/Storefront/Home';
import { Shop } from './pages/Storefront/Shop';
import { ProductDetail } from './pages/Storefront/ProductDetail';
import { Cart } from './pages/Storefront/Cart';
import { Checkout } from './pages/Storefront/Checkout';
import { Payment } from './pages/Storefront/Payment';
import { Orders } from './pages/Storefront/Orders';
import { Offers } from './pages/Storefront/Offers';
import { Contact } from './pages/Storefront/Contact';
import { Login } from './pages/Storefront/Login';
import { AdminPanel } from './pages/Admin/AdminPanel';

function AppContent() {
  const [route, setRoute] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Listen for browser navigation hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash.startsWith('product-detail/')) {
        const id = hash.split('/')[1];
        setSelectedProductId(id);
        setRoute('product-detail');
      } else if (hash.startsWith('payment/')) {
        const id = hash.split('/')[1];
        setSelectedOrderId(id);
        setRoute('payment');
      } else {
        setRoute(hash || '');
      }
      
      // Auto scroll to top on page navigation
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on load to catch initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when states are modified internally
  const handleSetRoute = (newRoute) => {
    if (newRoute === '') {
      window.location.hash = '';
    } else if (newRoute === 'product-detail' && selectedProductId) {
      window.location.hash = `product-detail/${selectedProductId}`;
    } else if (newRoute === 'payment' && selectedOrderId) {
      window.location.hash = `payment/${selectedOrderId}`;
    } else {
      window.location.hash = newRoute;
    }
  };

  const handleSelectProductId = (id) => {
    setSelectedProductId(id);
    window.location.hash = `product-detail/${id}`;
  };

  const handleSelectOrderId = (id) => {
    setSelectedOrderId(id);
    window.location.hash = `payment/${id}`;
  };

  // Render proper subpage component
  const renderPage = () => {
    switch (route) {
      case '':
      case 'home':
        return (
          <Home 
            setRoute={handleSetRoute} 
            setCategoryFilter={setCategoryFilter}
            setSelectedProductId={handleSelectProductId}
          />
        );
      case 'shop':
        return (
          <Shop 
            setRoute={handleSetRoute} 
            categoryFilter={categoryFilter} 
            setCategoryFilter={setCategoryFilter}
            setSelectedProductId={handleSelectProductId}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail 
            productId={selectedProductId} 
            setRoute={handleSetRoute} 
          />
        );
      case 'cart':
        return <Cart setRoute={handleSetRoute} />;
      case 'checkout':
        return (
          <Checkout 
            setRoute={handleSetRoute} 
            setSelectedOrderId={handleSelectOrderId}
          />
        );
      case 'payment':
        return <Payment orderId={selectedOrderId} setRoute={handleSetRoute} />;
      case 'orders':
        return (
          <Orders 
            setRoute={handleSetRoute} 
            selectedOrderId={selectedOrderId} 
            setSelectedProductId={handleSelectProductId}
          />
        );
      case 'offers':
        return <Offers setRoute={handleSetRoute} />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login setRoute={handleSetRoute} />;
      case 'admin':
        return (
          <AdminPanel 
            setRoute={handleSetRoute} 
            setSelectedProductId={handleSelectProductId}
          />
        );
      default:
        return (
          <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>The page you are looking for does not exist.</p>
            <button onClick={() => handleSetRoute('')} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Return Home
            </button>
          </div>
        );
    }
  };

  // Do not render default customer Layout (Navbar/Footer) inside Admin screen
  const isAdminView = route === 'admin';

  return (
    <div style={styles.appWrapper}>
      {!isAdminView && <Navbar currentPath={route} setRoute={handleSetRoute} />}
      <main style={styles.mainWrapper}>
        {renderPage()}
      </main>
      {!isAdminView && <Footer setRoute={handleSetRoute} />}
    </div>
  );
}

const styles = {
  appWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-cream)'
  },
  mainWrapper: {
    flexGrow: 1
  }
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
