import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from '../../components/common/Toast';

const TagInput = ({ value = [], onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const t = input.trim().replace(/,$/, '');
      if (t && !value.includes(t)) onChange([...value, t]);
      setInput('');
    }
  };
  return (
    <div className="tag-input-container">
      {value.map(tag => (
        <span key={tag} className="tag-item">
          {tag}
          <button type="button" className="tag-remove" onClick={() => onChange(value.filter(t => t !== tag))}>×</button>
        </span>
      ))}
      <input className="tag-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={addTag} placeholder={value.length === 0 ? placeholder : ''} />
    </div>
  );
};

const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'full-time',
    location: '', salary: '', requirements: [],
    skillsRequired: [], deadline: '', openings: 1,
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/recruiters/jobs', {
        ...form,
        openings: parseInt(form.openings),
        deadline: form.deadline || undefined,
      });
      toast.success('Job posted successfully!');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/recruiter/jobs')} style={{ marginBottom: '1.5rem' }}>
        ← Back to Jobs
      </button>
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Fill in the details below to attract the best candidates</p>
      </div>

      <div style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          {/* Basic details */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Job Details</h2>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input id="job-title" className="form-input" placeholder="e.g. Frontend Developer Intern" value={form.title} onChange={set('title')} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select id="job-type" className="form-select" value={form.type} onChange={set('type')}>
                  <option value="full-time">Full-Time</option>
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-Time</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input id="job-location" className="form-input" placeholder="Bangalore / Remote" value={form.location} onChange={set('location')} />
              </div>
              <div className="form-group">
                <label className="form-label">Openings</label>
                <input id="job-openings" type="number" min="1" className="form-input" value={form.openings} onChange={set('openings')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Salary / Stipend</label>
                <input id="job-salary" className="form-input" placeholder="e.g. ₹8-12 LPA or ₹25,000/mo" value={form.salary} onChange={set('salary')} />
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input id="job-deadline" type="date" className="form-input" value={form.deadline} onChange={set('deadline')} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Description *</h2>
            <div className="form-group">
              <textarea
                id="job-description"
                className="form-textarea"
                placeholder="Describe the role, responsibilities, what a typical day looks like, and what the candidate will learn or achieve…"
                value={form.description}
                onChange={set('description')}
                required
                maxLength={5000}
                style={{ minHeight: 180 }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{form.description.length}/5000</div>
            </div>
          </div>

          {/* Requirements & Skills */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Requirements & Skills</h2>
            <div className="form-group">
              <label className="form-label">Requirements (press Enter after each)</label>
              <TagInput value={form.requirements} onChange={v => setForm(f => ({ ...f, requirements: v }))} placeholder="e.g. Bachelor's degree in CS…" />
            </div>
            <div className="form-group">
              <label className="form-label">Required Skills (press Enter after each)</label>
              <TagInput value={form.skillsRequired} onChange={v => setForm(f => ({ ...f, skillsRequired: v }))} placeholder="e.g. React, Node.js, SQL…" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/recruiter/jobs')}>Cancel</button>
            <button id="post-job-btn" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm" /> Posting…</> : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
