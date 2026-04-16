import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const COLORS = ['#6C63FF', '#10B981', '#F59E0B', '#F43F5E', '#38BDF8'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  const { overview, applicationsByStatus, jobsByType, topCompanies, monthlyTrend } = stats;

  const statCards = [
    { icon: '🎓', label: 'Total Students',   value: overview.totalStudents,    color: '#6C63FF' },
    { icon: '🏢', label: 'Companies',         value: overview.totalCompanies,   color: '#10B981' },
    { icon: '💼', label: 'Active Jobs',       value: overview.activeJobs,       color: '#F59E0B' },
    { icon: '📋', label: 'Applications',      value: overview.totalApplications, color: '#38BDF8' },
    { icon: '👔', label: 'Recruiters',        value: overview.totalRecruiters,  color: '#8B5CF6' },
    { icon: '⏳', label: 'Pending Companies', value: overview.pendingCompanies, color: '#F43F5E' },
    { icon: '✅', label: 'Approved Companies', value: overview.approvedCompanies, color: '#10B981' },
    { icon: '📈', label: 'Placement Rate',    value: overview.placementRate,    color: '#6C63FF' },
  ];

  const statusChartData = applicationsByStatus.map(s => ({
    name: s._id,
    value: s.count,
  }));

  const jobTypeData = jobsByType.map(j => ({
    name: j._id?.replace('-', ' '),
    jobs: j.count,
  }));

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const trendData = monthlyTrend.map(m => ({
    name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
    applications: m.count,
  }));

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container--wide">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Platform overview and placement metrics</p>
      </div>

      {/* Stat grid */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {statCards.map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animation: `slideUp 0.4s ${i * 0.06}s both` }}>
            <div className="stat-card__icon" style={{ background: `${s.color}22` }}>{s.icon}</div>
            <div className="stat-card__value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__glow" style={{ background: s.color }} />
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Applications by Status - Pie */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Applications by Status</h2>
          {statusChartData.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}><div className="empty-state-icon">📊</div><p>No data yet.</p></div>
          ) : (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <PieChart width={200} height={260}>
                <Pie data={statusChartData} cx={90} cy={120} innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={customTooltip} />
              </PieChart>
              <div style={{ flex: 1 }}>
                {statusChartData.map((s, i) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', flex: 1 }}>{s.name}</span>
                    <span style={{ fontWeight: 700 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jobs by Type - Bar */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Jobs by Type</h2>
          {jobTypeData.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}><div className="empty-state-icon">💼</div><p>No jobs posted yet.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={jobTypeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="jobs" fill="#6C63FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Applications trend */}
      {trendData.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Monthly Applications Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Line type="monotone" dataKey="applications" stroke="#6C63FF" strokeWidth={3} dot={{ fill: '#6C63FF', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top companies */}
      {topCompanies.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Companies by Applications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topCompanies.slice(0, 8).map((company, i) => {
              const maxCount = topCompanies[0].applicationCount;
              const pct = (company.applicationCount / maxCount) * 100;
              return (
                <div key={company._id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', width: 20, textAlign: 'right', flexShrink: 0 }}>#{i+1}</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, width: 180, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {company.name}
                  </div>
                  <div style={{ flex: 1, height: 8, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--grad-primary)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, width: 40, textAlign: 'right', color: 'var(--accent-primary)', flexShrink: 0 }}>
                    {company.applicationCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
