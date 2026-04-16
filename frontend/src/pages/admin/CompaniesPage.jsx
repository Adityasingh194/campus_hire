import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [acting, setActing] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/admin/companies${params}`);
      setCompanies(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, [filter]);

  const approve = async (id) => {
    setActing(id);
    try {
      await api.put(`/admin/companies/${id}/approve`);
      setCompanies(prev => prev.map(c => c._id === id ? { ...c, isApproved: true } : c));
      toast.success('Company approved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActing(null);
    }
  };

  const reject = async () => {
    if (!rejectTarget) return;
    setActing(rejectTarget._id);
    try {
      await api.put(`/admin/companies/${rejectTarget._id}/reject`);
      setCompanies(prev => prev.filter(c => c._id !== rejectTarget._id));
      toast.success('Company rejected and data removed');
      setRejectTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Companies</h1>
          <p>Review and approve company registrations</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tabs">
        {[
          { val: '', label: 'All' },
          { val: 'pending', label: '⏳ Pending' },
          { val: 'approved', label: '✅ Approved' },
        ].map(t => (
          <button key={t.val} className={`tab${filter === t.val ? ' active' : ''}`} onClick={() => setFilter(t.val)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : companies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h3>No companies found</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {companies.map((company, i) => (
            <div key={company._id} className="card" style={{ animation: `slideUp 0.4s ${i * 0.06}s both` }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Logo */}
                <div
                  style={{
                    width: 56, height: 56, borderRadius: 'var(--radius-md)',
                    background: company.isApproved ? 'var(--grad-emerald)' : 'var(--grad-amber)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, color: '#fff', fontSize: '1.3rem', flexShrink: 0,
                  }}
                >
                  {company.name?.charAt(0)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{company.name}</h3>
                      {company.industry && <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>🏭 {company.industry}</div>}
                    </div>
                    <Badge status={company.isApproved ? 'approved' : 'pending'} />
                  </div>

                  {company.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {company.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="auth-link">🌐 {company.website}</a>}
                    {company.registeredBy && <span>👤 {company.registeredBy.name} ({company.registeredBy.email})</span>}
                    <span>📅 {new Date(company.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    {!company.isApproved && (
                      <button
                        className="btn btn-emerald btn-sm"
                        disabled={acting === company._id}
                        onClick={() => approve(company._id)}
                      >
                        {acting === company._id ? <span className="spinner spinner-sm" /> : '✅ Approve'}
                      </button>
                    )}
                    <button
                      className="btn btn-rose btn-sm"
                      disabled={acting === company._id}
                      onClick={() => setRejectTarget(company)}
                    >
                      ❌ Reject & Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject confirm modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Company"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setRejectTarget(null)}>Cancel</button>
            <button className="btn btn-rose" onClick={reject} disabled={!!acting}>
              {acting ? <><span className="spinner spinner-sm" /> Rejecting…</> : '❌ Confirm Reject'}
            </button>
          </>
        }
      >
        <div className="alert alert-error">
          ⚠️ Rejecting <strong>{rejectTarget?.name}</strong> will permanently delete the company and all its job postings and applications. This cannot be undone.
        </div>
      </Modal>
    </div>
  );
};

export default CompaniesPage;
