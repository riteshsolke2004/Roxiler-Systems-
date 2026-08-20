import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StarDisplay from '../../components/StarDisplay';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import { Store, Star, Users, MapPin, Mail, ArrowRight, TrendingUp, MessageSquare } from 'lucide-react';

const StoreOwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/store-owner/dashboard');
        if (res.data.success) setDashboard(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch store dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader text="Loading store performance..." />;

  const getRatingColor = (r) => {
    if (r >= 4.5) return 'var(--success)';
    if (r >= 3.5) return 'var(--gold)';
    if (r >= 2.5) return 'var(--warning)';
    return 'var(--error)';
  };

  const getRatingLabel = (r) => {
    if (!r) return 'No ratings yet';
    if (r >= 4.5) return 'Excellent';
    if (r >= 3.5) return 'Very Good';
    if (r >= 2.5) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s var(--ease-out) both' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Store <span style={{
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Dashboard</span>
          </h1>
          <p className="page-subtitle">Monitor customer reviews and store performance</p>
        </div>
      </div>

      <AlertMessage type="error" message={error} />

      {dashboard && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Rating Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, hsla(43,96%,56%,0.15) 0%, hsla(252,87%,67%,0.1) 100%)',
            border: '1.5px solid hsla(43,96%,56%,0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: '-30px', top: '-30px',
              width: '160px', height: '160px', borderRadius: '50%',
              background: 'radial-gradient(circle, hsla(43,96%,56%,0.15) 0%, transparent 70%)',
            }} />
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem', fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: '0.5rem',
              }}>
                {dashboard.store.name}
              </h2>
              <StarDisplay rating={dashboard.store.averageRating} totalRatings={dashboard.store.totalRatings} size={20} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3.5rem', fontWeight: 700, lineHeight: 1,
                color: getRatingColor(dashboard.store.averageRating),
              }}>
                {dashboard.store.averageRating ? dashboard.store.averageRating.toFixed(1) : '—'}
              </div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: getRatingColor(dashboard.store.averageRating),
                marginTop: '0.25rem',
              }}>
                {getRatingLabel(dashboard.store.averageRating)}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stagger" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            <div className="stat-card animate-fadeInUp">
              <div className="stat-icon stat-icon-gold">
                <Star size={22} />
              </div>
              <div>
                <div className="stat-label">Average Rating</div>
                <div className="stat-value">
                  {dashboard.store.averageRating ? dashboard.store.averageRating.toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
            <div className="stat-card animate-fadeInUp">
              <div className="stat-icon stat-icon-blue">
                <Users size={22} />
              </div>
              <div>
                <div className="stat-label">Total Ratings</div>
                <div className="stat-value">{dashboard.store.totalRatings}</div>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px', height: '38px',
                background: 'var(--grad-primary)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Store size={18} color="#fff" />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Store Information
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{
                padding: '0.85rem',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Mail size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Contact Email
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {dashboard.store.email}
                </p>
              </div>

              <div style={{
                padding: '0.85rem',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                gridColumn: '1 / -1',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <MapPin size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    Address
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {dashboard.store.address}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MessageSquare size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Recent Customer Reviews
                </h3>
              </div>
              <Link to="/owner/ratings" className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {dashboard.ratings.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <div className="empty-state-icon" style={{ width: '52px', height: '52px' }}>
                  <Star size={22} />
                </div>
                <p style={{ fontSize: '0.875rem' }}>No customer ratings yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashboard.ratings.slice(0, 4).map((item) => (
                  <div key={item.ratingId} className="review-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar">
                        {item.userName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.userName}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(item.ratingDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <StarDisplay rating={item.rating} size={16} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
