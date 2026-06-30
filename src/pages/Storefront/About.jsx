import React from 'react';

export const About = () => {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Our Story</h1>
          <p style={styles.heroSubtitle}>Weaving tradition and luxury into every thread since 2022.</p>
        </div>
      </div>

      <div className="container">
        {/* Content Section 1 */}
        <div style={styles.contentRow}>
          <div style={styles.textColumn}>
            <h2 style={styles.sectionTitle}>A Legacy of Fine Fabrics</h2>
            <p style={styles.paragraph}>
              Founded in the heart of Vijayawada, Rama Fabrics began with a simple yet profound mission: to bring the finest, most exquisite textiles to those who appreciate true craftsmanship. We believe that a great outfit starts with exceptional fabric.
            </p>
            <p style={styles.paragraph}>
              Over the years, we have cultivated relationships with master weavers and artisans across India, ensuring that every piece of silk, cotton, and handloom in our collection meets the highest standards of quality and authenticity.
            </p>
          </div>
          <div style={styles.imageColumn}>
            <img 
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80" 
              alt="Premium Fabric Weaving" 
              style={styles.image} 
            />
          </div>
        </div>

        {/* Content Section 2 */}
        <div style={{ ...styles.contentRow, flexDirection: 'row-reverse', marginTop: '60px' }}>
          <div style={styles.textColumn}>
            <h2 style={styles.sectionTitle}>Our Promise</h2>
            <p style={styles.paragraph}>
              When you shop at Rama Fabrics, you aren't just buying material—you're investing in heritage. We are committed to ethical sourcing, supporting local artisan communities, and providing our customers with textiles that are as sustainable as they are beautiful.
            </p>
            <p style={styles.paragraph}>
              From intricate Banarasi brocades to breathable organic cottons, our curated selection is designed to inspire your creativity, whether you're designing a bespoke wedding lehenga or a comfortable everyday kurti.
            </p>
          </div>
          <div style={styles.imageColumn}>
            <img 
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" 
              alt="Artisanal Handloom" 
              style={styles.image} 
            />
          </div>
        </div>

        {/* Content Section 3: Branches */}
        <div style={{ marginTop: '80px', borderTop: '1px solid #e2e8f0', paddingTop: '60px' }}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: '40px' }}>Visit Our Stores in Vijayawada</h2>
          <div className="grid grid-3 gap-4">
            <div style={styles.branchCard}>
              <h3 style={styles.branchName}>Governerpet Branch (Main Hub)</h3>
              <p style={styles.branchAddress}>29-1-1, Beside Rama Rao Hall, Near Civil Courts, Andhra Hospital Road, Governerpet, Vijayawada, Andhra Pradesh 520002.</p>
            </div>
            <div style={styles.branchCard}>
              <h3 style={styles.branchName}>Brindavan Colony Branch</h3>
              <p style={styles.branchAddress}>40-15-4, Nandamuri Road, Brindavan Colony, Benz Circle, Vijayawada, Andhra Pradesh 520010.</p>
            </div>
            <div style={styles.branchCard}>
              <h3 style={styles.branchName}>Labbipet / Bunder Road Branch</h3>
              <p style={styles.branchAddress}>Located near Kataragada Pichaiah Street (YVR Hospital Lane).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  heroSection: {
    height: '350px',
    backgroundImage: 'linear-gradient(rgba(108, 20, 37, 0.7), rgba(108, 20, 37, 0.7)), url(https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '64px',
  },
  heroContent: {
    color: '#fff',
  },
  heroTitle: {
    fontSize: '48px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    marginBottom: '16px',
    letterSpacing: '2px',
  },
  heroSubtitle: {
    fontSize: '18px',
    fontWeight: '400',
    opacity: 0.9,
  },
  contentRow: {
    display: 'flex',
    gap: '48px',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
  },
  imageColumn: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '32px',
    fontFamily: 'var(--font-serif)',
    color: '#1e293b',
    marginBottom: '24px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#475569',
    marginBottom: '16px',
  },
  branchCard: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  branchName: {
    fontSize: '18px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    color: '#6c1425',
    marginBottom: '12px',
  },
  branchAddress: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
  }
};
