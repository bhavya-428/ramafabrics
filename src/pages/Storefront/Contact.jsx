import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Contact = () => {
  const { settings } = useContext(ShopContext);
  const [inquiry, setInquiry] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setInquiry({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 4000);
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(settings.storeAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container animate-fade-in" style={styles.contactContainer}>
      <div style={styles.header}>
        <span style={styles.subTitle}>VISIT OUR BRINDAVAN COLONY SHOWROOM</span>
        <h1 style={styles.title}>Contact Rama Fabrics</h1>
      </div>

      <div style={styles.layout}>
        {/* Contact info cards */}
        <div style={styles.infoColumn}>
          <div className="luxury-card" style={styles.infoCard}>
            <div style={styles.iconCircle}>📍</div>
            <div>
              <h3 style={styles.cardTitle}>Store Address</h3>
              <p style={styles.cardText}>{settings.storeAddress}</p>
            </div>
          </div>

          <div className="luxury-card" style={styles.infoCard}>
            <div style={styles.iconCircle}>📞</div>
            <div>
              <h3 style={styles.cardTitle}>Phone Number</h3>
              <p style={styles.cardText}>{settings.phone}</p>
            </div>
          </div>

          <div className="luxury-card" style={styles.infoCard}>
            <div style={styles.iconCircle}>🕒</div>
            <div>
              <h3 style={styles.cardTitle}>Store Hours</h3>
              <p style={styles.cardText}>Open Daily: {settings.hours}</p>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div style={styles.mapContainer}>
            <iframe
              title="Rama Fabrics Google Map Location"
              src={mapEmbedUrl}
              style={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="luxury-card" style={styles.formCard}>
          <h2 style={styles.formHeading}>Send an Inquiry</h2>
          <p style={styles.formDesc}>Have a question about fabric availability, customization, or custom boutique stitching? Send us a message!</p>
          
          {success && (
            <div style={styles.successToast}>
              Thank you for contacting us! We will get back to you on your email or phone shortly.
            </div>
          )}

          <form onSubmit={handleInquirySubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                value={inquiry.name}
                onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                placeholder="Enter your name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={inquiry.email}
                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                value={inquiry.subject}
                onChange={(e) => setInquiry({ ...inquiry, subject: e.target.value })}
                placeholder="Fabric availability, custom bulk order..."
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                placeholder="Type your message here..."
                className="form-input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contactContainer: {
    paddingTop: '32px',
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
    display: 'grid',
    gridTemplateColumns: '0.95fr 1.05fr',
    gap: '40px'
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px'
  },
  iconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-primary-dark)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardText: {
    fontSize: '13px',
    color: 'var(--color-text-dark)',
    marginTop: '2px'
  },
  mapContainer: {
    height: '240px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)'
  },
  mapIframe: {
    width: '100%',
    height: '100%',
    border: 0
  },
  formCard: {
    padding: '32px'
  },
  formHeading: {
    fontSize: '20px',
    color: 'var(--color-primary-dark)',
    marginBottom: '8px'
  },
  formDesc: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '24px'
  },
  successToast: {
    backgroundColor: 'rgba(30, 126, 52, 0.08)',
    color: 'var(--color-success)',
    border: '1px solid rgba(30, 126, 52, 0.2)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '20px'
  },
  submitBtn: {
    width: '100%',
    borderRadius: '8px',
    padding: '12px 0'
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
