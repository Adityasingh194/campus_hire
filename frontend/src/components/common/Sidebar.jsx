import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from './Toast';

const navConfig = {
  student: [
    { to: '/student',              icon: '🏠', label: 'Dashboard' },
    { to: '/student/jobs',         icon: '🔍', label: 'Browse Jobs' },
    { to: '/student/applications', icon: '📋', label: 'My Applications' },
    { to: '/student/profile',      icon: '👤', label: 'My Profile' },
  ],
  recruiter: [
    { to: '/recruiter',             icon: '🏠', label: 'Dashboard' },
    { to: '/recruiter/company',     icon: '🏢', label: 'My Company' },
    { to: '/recruiter/jobs',        icon: '💼', label: 'My Jobs' },
    { to: '/recruiter/jobs/new',    icon: '➕', label: 'Post a Job' },
    { to: '/recruiter/students',    icon: '🎓', label: 'Browse Students' },
  ],
  admin: [
    { to: '/admin',                 icon: '📊', label: 'Dashboard' },
    { to: '/admin/companies',       icon: '🏢', label: 'Companies' },
    { to: '/admin/applications',    icon: '📋', label: 'Applications' },
    { to: '/admin/users',           icon: '👥', label: 'Users' },
  ],
};

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = navConfig[user.role] || [];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleBadge = {
    student:   { label: 'Student',   color: '#6C63FF' },
    recruiter: { label: 'Recruiter', color: '#10B981' },
    admin:     { label: 'Admin',     color: '#F59E0B' },
  }[user.role] || {};

  return (
    <>
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199, backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">C</div>
          <span className="sidebar-logo-text">CampusHire</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-section">
          <div className="sidebar-section-title">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${user.role}`}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.75rem',
            }}
          >
            <div className="user-avatar">{user.name?.charAt(0) || '?'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.8rem', fontWeight: 700,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: roleBadge.color,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {roleBadge.label}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
