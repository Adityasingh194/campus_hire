import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentBrowserPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (search) params.append('search', search);
      if (minCgpa) params.append('minCgpa', minCgpa);
      const { data } = await api.get(`/recruiters/students?${params}`);
      setStudents(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  return (
    <div className="page-container--wide">
      <div className="page-header">
        <h1>Browse Students</h1>
        <p>Find and connect with talented students for your openings</p>
      </div>

      {/* Filters */}
      <form
        className="search-bar"
        onSubmit={(e) => { e.preventDefault(); fetchStudents(); }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="student-search"
            type="text"
            className="search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <input
          id="min-cgpa"
          type="number"
          step="0.1"
          min="0"
          max="10"
          className="form-input"
          style={{ width: 160 }}
          placeholder="Min CGPA"
          value={minCgpa}
          onChange={e => setMinCgpa(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Filter</button>
        {(search || minCgpa) && (
          <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); setMinCgpa(''); }}>
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <h3>No students found</h3>
          <p>Try adjusting your search filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {students.map((student, i) => (
            <div
              key={student._id}
              className="card"
              style={{ animation: `slideUp 0.4s ${i * 0.05}s both`, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === student._id ? null : student._id)}
            >
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', fontSize: '1.1rem', flexShrink: 0,
                  }}
                >
                  {student.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{student.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{student.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {student.profile?.cgpa && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', background: 'rgba(108,99,255,0.12)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                    🎓 CGPA {student.profile.cgpa}
                  </span>
                )}
                {student.phone && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>📞 {student.phone}</span>
                )}
              </div>

              {student.profile?.skills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {student.profile.skills.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  {student.profile.skills.length > 5 && (
                    <span className="skill-tag" style={{ opacity: 0.6 }}>+{student.profile.skills.length - 5}</span>
                  )}
                </div>
              )}

              {/* Expanded view */}
              {expanded === student._id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {student.profile?.bio && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Bio</div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{student.profile.bio}</p>
                    </div>
                  )}
                  {student.profile?.education?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Education</div>
                      {student.profile.education.map((edu, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          🎓 {edu.degree} in {edu.fieldOfStudy} · {edu.institution} ({edu.startYear}–{edu.endYear})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {expanded === student._id ? 'Click to collapse ▲' : 'Click to expand ▼'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentBrowserPage;
