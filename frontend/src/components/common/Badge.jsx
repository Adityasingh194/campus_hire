const Badge = ({ status, type }) => {
  const value = status || type || '';
  const map = {
    pending:     'badge-pending',
    shortlisted: 'badge-shortlisted',
    accepted:    'badge-accepted',
    rejected:    'badge-rejected',
    active:      'badge-active',
    inactive:    'badge-inactive',
    approved:    'badge-approved',
    'full-time': 'badge-full-time',
    internship:  'badge-internship',
    'part-time': 'badge-part-time',
  };

  const icons = {
    pending:     '⏳',
    shortlisted: '⭐',
    accepted:    '✅',
    rejected:    '❌',
    active:      '🟢',
    inactive:    '⚫',
    approved:    '✅',
    'full-time': '💼',
    internship:  '🎓',
    'part-time': '⏰',
  };

  const cls = map[value.toLowerCase()] || 'badge-pending';
  return (
    <span className={`badge ${cls}`}>
      {icons[value.toLowerCase()] || ''} {value.replace(/-/g, ' ')}
    </span>
  );
};

export default Badge;
