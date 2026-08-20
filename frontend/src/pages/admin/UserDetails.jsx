import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import StarDisplay from '../../components/StarDisplay';
import { ArrowLeft, User, Mail, MapPin, Shield, Store } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Loader text="Loading user details..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Details</h1>
          <p className="page-subtitle">Detailed account profile and associated business store information</p>
        </div>
        <Link to="/admin/users" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Back to Users</span>
        </Link>
      </div>

      <AlertMessage type="error" message={error} />

      {user && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          {/* Main User Profile Card */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  padding: '0.85rem',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <User size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user.name}</h3>
                <span className={`badge ${
                  user.role === 'SYSTEM_ADMIN'
                    ? 'badge-admin'
                    : user.role === 'STORE_OWNER'
                    ? 'badge-owner'
                    : 'badge-user'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} /> Email Address
                </span>
                <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{user.email}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={14} /> Access Role
                </span>
                <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{user.role}</p>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} /> Physical Address
                </span>
                <p style={{ fontWeight: 500, marginTop: '0.2rem' }}>{user.address}</p>
              </div>
            </div>
          </div>

          {/* Store Owner Specific Information */}
          {user.role === 'STORE_OWNER' && (
            <div className="card" style={{ borderColor: 'var(--border-focus)', backgroundColor: '#faf5ff' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  color: 'var(--primary)',
                }}
              >
                <Store size={24} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Associated Store Information</h3>
              </div>

              {user.store ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Store Name</span>
                    <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{user.store.name}</p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Store Email</span>
                    <p style={{ fontWeight: 600 }}>{user.store.email}</p>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Store Address</span>
                    <p style={{ fontWeight: 500 }}>{user.store.address}</p>
                  </div>

                  <div
                    style={{
                      gridColumn: '1 / -1',
                      padding: '1rem',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Overall Average Rating
                      </span>
                      <div style={{ marginTop: '0.25rem' }}>
                        <StarDisplay rating={user.store.averageRating} totalRatings={user.store.totalRatings} size={22} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No store currently assigned to this Store Owner account.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
