import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (roleFilter) params.append('role', roleFilter);
      if (search) params.append('search', search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(1); }, [roleFilter]);

  const roleColors = {
    student:   { bg: 'rgba(108,99,255,0.15)', color: '#6C63FF' },
    recruiter: { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
    admin:     { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  };

  return (
    <div className="page-container--wide">
      <div className="page-header">
        <h1>All Users</h1>
        <p>Manage all registered users across the platform</p>
      </div>

      {/* Tabs + search */}
      <div className="tabs">
        {[{ val: '', label: 'All' }, { val: 'student', label: '🎓 Students' }, { val: 'recruiter', label: '🏢 Recruiters' }, { val: 'admin', label: '🛡 Admins' }].map(t => (
          <button key={t.val} className={`tab${roleFilter === t.val ? ' active' : ''}`} onClick={() => setRoleFilter(t.val)}>
            {t.label}
          </button>
        ))}
      </div>

      <form className="search-bar" onSubmit={(e) => { e.preventDefault(); fetchUsers(1); }} style={{ marginBottom: '1.25rem' }}>
        <div className="search-input-wrapper" style={{ maxWidth: 400 }}>
          <span className="search-icon">🔍</span>
          <input
            id="user-search"
            type="text"
            className="search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
        {search && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); fetchUsers(1); }}>Clear</button>}
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No users found</h3>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            {pagination.total} user{pagination.total !== 1 ? 's' : ''} found
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const rc = roleColors[user.role] || {};
                  return (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: rc.color ? `${rc.color}33` : 'var(--bg-glass)', border: `2px solid ${rc.color || 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: rc.color || 'var(--text-primary)', fontSize: '0.9rem', flexShrink: 0 }}>
                            {user.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, background: rc.bg, color: rc.color, textTransform: 'capitalize' }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.phone || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {user.company ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {user.company.name}
                            {user.company.isApproved &&
                              <span style={{ fontSize: '0.7rem', color: '#10B981' }}>✅</span>
                            }
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" disabled={pagination.page <= 1} onClick={() => fetchUsers(pagination.page - 1)}>‹</button>
              {Array.from({ length: Math.min(pagination.pages, 8) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`pagination-btn${pagination.page === p ? ' active' : ''}`} onClick={() => fetchUsers(p)}>{p}</button>
              ))}
              <button className="pagination-btn" disabled={pagination.page >= pagination.pages} onClick={() => fetchUsers(pagination.page + 1)}>›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
