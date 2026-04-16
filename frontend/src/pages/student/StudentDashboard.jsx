import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          api.get('/students/applications?limit=5'),
          api.get('/students/jobs?limit=4'),
        ]);
        setApplications(appRes.data.data || []);
        setRecentJobs(jobRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { icon: '📋', label: 'Total Applied', value: applications.length, color: '#6C63FF', glow: '#6C63FF' },
    { icon: '⏳', label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#F59E0B', glow: '#F59E0B' },
    { icon: '⭐', label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: '#38BDF8', glow: '#38BDF8' },
    { icon: '✅', label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#10B981', glow: '#10B981' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Track your applications and explore new opportunities</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ animationDelay: `${i * 0.08}s`, animation: 'slideUp 0.5s both' }}
          >
            <div className="stat-card__icon" style={{ background: `${s.color}22` }}>
              {s.icon}
            </div>
            <div className="stat-card__value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__glow" style={{ background: s.glow }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Applications</h2>
            <Link to="/student/applications" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {applications.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                <p style={{ fontSize: '0.875rem' }}>No applications yet. <Link to="/student/jobs" className="auth-link">Browse jobs</Link></p>
              </div>
            ) : (
              applications.slice(0, 5).map((app) => (
                <div key={app._id} className="card--flat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.job?.title || 'Job'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                      {app.job?.company?.name || '—'}
                    </div>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Latest Openings</h2>
            <Link to="/student/jobs" className="btn btn-ghost btn-sm">Browse all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentJobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <p style={{ fontSize: '0.875rem' }}>No jobs available right now.</p>
              </div>
            ) : (
              recentJobs.map((job) => (
                <Link key={job._id} to={`/student/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card--flat" style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                        background: 'var(--grad-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: '#fff', fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {job.company?.name?.charAt(0) || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{job.company?.name}</div>
                    </div>
                    <Badge type={job.type} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile completeness prompt */}
      {!user?.profile?.bio && (
        <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
          <span>💡</span>
          <div>
            <strong>Complete your profile!</strong> A complete profile increases your chances of getting shortlisted.{' '}
            <Link to="/student/profile" className="auth-link">Update now →</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
