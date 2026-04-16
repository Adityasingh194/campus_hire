import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const MyJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteJob, setDeleteJob] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/recruiters/jobs');
      setJobs(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/recruiters/jobs/${deleteJob._id}`);
      toast.success('Job deleted successfully');
      setJobs(prev => prev.filter(j => j._id !== deleteJob._id));
      setDeleteJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (job) => {
    try {
      await api.put(`/recruiters/jobs/${job._id}`, { ...job, isActive: !job.isActive });
      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, isActive: !j.isActive } : j));
      toast.success(`Job ${!job.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>My Job Postings</h1>
          <p>Manage and monitor all your job listings</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">➕ Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3>No jobs posted yet</h3>
          <p>Post your first job to start connecting with students.</p>
          <Link to="/recruiter/jobs/new" className="btn btn-primary">Post a Job</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map((job, i) => (
            <div
              key={job._id}
              className="card"
              style={{ animation: `slideUp 0.4s ${i * 0.06}s both` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{job.title}</h3>
                    <Badge type={job.type} />
                    <Badge status={job.isActive ? 'active' : 'inactive'} />
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {job.location && <span>📍 {job.location}</span>}
                    {job.salary && <span>💰 {job.salary}</span>}
                    <span>👥 {job.openings} opening(s)</span>
                    {job.deadline && <span>⏰ {new Date(job.deadline).toLocaleDateString()}</span>}
                    <span style={{ color: 'var(--text-muted)' }}>
                      Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                  >
                    👥 Applicants
                  </button>
                  <button
                    className={`btn btn-sm ${job.isActive ? 'btn-ghost' : 'btn-emerald'}`}
                    onClick={() => toggleActive(job)}
                  >
                    {job.isActive ? '⏸ Deactivate' : '▶ Activate'}
                  </button>
                  <button
                    className="btn btn-rose btn-sm"
                    onClick={() => setDeleteJob(job)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {job.skillsRequired?.length > 0 && (
                <div style={{ marginTop: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {job.skillsRequired.slice(0, 6).map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteJob}
        onClose={() => setDeleteJob(null)}
        title="Delete Job Posting"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteJob(null)}>Cancel</button>
            <button className="btn btn-rose" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><span className="spinner spinner-sm" /> Deleting…</> : '🗑 Confirm Delete'}
            </button>
          </>
        }
      >
        <div className="alert alert-error">
          ⚠️ This will permanently delete <strong>{deleteJob?.title}</strong> and all associated applications. This cannot be undone.
        </div>
      </Modal>
    </div>
  );
};

export default MyJobsPage;
