import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TagInput = ({ value = [], onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().replace(/,$/, '');
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInput('');
    }
  };

  const removeTag = (tag) => onChange(value.filter(t => t !== tag));

  return (
    <div className="tag-input-container">
      {value.map(tag => (
        <span key={tag} className="tag-item">
          {tag}
          <button className="tag-remove" type="button" onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}
      <input
        className="tag-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder={value.length === 0 ? placeholder || 'Type and press Enter…' : ''}
      />
    </div>
  );
};

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', bio: '', skills: [],
    cgpa: '', education: [], experience: [],
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        cgpa: user.profile?.cgpa || '',
        education: user.profile?.education || [],
        experience: user.profile?.experience || [],
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/students/profile', {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        skills: form.skills,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : undefined,
        education: form.education,
        experience: form.experience,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed.'); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await api.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addEducation = () =>
    setForm(f => ({ ...f, education: [...f.education, { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }] }));

  const removeEducation = (i) =>
    setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  const updateEdu = (i, field, val) =>
    setForm(f => ({ ...f, education: f.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  if (!user) return <LoadingSpinner />;

  const completeness = [form.name, form.bio, form.skills.length, form.cgpa, form.education.length].filter(Boolean).length;
  const pct = Math.round((completeness / 5) * 100);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Keep your profile updated to attract the best opportunities</p>
      </div>

      {/* Profile completeness bar */}
      <div className="card--flat" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Profile Completeness</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: pct >= 80 ? 'var(--accent-emerald)' : 'var(--accent-primary)' }}>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--border-subtle)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 4,
              background: pct >= 80 ? 'var(--grad-emerald)' : 'var(--grad-primary)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <form onSubmit={handleSave}>
          {/* Basic info */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Basic Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="prof-name" className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input id="prof-phone" className="form-input" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label className="form-label">CGPA (out of 10)</label>
              <input id="prof-cgpa" type="number" step="0.01" min="0" max="10" className="form-input" placeholder="e.g. 8.5" value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value }))} />
            </div>
          </div>

          {/* Bio */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Bio</h2>
            <div className="form-group">
              <label className="form-label">About Me</label>
              <textarea
                id="prof-bio"
                className="form-textarea"
                placeholder="Write a short bio that highlights your interests and career goals…"
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                maxLength={500}
                style={{ minHeight: 110 }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{form.bio.length}/500</div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Skills</h2>
            <div className="form-group">
              <label className="form-label">Add Skills (press Enter after each)</label>
              <TagInput value={form.skills} onChange={skills => setForm(f => ({ ...f, skills }))} placeholder="e.g. React, Python, SQL…" />
            </div>
          </div>

          {/* Education */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Education</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addEducation}>+ Add</button>
            </div>
            {form.education.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                No education entries. Click "+ Add" to add one.
              </p>
            )}
            {form.education.map((edu, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label">Institution</label>
                    <input className="form-input" value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="University name" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label">Degree</label>
                    <input className="form-input" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="B.Tech, B.Sc, etc." />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label">Field of Study</label>
                    <input className="form-input" value={edu.fieldOfStudy} onChange={e => updateEdu(i, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Start</label>
                      <input type="number" className="form-input" value={edu.startYear} onChange={e => updateEdu(i, 'startYear', e.target.value)} placeholder="2020" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">End</label>
                      <input type="number" className="form-input" value={edu.endYear} onChange={e => updateEdu(i, 'endYear', e.target.value)} placeholder="2024" />
                    </div>
                  </div>
                </div>
                <button type="button" className="btn btn-rose btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => removeEducation(i)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button id="save-profile-btn" type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><span className="spinner spinner-sm" /> Saving…</> : '💾 Save Profile'}
          </button>
        </form>

        {/* Resume upload */}
        <div>
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Resume</h2>
            {user.profile?.resumePath ? (
              <div style={{ marginBottom: '1rem' }}>
                <div className="alert alert-success">✅ Resume uploaded</div>
                <a
                  href={`/uploads/${user.profile.resumePath.split('\\').pop()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  📄 View Resume
                </a>
              </div>
            ) : (
              <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
                Upload your resume to apply to jobs.
              </div>
            )}
            <label
              htmlFor="resume-upload"
              className={`btn btn-primary${uploading ? ' btn-sm' : ''}`}
              style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
            >
              {uploading ? <><span className="spinner spinner-sm" /> Uploading…</> : '📤 Upload PDF Resume'}
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleResumeUpload}
              disabled={uploading}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              PDF format only · Max 10MB
            </p>
          </div>

          {/* Account info */}
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Account Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Member since</span>
                <span style={{ fontWeight: 500 }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
