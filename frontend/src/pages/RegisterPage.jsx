import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/common/Toast';

const roles = [
  { value: 'student',   icon: '🎓', label: 'Student',   desc: 'Looking for jobs' },
  { value: 'recruiter', icon: '🏢', label: 'Recruiter', desc: 'Hiring talent' },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name}!`);
      const map = { student: '/student', recruiter: '/recruiter', admin: '/admin' };
      navigate(map[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
            Join{' '}
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              CampusHire
            </span>{' '}
            today
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Create your account and start your journey. Students find jobs, recruiters find talent — everyone wins.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { icon: '⚡', title: 'Fast Setup', desc: 'Create your profile in minutes' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected end-to-end' },
              { icon: '🤝', title: 'Verified Companies', desc: 'Only admin-approved recruiters' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">C</div>
            <span className="auth-logo-text">CampusHire</span>
          </div>

          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join the platform that gets you hired</p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              ❌ {error}
            </div>
          )}

          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div className="role-selector" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-option${form.role === r.value ? ' selected' : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}
                  id={`role-${r.value}`}
                >
                  <span className="role-option-icon">{r.icon}</span>
                  <span>{r.label}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone (opt.)</label>
                <input
                  id="reg-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <button
              id="reg-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <><span className="spinner spinner-sm" /> Creating account…</>
              ) : (
                '🎉 Create Account'
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
