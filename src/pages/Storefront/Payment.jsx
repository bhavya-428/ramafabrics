import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Payment = ({ orderId, setRoute }) => {
  const { orders, settings, getUpiUrl, getWhatsAppLink } = useContext(ShopContext);
  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [qrExpired, setQrExpired] = useState(false);

  useEffect(() => {
    let timer;
    if (showQR && !qrExpired && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (showQR && timeLeft === 0) {
      setQrExpired(true);
    }
    return () => clearInterval(timer);
  }, [showQR, timeLeft, qrExpired]);

  const handleGenerateQR = () => {
    setShowQR(true);
    setQrExpired(false);
    setTimeLeft(120);
  };

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <button onClick={() => setRoute('')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const upiUrl = getUpiUrl(order);
  const whatsappUrl = getWhatsAppLink(order);
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(upiUrl)}`;

  const handleNotifyWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container animate-fade-in" style={styles.paymentContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>ORDER #{order.id} INSTANT PAYMENT</span>
        <h1 style={styles.title}>UPI QR Payment</h1>
      </div>

      <div style={styles.layout}>
        {/* Left Column: QR Code scanning */}
        <div style={styles.qrColumn} className="luxury-card">
          <h3 style={styles.qrTitle}>Scan with BHIM UPI App</h3>
          <p style={styles.qrDesc}>Use GPay, PhonePe, Paytm, or any UPI app to scan this QR code.</p>
          
          {showQR ? (
            qrExpired ? (
              <div style={{ ...styles.qrWrapper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '232px' }}>
                <span style={{ color: 'var(--color-danger)', fontWeight: 'bold', marginBottom: '16px' }}>QR Code Expired</span>
                <button className="btn btn-primary" onClick={handleGenerateQR}>Regenerate QR</button>
              </div>
            ) : (
              <div 
                style={styles.qrWrapper}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img 
                  src={qrCodeImageUrl} 
                  alt="Payment UPI QR Code" 
                  style={styles.qrImage} 
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div style={styles.qrBorderCorner1}></div>
                <div style={styles.qrBorderCorner2}></div>
                <div style={styles.qrBorderCorner3}></div>
                <div style={styles.qrBorderCorner4}></div>
                <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--color-danger)', fontWeight: 'bold', fontSize: '14px' }}>
                  Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleGenerateQR}
              style={{ marginBottom: '28px', padding: '16px 32px' }}
            >
              Generate QR
            </button>
          )}

          <div style={styles.vpaDetails}>
            <span style={styles.vpaLabel}>Payee UPI VPA:</span>
            <strong style={styles.vpaValue}>{settings.upiId}</strong>
          </div>
        </div>

        {/* Right Column: Checkout validation & WhatsApp trigger */}
        <div style={styles.infoColumn}>
          <div className="luxury-card" style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Payment Details</h3>
            
            <div style={styles.infoRow}>
              <span>Store Name:</span>
              <strong>{settings.storeName}</strong>
            </div>
            
            <div style={styles.infoRow}>
              <span>Delivery Customer:</span>
              <strong>{order.shippingInfo.name}</strong>
            </div>

            <div style={styles.infoRow}>
              <span>Order Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>

            {order.discount > 0 && (
              <div style={styles.infoRow}>
                <span>Discount Applied:</span>
                <span style={{ color: 'var(--color-success)' }}>-₹{order.discount}</span>
              </div>
            )}

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span>Payable Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          {/* Action Steps */}
          <div style={styles.instructionsBox}>
            <h4 style={styles.instructionHeading}>Follow these 2 simple steps:</h4>
            <ol style={styles.instructionList}>
              <li>Scan the QR code on the left and complete your transaction.</li>
              <li>Click the green button below to notify us via WhatsApp. <strong>Your order will not be processed until payment notification is received.</strong></li>
            </ol>
          </div>

          <button onClick={handleNotifyWhatsApp} className="btn btn-primary" style={styles.notifyBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.23-1.371a9.936 9.936 0 0 0 4.78 1.22c5.507 0 9.99-4.478 9.99-9.985C22.002 6.478 17.519 2 12.012 2zm0 18.29a8.27 8.27 0 0 1-4.222-1.164l-.303-.18-3.138.823.837-3.06-.197-.314a8.273 8.273 0 0 1-1.267-4.407c.001-4.568 3.72-8.283 8.291-8.283 4.569 0 8.287 3.715 8.288 8.284-.001 4.57-3.719 8.287-8.289 8.287z" />
            </svg>
            I Have Paid · Notify Shop
          </button>

          <div style={styles.altButtons}>
            <button onClick={() => setRoute('orders')} style={styles.trackBtn}>
              View My Order History
            </button>
            <button onClick={() => setRoute('')} style={styles.homeBtn}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  paymentContainer: {
    paddingTop: '32px',
    paddingBottom: '80px'
  },
  header: {
    marginBottom: '32px'
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
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '40px'
  },
  qrColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px',
    textAlign: 'center'
  },
  qrTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '8px'
  },
  qrDesc: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginBottom: '32px',
    maxWidth: '300px'
  },
  qrWrapper: {
    position: 'relative',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-md)',
    marginBottom: '28px'
  },
  qrImage: {
    width: '200px',
    height: '200px',
    display: 'block'
  },
  // Visual corners around QR block
  qrBorderCorner1: {
    position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '3px solid var(--color-secondary)', borderLeft: '3px solid var(--color-secondary)'
  },
  qrBorderCorner2: {
    position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '3px solid var(--color-secondary)', borderRight: '3px solid var(--color-secondary)'
  },
  qrBorderCorner3: {
    position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '3px solid var(--color-secondary)', borderLeft: '3px solid var(--color-secondary)'
  },
  qrBorderCorner4: {
    position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '3px solid var(--color-secondary)', borderRight: '3px solid var(--color-secondary)'
  },
  vpaDetails: {
    backgroundColor: 'var(--color-border-light)',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'var(--color-text-dark)'
  },
  vpaLabel: {
    color: 'var(--color-text-muted)',
    marginRight: '6px'
  },
  vpaValue: {
    color: 'var(--color-primary-dark)'
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  summaryCard: {
    padding: '24px',
    marginBottom: '24px'
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '16px',
    borderBottom: '1px solid var(--color-border-light)',
    paddingBottom: '8px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-dark)',
    marginBottom: '12px'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border-light)',
    margin: '16px 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-accent)'
  },
  instructionsBox: {
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    borderLeft: '3px solid var(--color-secondary)',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '24px'
  },
  instructionHeading: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    marginBottom: '8px'
  },
  instructionList: {
    paddingLeft: '20px',
    fontSize: '12px',
    color: 'var(--color-text-dark)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  notifyBtn: {
    width: '100%',
    borderRadius: '30px',
    backgroundColor: '#25D366', // WhatsApp Green color
    color: 'white',
    borderColor: '#25D366',
    padding: '16px 0',
    fontSize: '15px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
    transition: 'var(--transition-smooth)',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  altButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px'
  },
  trackBtn: {
    color: 'var(--color-primary)',
    fontSize: '12px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  homeBtn: {
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
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
