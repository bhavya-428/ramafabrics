import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export const Login = ({ setRoute }) => {
  const { login, signup, currentUser } = useContext(ShopContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      const res = login(email, password);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          // Redirect to home or admin depending on account type
          if (res.message.includes('Admin')) {
            setRoute('admin');
          } else {
            setRoute('');
          }
        }, 1500);
      } else {
        setError(res.message);
      }
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      const res = signup(name, email, password);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          setRoute('');
        }, 1500);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="container flex justify-center animate-fade-in" style={styles.loginPageContainer}>
      <div className="luxury-card" style={styles.loginCard}>
        <div style={styles.cardHeader}>
          <span style={styles.logoIcon}>RF</span>
          <h2 style={styles.title}>{isLogin ? 'Customer Sign In' : 'Create Customer Account'}</h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Sign in to access your orders and checkout faster.' : 'Sign up to track orders and save your shipping preferences.'}
          </p>
        </div>

        {error && <div style={styles.errorText}>{error}</div>}
        {success && <div style={styles.successText}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Srinivas Rao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="srinivas@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div style={styles.toggleFooter}>
          {isLogin ? (
            <p>
              New customer?{' '}
              <button onClick={() => setIsLogin(false)} style={styles.toggleBtn}>
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} style={styles.toggleBtn}>
                Login here
              </button>
            </p>
          )}
          <button onClick={() => setRoute('')} style={styles.backBtn}>
            ← Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginPageContainer: {
    paddingTop: '64px',
    paddingBottom: '80px'
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '28px'
  },
  logoIcon: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-secondary)',
    fontFamily: 'var(--font-serif)',
    fontWeight: '700',
    fontSize: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-secondary)',
    marginBottom: '16px'
  },
  title: {
    fontSize: '22px',
    color: 'var(--color-primary-dark)'
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    marginTop: '6px',
    lineHeight: '1.4'
  },
  errorText: {
    backgroundColor: 'rgba(189, 33, 48, 0.08)',
    color: 'var(--color-danger)',
    border: '1px solid rgba(189, 33, 48, 0.2)',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '500'
  },
  successText: {
    backgroundColor: 'rgba(30, 126, 52, 0.08)',
    color: 'var(--color-success)',
    border: '1px solid rgba(30, 126, 52, 0.2)',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '500'
  },
  submitBtn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: '30px',
    marginTop: '8px'
  },
  toggleFooter: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  toggleBtn: {
    color: 'var(--color-primary)',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  backBtn: {
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  }
};
