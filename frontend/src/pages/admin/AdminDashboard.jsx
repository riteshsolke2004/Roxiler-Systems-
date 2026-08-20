import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import { useAuth } from '../../context/AuthContext';
import {
  Users, Store, Star, UserPlus, PlusCircle, ArrowRight, TrendingUp, Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = stats ? [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <Users size={24} />,
      iconClass: 'stat-icon-blue',
      trend: '+12% this month',
      trendUp: true,
    },
    {
      label: 'Total Stores',
      value: stats.totalStores,
      icon: <Store size={24} />,
      iconClass: 'stat-icon-gold',
      trend: '+3 new stores',
      trendUp: true,
    },
    {
      label: 'Total Ratings',
      value: stats.totalRatings,
      icon: <Star size={24} />,
      iconClass: 'stat-icon-pink',
      trend: 'Active community',
      trendUp: true,
    },
  ] : [];

  const quickActions = [
    {
      icon: <UserPlus size={22} color="var(--primary)" />,
      title: 'Add New User',
      desc: 'Register Normal Users, Store Owners, or Administrators.',
      to: '/admin/users/new',
      btnLabel: 'Create User',
      accentBg: 'hsla(252,87%,67%,0.1)',
      accentBorder: 'hsla(252,87%,67%,0.25)',
    },
    {
      icon: <PlusCircle size={22} color="var(--accent)" />,
      title: 'Add New Store',
      desc: 'Register a new business store and assign it to a Store Owner.',
      to: '/admin/stores/new',
      btnLabel: 'Create Store',
      accentBg: 'hsla(186,100%,53%,0.08)',
      accentBorder: 'hsla(186,100%,53%,0.2)',
    },
    {
      icon: <Users size={22} color="var(--pink)" />,
      title: 'User Management',
      desc: 'View all platform users with multi-field search and sort.',
      to: '/admin/users',
      btnLabel: 'View Users',
      accentBg: 'hsla(328,85%,65%,0.08)',
      accentBorder: 'hsla(328,85%,65%,0.2)',
    },
    {
      icon: <Store size={22} color="var(--gold)" />,
      title: 'Store Management',
      desc: 'Browse all stores with overall ratings and sorting controls.',
      to: '/admin/stores',
      btnLabel: 'View Stores',
      accentBg: 'hsla(43,96%,56%,0.08)',
      accentBorder: 'hsla(43,96%,56%,0.2)',
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s var(--ease-out) both' }}>
      {/* Greeting Banner */}
      <div style={{
        background: 'linear-gradient(135deg, hsla(252,87%,67%,0.15) 0%, hsla(328,85%,65%,0.08) 100%)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-40px', top: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(252,87%,67%,0.12) 0%, transparent 70%)',
        }} />
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>
            {greeting()},
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Here's your platform overview for today.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
        }}>
          <Activity size={14} color="var(--success)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--success)' }}>
            System Online
          </span>
        </div>
      </div>

      <AlertMessage type="error" message={error} />

      {/* Stats Grid */}
      {stats && (
        <div
          className="stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {statCards.map((sc, i) => (
            <div key={i} className="stat-card animate-fadeInUp">
              <div className={`stat-icon ${sc.iconClass}`}>{sc.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="stat-label">{sc.label}</div>
                <div className="stat-value">{sc.value}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  marginTop: '0.4rem',
                }}>
                  <TrendingUp size={11} color="var(--success)" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 500 }}>
                    {sc.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section Heading */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 className="section-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Quick Actions
        </h2>
      </div>

      {/* Quick Actions Grid */}
      <div
        className="stagger"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {quickActions.map((action, i) => (
          <div key={i} className="card animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              width: '44px', height: '44px',
              background: action.accentBg,
              border: `1px solid ${action.accentBorder}`,
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {action.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {action.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {action.desc}
              </p>
            </div>
            <Link
              to={action.to}
              className="btn btn-secondary btn-sm"
              style={{ width: 'fit-content', gap: '0.4rem' }}
            >
              <span>{action.btnLabel}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
