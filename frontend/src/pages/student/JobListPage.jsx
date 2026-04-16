import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const JobListPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', type: '', page: 1 });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      params.append('page', filters.page);
      params.append('limit', 9);
      const { data } = await api.get(`/students/jobs?${params}`);
      setJobs(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
  };

  return (
    <div className="page-container--wide">
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p>Explore {pagination.total} active opportunities from approved companies</p>
      </div>

      {/* Search / Filter */}
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="job-search"
            type="text"
            className="search-input"
            placeholder="Search by title or description…"
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <select
          id="job-type-filter"
          className="form-select"
          style={{ width: 180 }}
          value={filters.type}
          onChange={(e) => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}
        >
          <option value="">All Types</option>
          <option value="full-time">Full-Time</option>
          <option value="internship">Internship</option>
          <option value="part-time">Part-Time</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
        {(filters.search || filters.type) && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setFilters({ search: '', type: '', page: 1 })}
          >
            Clear
          </button>
        )}
      </form>

      {/* Jobs grid */}
      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters or check back later for new postings.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {jobs.map((job, i) => (
            <div
              key={job._id}
              className="job-card"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(`/student/jobs/${job._id}`)}
            >
              <div className="job-card-header">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div className="company-logo-placeholder" style={{ width: 42, height: 42, fontSize: '1rem' }}>
                      {job.company?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{job.company?.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{job.company?.industry}</div>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>{job.title}</h3>
                </div>
                <Badge type={job.type} />
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {job.description}
              </p>

              <div className="job-card-meta">
                {job.location && <span className="meta-item">📍 {job.location}</span>}
                {job.salary && <span className="meta-item">💰 {job.salary}</span>}
                {job.openings && <span className="meta-item">👥 {job.openings} opening{job.openings > 1 ? 's' : ''}</span>}
                {job.deadline && (
                  <span className="meta-item" style={{ color: new Date(job.deadline) < new Date() ? 'var(--accent-rose)' : '' }}>
                    ⏰ {new Date(job.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              {job.skillsRequired?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.875rem' }}>
                  {job.skillsRequired.slice(0, 4).map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                  {job.skillsRequired.length > 4 && (
                    <span className="skill-tag" style={{ opacity: 0.6 }}>+{job.skillsRequired.length - 4}</span>
                  )}
                </div>
              )}

              <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <span className="btn btn-primary btn-sm">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={pagination.page <= 1}
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
          >‹</button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`pagination-btn${pagination.page === p ? ' active' : ''}`}
              onClick={() => setFilters(f => ({ ...f, page: p }))}
            >{p}</button>
          ))}
          <button
            className="pagination-btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
          >›</button>
        </div>
      )}
    </div>
  );
};

export default JobListPage;
