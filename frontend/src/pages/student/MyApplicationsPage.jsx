import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/students/applications?${params}`);
      setApplications(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statusFilter, pagination.page]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const statusTabs = ['', 'pending', 'shortlisted', 'accepted', 'rejected'];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of all your job applications</p>
      </div>

      {/* Status filter tabs */}
      <div className="tabs">
        {statusTabs.map((s) => (
          <button
            key={s || 'all'}
            className={`tab${statusFilter === s ? ' active' : ''}`}
            onClick={() => { setStatusFilter(s); setPagination(p => ({ ...p, page: 1 })); }}
          >
            {s === '' ? '📋 All' : s === 'pending' ? '⏳ Pending' : s === 'shortlisted' ? '⭐ Shortlisted' : s === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No applications {statusFilter ? `with status "${statusFilter}"` : 'yet'}</h3>
          <p>Start applying to jobs to see them here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app, i) => (
            <div
              key={app._id}
              className="card"
              style={{ animation: `slideUp 0.4s ${i * 0.05}s both` }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Company initials */}
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 'var(--radius-md)',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: '1.1rem', flexShrink: 0,
                  }}
                >
                  {app.job?.company?.name?.charAt(0) || '?'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        {app.job?.title || 'Job'}
                      </h3>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {app.job?.company?.name} · {app.job?.type}
                      </div>
                    </div>
                    <Badge status={app.status} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                    {app.job?.location && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {app.job.location}</span>
                    )}
                    {app.job?.salary && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>💰 {app.job.salary}</span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {app.job?.deadline && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Deadline: {new Date(app.job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status message */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  background: app.status === 'accepted' ? 'rgba(16,185,129,0.08)' :
                               app.status === 'shortlisted' ? 'rgba(56,189,248,0.08)' :
                               app.status === 'rejected' ? 'rgba(244,63,94,0.08)' :
                               'rgba(245,158,11,0.08)',
                  color: app.status === 'accepted' ? '#10B981' :
                         app.status === 'shortlisted' ? '#38BDF8' :
                         app.status === 'rejected' ? '#F43F5E' :
                         '#F59E0B',
                  borderLeft: `3px solid currentColor`,
                }}
              >
                {app.status === 'pending' && '⏳ Your application is under review.'}
                {app.status === 'shortlisted' && '⭐ Congratulations! You\'ve been shortlisted for this position.'}
                {app.status === 'accepted' && '🎉 Great news! You\'ve been accepted for this role.'}
                {app.status === 'rejected' && '❌ Unfortunately, you were not selected for this position. Keep applying!'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
