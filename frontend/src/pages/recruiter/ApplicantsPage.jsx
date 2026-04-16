import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { toast } from '../../components/common/Toast';

const statusOptions = [
  { value: 'shortlisted', label: '⭐ Shortlist', cls: 'btn-secondary' },
  { value: 'accepted',    label: '✅ Accept',    cls: 'btn-emerald' },
  { value: 'rejected',    label: '❌ Reject',    cls: 'btn-rose' },
];

const ApplicantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          api.get(`/recruiters/jobs`),
          api.get(`/recruiters/jobs/${id}/applicants`),
        ]);
        const foundJob = (jobRes.data.data || []).find(j => j._id === id);
        setJob(foundJob || null);
        setApplicants(appRes.data.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      await api.put(`/recruiters/applications/${appId}/status`, { status });
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      toast.success(`Applicant ${status} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filtered = filter ? applicants.filter(a => a.status === filter) : applicants;

  return (
    <div className="page-container">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/recruiter/jobs')} style={{ marginBottom: '1.5rem' }}>
        ← Back to Jobs
      </button>

      <div className="page-header">
        <h1>Applicants {job ? `— ${job.title}` : ''}</h1>
        <p>{applicants.length} total application{applicants.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filter tabs */}
      <div className="tabs">
        {['', 'pending', 'shortlisted', 'accepted', 'rejected'].map(s => (
          <button
            key={s || 'all'}
            className={`tab${filter === s ? ' active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === '' ? `All (${applicants.length})` :
             s === 'pending' ? `⏳ Pending (${applicants.filter(a => a.status === 'pending').length})` :
             s === 'shortlisted' ? `⭐ Shortlisted (${applicants.filter(a => a.status === 'shortlisted').length})` :
             s === 'accepted' ? `✅ Accepted (${applicants.filter(a => a.status === 'accepted').length})` :
             `❌ Rejected (${applicants.filter(a => a.status === 'rejected').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No {filter ? `"${filter}"` : ''} applicants yet</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((app, i) => (
            <div
              key={app._id}
              className="card"
              style={{ animation: `slideUp 0.4s ${i * 0.06}s both` }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: '1.1rem', flexShrink: 0,
                  }}
                >
                  {app.student?.name?.charAt(0) || '?'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{app.student?.name || 'Unknown'}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{app.student?.email}</div>
                    </div>
                    <Badge status={app.status} />
                  </div>

                  {/* Student info */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                    {app.student?.phone && <span>📞 {app.student.phone}</span>}
                    {app.student?.profile?.cgpa && <span>🎓 CGPA: {app.student.profile.cgpa}</span>}
                    <span>📅 Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {app.student?.profile?.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.5rem 0' }}>
                      {app.student.profile.skills.slice(0, 6).map(s => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                  )}

                  {app.coverLetter && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Cover Letter</div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {app.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      {statusOptions.map(opt => (
                        <button
                          key={opt.value}
                          className={`btn btn-sm ${opt.cls}`}
                          disabled={updating === app._id}
                          onClick={() => updateStatus(app._id, opt.value)}
                        >
                          {updating === app._id ? <span className="spinner spinner-sm" /> : opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {app.status !== 'pending' && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={updating === app._id}
                        onClick={() => updateStatus(app._id, 'pending')}
                      >
                        ↩ Reset to Pending
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
