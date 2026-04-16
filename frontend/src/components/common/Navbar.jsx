import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from './Toast';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('See you soon!');
    navigate('/login');
  };

  if (!user) return null;

  const roleColors = {
    student:   '#6C63FF',
    recruiter: '#10B981',
    admin:     '#F59E0B',
  };

  const getProfileLink = () => {
    if (user.role === 'student') return '/student/profile';
    if (user.role === 'recruiter') return '/recruiter/company';
    return '/admin';
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile hamburger */}
        <button
          className="btn btn-ghost btn-sm mobile-menu-btn"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <span className="navbar-welcome" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          👋 Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user.name?.split(' ')[0]}</strong>
        </span>
      </div>
      <div className="navbar-right">
        <div
          style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            background: `${roleColors[user.role]}22`,
            color: roleColors[user.role],
            border: `1px solid ${roleColors[user.role]}44`,
          }}
        >
          {user.role}
        </div>
        
        <div className="dropdown-container">
          <div className="user-chip" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">{user.name?.charAt(0) || '?'}</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>▼</span>
          </div>

          {dropdownOpen && (
            <>
              {/* Invisible overlay to close dropdown when clicking outside */}
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 900 }} 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="dropdown-menu" style={{ zIndex: 1000 }}>
                <div style={{ padding: '0.5rem 1rem', marginBottom: '0.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                </div>
                <div className="dropdown-divider"></div>
                <div 
                  className="dropdown-item" 
                  onClick={() => { navigate(getProfileLink()); setDropdownOpen(false); }}
                >
                  👤 My Profile
                </div>
                <div 
                  className="dropdown-item" 
                  onClick={() => { toast.info('Settings coming soon!'); setDropdownOpen(false); }}
                >
                  ⚙️ Settings
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item danger" onClick={handleLogout}>
                  🚪 Logout
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
