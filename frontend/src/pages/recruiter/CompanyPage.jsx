import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CompanyPage = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', website: '', industry: '' });

  useEffect(() => {
    // If recruiter has a company, load it from user context
    if (user?.company) {
      const c = typeof user.company === 'object' ? user.company : null;
      if (c) {
        setCompany(c);
        setForm({ name: c.name || '', description: c.description || '', website: c.website || '', industry: c.industry || '' });
      }
    }
    setLoading(false);
  }, [user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/recruiters/company', form);
      setCompany(data.data);
      toast.success('Company registered! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Company</h1>
        <p>{company ? 'View and manage your company profile' : 'Register your company to start posting jobs'}</p>
      </div>

      {company ? (
        <div>
          {/* Status banner */}
          {company.isApproved ? (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              ✅ Your company is <strong>approved</strong> and can post jobs.
            </div>
          ) : (
            <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
              ⏳ Your company registration is <strong>pending admin approval</strong>. You'll be notified once approved.
            </div>
          )}

          {/* Company card */}
          <div className="card">
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 64, height: 64, borderRadius: 'var(--radius-lg)',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 900, color: '#fff', flexShrink: 0,
                }}
              >
                {company.name?.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{company.name}</h2>
                {company.industry && <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>🏭 {company.industry}</div>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="auth-link" style={{ fontSize: '0.82rem', display: 'block', marginTop: '0.25rem' }}>
                    🌐 {company.website}
                  </a>
                )}
              </div>
            </div>
            {company.description && (
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>About</div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{company.description}</p>
              </div>
            )}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Registered</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontSize: '0.72rem' }}>Status</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: company.isApproved ? 'var(--accent-emerald)' : '#F59E0B' }}>
                  {company.isApproved ? '✅ Approved' : '⏳ Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 560 }}>
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            💡 Register your company to start posting jobs. An admin will review and approve your registration.
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Register Company</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input id="company-name" className="form-input" placeholder="Acme Corp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input id="company-industry" className="form-input" placeholder="e.g. Technology, Finance, Healthcare" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input id="company-website" type="url" className="form-input" placeholder="https://acme.com" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea id="company-desc" className="form-textarea" placeholder="Tell students what your company does, its culture, and what makes it special…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={2000} />
              </div>
              <button id="register-company-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                {saving ? <><span className="spinner spinner-sm" /> Registering…</> : '🏢 Register Company'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
