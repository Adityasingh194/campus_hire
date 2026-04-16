import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { toast } from '../../components/common/Toast';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/students/jobs/${id}`)
      .then(({ data }) => setJob(data.data))
      .catch(() => navigate('/student/jobs'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/students/jobs/${id}/apply`, { coverLetter });
      toast.success('Application submitted successfully!');
      setApplyModal(false);
      setJob(prev => ({ ...prev, hasApplied: true, applicationStatus: 'pending' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return null;

  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="page-container">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        ← Back to jobs
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main content */}
        <div>
          {/* Job header card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div className="company-logo-placeholder" style={{ width: 60, height: 60, fontSize: '1.4rem', flexShrink: 0 }}>
                {job.company?.name?.charAt(0) || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{job.title}</h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {job.company?.name} · {job.company?.industry}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <Badge type={job.type} />
                  {job.isActive && !isExpired ? <Badge status="active" /> : <Badge status="inactive" />}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', margin: '0 0 1rem' }}>
              {job.location && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Location</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>📍 {job.location}</div>
                </div>
              )}
              {job.salary && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Salary</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>💰 {job.salary}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Openings</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>👥 {job.openings}</div>
              </div>
              {job.deadline && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Deadline</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isExpired ? 'var(--accent-rose)' : '' }}>
                    ⏰ {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>About This Role</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Requirements</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skillsRequired?.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Required Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skillsRequired.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar apply panel */}
        <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Apply Now</h3>

            {job.hasApplied ? (
              <div>
                <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                  ✅ You've already applied to this position.
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status: </span>
                  <Badge status={job.applicationStatus} />
                </div>
              </div>
            ) : isExpired ? (
              <div className="alert alert-warning">
                ⏰ Application deadline has passed.
              </div>
            ) : !job.isActive ? (
              <div className="alert alert-warning">
                This job is no longer accepting applications.
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                  Submit your application with an optional cover letter to stand out.
                </p>
                <button
                  id="apply-btn"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setApplyModal(true)}
                >
                  🚀 Apply Now
                </button>
              </>
            )}

            {/* Company info */}
            {job.company && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>About the Company</h4>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{job.company.name}</div>
                {job.company.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.5rem' }}>{job.company.description.substring(0, 200)}{job.company.description.length > 200 ? '…' : ''}</p>
                )}
                {job.company.website && (
                  <a href={job.company.website} target="_blank" rel="noreferrer" className="auth-link" style={{ fontSize: '0.82rem' }}>
                    🌐 Visit website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModal}
        onClose={() => setApplyModal(false)}
        title="Apply for this Position"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setApplyModal(false)}>Cancel</button>
            <button
              id="confirm-apply-btn"
              className="btn btn-primary"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? <><span className="spinner spinner-sm" /> Submitting…</> : '🚀 Submit Application'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            You are applying for <strong>{job.title}</strong> at <strong>{job.company?.name}</strong>.
          </p>
          <div className="form-group">
            <label className="form-label">Cover Letter (Optional)</label>
            <textarea
              id="cover-letter"
              className="form-textarea"
              placeholder="Introduce yourself and explain why you're a great fit for this role…"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              style={{ minHeight: 140 }}
              maxLength={2000}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {coverLetter.length}/2000
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
