import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchApps = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter) params.append('status', filter);
      const { data } = await api.get(`/admin/applications?${params}`);
      setApplications(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(1); }, [filter]);

  return (
    <div className="page-container--wide">
      <div className="page-header">
        <h1>All Applications</h1>
        <p>Monitor every application across the platform</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['', 'pending', 'shortlisted', 'accepted', 'rejected'].map(s => (
          <button key={s || 'all'} className={`tab${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
            {!s ? '📋 All' : s === 'pending' ? '⏳ Pending' : s === 'shortlisted' ? '⭐ Shortlisted' : s === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No applications found</h3>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Showing {applications.length} of {pagination.total} applications
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.8rem', flexShrink: 0 }}>
                          {app.student?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{app.student?.name || '—'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{app.job?.title || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{app.job?.company?.name || '—'}</td>
                    <td><Badge type={app.job?.type || 'full-time'} /></td>
                    <td><Badge status={app.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" disabled={pagination.page <= 1} onClick={() => fetchApps(pagination.page - 1)}>‹</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`pagination-btn${pagination.page === p ? ' active' : ''}`} onClick={() => fetchApps(p)}>{p}</button>
              ))}
              <button className="pagination-btn" disabled={pagination.page >= pagination.pages} onClick={() => fetchApps(pagination.page + 1)}>›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsPage;
