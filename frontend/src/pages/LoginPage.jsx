import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/common/Toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      const map = { student: '/student', recruiter: '/recruiter', admin: '/admin' };
      navigate(map[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div style={{ maxWidth: 480 }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(108,99,255,0.12)',
              border: '1px solid rgba(108,99,255,0.3)',
              fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
              marginBottom: '2rem',
            }}
          >
            🏆 #1 Campus Placement Platform
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
            Launch your{' '}
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              career
            </span>{' '}
            today
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Join thousands of students who found their dream jobs through CampusHire. 
            Sign in to access your personalized dashboard.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['🎓 Browse 500+ active job listings', '📊 Track your applications in real-time', '✅ Get notified when you\'re shortlisted'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">C</div>
            <span className="auth-logo-text">CampusHire</span>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue to your dashboard</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <><span className="spinner spinner-sm" /> Signing in…</>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one free</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Link to="/" className="auth-link" style={{ fontSize: '0.8rem', opacity: 0.7 }}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
