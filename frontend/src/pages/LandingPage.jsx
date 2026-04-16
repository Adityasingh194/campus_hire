import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const map = { student: '/student', recruiter: '/recruiter', admin: '/admin' };
      navigate(map[user.role] || '/login', { replace: true });
    }
  }, [user, navigate]);

  const features = [
    { icon: '🎓', title: 'For Students', desc: 'Browse hundreds of internships and full-time opportunities from top companies visiting campus.' },
    { icon: '🏢', title: 'For Recruiters', desc: 'Post jobs, manage applicants, and find the best talent with advanced filters and profiles.' },
    { icon: '📊', title: 'For Admins', desc: 'Approve companies, track placement metrics, and get real-time analytics on campus hiring.' },
  ];

  const stats = [
    { val: '500+', label: 'Students Placed' },
    { val: '120+', label: 'Partner Companies' },
    { val: '95%', label: 'Placement Rate' },
    { val: '48h', label: 'Avg. Response Time' },
  ];

  return (
    <div className="landing-hero">
      {/* Background orbs */}
      <div className="hero-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Nav */}
      <nav
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(6,11,24,0.7)',
          backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 900, color: '#fff',
            }}
          >C</div>
          <span
            style={{
              fontSize: '1.2rem', fontWeight: 800,
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CampusHire
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(108,99,255,0.12)',
            border: '1px solid rgba(108,99,255,0.3)',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)',
            marginBottom: '1.5rem',
            animation: 'slideDown 0.6s forwards',
          }}
        >
          🚀 Trusted by 100+ colleges nationwide
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            maxWidth: '800px',
            animation: 'slideUp 0.8s 0.1s both',
          }}
        >
          Your Campus,{' '}
          <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Your Career
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem', color: 'var(--text-secondary)',
            maxWidth: '600px', lineHeight: 1.8,
            marginBottom: '2.5rem',
            animation: 'slideUp 0.8s 0.2s both',
          }}
        >
          The all-in-one campus placement portal connecting students with world-class recruiters.
          Apply, track, get placed — all in one place.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.8s 0.3s both' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            🎯 Start Your Journey
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In →
          </Link>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
            justifyContent: 'center', marginTop: '4rem',
            animation: 'slideUp 0.8s 0.4s both',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2rem', fontWeight: 900,
                  background: 'var(--grad-primary)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section
        style={{
          padding: '4rem 2rem',
          borderTop: '1px solid var(--border-subtle)',
          position: 'relative', zIndex: 1,
          background: 'rgba(13,20,38,0.5)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center', fontSize: '1.75rem', fontWeight: 800,
              marginBottom: '0.5rem',
            }}
          >
            Built for Everyone on Campus
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Three dedicated portals, one unified platform.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card"
                style={{ animation: `slideUp 0.6s ${0.1 * i}s both` }}
              >
                <div
                  style={{
                    fontSize: '2.5rem', marginBottom: '1rem',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 60, height: 60, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          position: 'relative', zIndex: 1,
        }}
      >
        © 2025 CampusHire. Built for campuses that care about careers.
      </footer>
    </div>
  );
};

export default LandingPage;
