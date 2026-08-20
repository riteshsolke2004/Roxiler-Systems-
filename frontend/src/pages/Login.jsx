import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext';
import api from '../api/axios';
import AlertMessage from '../components/AlertMessage';
import {
  Store, LogIn, Lock, Mail, ShieldCheck, Star, Users, TrendingUp, Sparkles
} from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('NORMAL_USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user, token } = res.data.data;

        if (user.role !== selectedRole) {
          const roleLabels = {
            SYSTEM_ADMIN: 'Admin',
            NORMAL_USER: 'Normal User',
            STORE_OWNER: 'Store Owner',
          };
          setError(
            `Access Denied: You selected "${roleLabels[selectedRole]}", but your account is registered as "${roleLabels[user.role]}". Please select the correct login role.`
          );
          setLoading(false);
          return;
        }

        login(user, token);
        navigate(getDashboardPath(user.role), { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your email and password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'NORMAL_USER', label: 'Normal User', sub: 'Customer / Reviewer', icon: '👤' },
    { value: 'STORE_OWNER', label: 'Store Owner', sub: 'Business Representative', icon: '🏪' },
    { value: 'SYSTEM_ADMIN', label: 'Administrator', sub: 'System Control Panel', icon: '⚡' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-15%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(252,87%,67%,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(186,100%,53%,0.1) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '30%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(328,85%,65%,0.08) 0%, transparent 70%)',
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.4,
        }} />
      </div>

      {/* Left Panel — Hero / Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 4rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'var(--grad-primary)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px var(--primary-glow)',
          }}>
            <Store size={22} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem', fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            StoreRating<span style={{
              background: 'var(--grad-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Hub</span>
          </span>
        </div>

        {/* Hero text */}
        <div style={{ animation: 'fadeInUp 0.6s var(--ease-out) both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            background: 'hsla(252,87%,67%,0.15)',
            border: '1px solid hsla(252,87%,67%,0.3)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem',
          }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              ROLE-BASED PLATFORM
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: 'var(--text-primary)' }}>Rate & Discover</span>
            <br />
            <span style={{
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Amazing Stores
            </span>
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '380px',
            marginBottom: '3rem',
          }}>
            The trusted platform for community store ratings, real-time analytics, and performance insights across all store categories.
          </p>

          {/* Feature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { icon: <Star size={16} color="var(--gold)" />, text: 'Rate stores from 1 to 5 stars with live averages', bg: 'hsla(43,96%,56%,0.1)', border: 'hsla(43,96%,56%,0.25)' },
              { icon: <Users size={16} color="var(--accent)" />, text: 'Multi-role access for users, owners & admins', bg: 'hsla(186,100%,53%,0.1)', border: 'hsla(186,100%,53%,0.25)' },
              { icon: <TrendingUp size={16} color="var(--pink)" />, text: 'Real-time performance insights for store owners', bg: 'hsla(328,85%,65%,0.1)', border: 'hsla(328,85%,65%,0.25)' },
            ].map((feat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.75rem 1rem',
                background: feat.bg,
                border: `1px solid ${feat.border}`,
                borderRadius: 'var(--radius-md)',
                animation: `fadeInUp 0.6s var(--ease-out) ${(i + 1) * 100}ms both`,
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: feat.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {feat.icon}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {feat.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: '460px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
      }}>
        <div style={{
          width: '100%',
          background: 'hsla(228,20%,10%,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid var(--border-strong)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2.5rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px hsla(252,87%,67%,0.06)',
          animation: 'fadeIn 0.5s var(--ease-out) both',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.4rem',
              letterSpacing: '-0.02em',
            }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sign in to your dashboard to continue
            </p>
          </div>

          <AlertMessage type="error" message={error} />

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.6rem',
              }}>
                Account Role
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {roleOptions.map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${selectedRole === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: selectedRole === opt.value
                        ? 'hsla(252,87%,67%,0.12)'
                        : 'var(--bg-input)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={selectedRole === opt.value}
                      onChange={(e) => { setSelectedRole(e.target.value); setError(''); }}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{opt.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: selectedRole === opt.value ? 'var(--primary)' : 'var(--text-secondary)',
                      }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {opt.sub}
                      </div>
                    </div>
                    <div style={{
                      width: '16px', height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${selectedRole === opt.value ? 'var(--primary)' : 'var(--border-strong)'}`,
                      background: selectedRole === opt.value ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'var(--transition)',
                      flexShrink: 0,
                    }}>
                      {selectedRole === opt.value && (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="login-email"
                  style={{ paddingLeft: '2.6rem' }}
                />
                <Mail size={16} style={{
                  position: 'absolute', left: '0.85rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <Lock size={16} style={{
                  position: 'absolute', left: '0.85rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }} />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 600,
                    padding: '2px 4px',
                  }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              id="login-submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.925rem',
                marginTop: '0.5rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', flexShrink: 0 }} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Register as Normal User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
