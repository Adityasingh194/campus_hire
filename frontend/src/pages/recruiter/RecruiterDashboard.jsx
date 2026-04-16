import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruiters/jobs?limit=5')
      .then(({ data }) => setJobs(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.isActive).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage your job postings and review applicants</p>
      </div>

      {/* Company status alert */}
      {!user?.company ? (
        <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span>
          <div>
            <strong>No company registered.</strong> You need to register and get your company approved before posting jobs.{' '}
            <Link to="/recruiter/company" className="auth-link">Register Company →</Link>
          </div>
        </div>
      ) : !user.company.isApproved ? (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          <span>⏳</span>
          <div>
            <strong>Company approval pending.</strong> Your company is awaiting admin approval. You'll be able to post jobs once approved.
          </div>
        </div>
      ) : (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <span>✅</span>
          <strong>{user.company.name}</strong> is approved and active. Start posting jobs!
        </div>
      )}

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '💼', label: 'Total Jobs', value: totalJobs, color: '#6C63FF' },
          { icon: '🟢', label: 'Active Jobs', value: activeJobs, color: '#10B981' },
          { icon: '🔴', label: 'Inactive', value: totalJobs - activeJobs, color: '#F43F5E' },
        ].map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animation: `slideUp 0.5s ${i * 0.1}s both` }}>
            <div className="stat-card__icon" style={{ background: `${s.color}22` }}>{s.icon}</div>
            <div className="stat-card__value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__glow" style={{ background: s.color }} />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { to: '/recruiter/jobs/new', icon: '➕', label: 'Post a New Job', color: 'var(--grad-primary)' },
          { to: '/recruiter/jobs', icon: '💼', label: 'Manage My Jobs', color: 'var(--grad-emerald)' },
          { to: '/recruiter/students', icon: '🎓', label: 'Browse Students', color: 'var(--grad-amber)' },
          { to: '/recruiter/company', icon: '🏢', label: 'Company Profile', color: 'var(--grad-rose)' },
        ].map(action => (
          <Link
            key={action.to}
            to={action.to}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1.25rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              transition: 'all 0.2s',
              backdropFilter: 'blur(12px)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'rgba(108,99,255,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.borderColor = '';
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
              {action.icon}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent jobs */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Job Postings</h2>
          <Link to="/recruiter/jobs" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">💼</div>
              <h3>No jobs posted yet</h3>
              <p>Post your first job to start hiring.</p>
              <Link to="/recruiter/jobs/new" className="btn btn-primary">Post a Job</Link>
            </div>
          ) : (
            jobs.slice(0, 5).map(job => (
              <Link key={job._id} to={`/recruiter/jobs/${job._id}/applicants`} style={{ textDecoration: 'none' }}>
                <div className="card--flat" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{job.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                      {job.type} · {job.location || 'Remote'} · {job.openings} opening(s)
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.25rem 0.625rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)' }}>
                      View Applicants →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
