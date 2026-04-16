const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="spinner-wrapper">
      <div className={`spinner${size === 'sm' ? ' spinner-sm' : ''}`} />
    </div>
  );
};

export default LoadingSpinner;
