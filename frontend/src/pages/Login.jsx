import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import AlertMessage from '../components/AlertMessage';
import {
  Store, LogIn, Lock, Mail, Star, Users, TrendingUp, Sparkles, Sun, Moon
} from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('NORMAL_USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      flexDirection: 'column',
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Bar with Home link & Theme Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2.5rem',
        zIndex: 10,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--grad-primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px var(--primary-glow)',
          }}>
            <Store size={18} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem', fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            StoreRating<span style={{
              background: 'var(--grad-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Hub</span>
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} color="var(--gold)" /> : <Moon size={17} color="var(--primary)" />}
        </button>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 2rem 3rem',
        zIndex: 1,
        flexWrap: 'wrap',
        gap: '3rem',
      }}>
        {/* Left Panel — Hero / Branding */}
        <div style={{
          flex: '1 1 380px',
          maxWidth: '480px',
        }} className="animate-fadeInUp">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            background: 'hsla(252,87%,67%,0.12)',
            border: '1px solid hsla(252,87%,67%,0.25)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem',
          }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              ROLE-BASED PLATFORM
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            Rate & Discover<br />
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
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '2rem',
          }}>
            The trusted platform for community store ratings, real-time analytics, and transparent customer insights.
          </p>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: <Star size={16} color="var(--gold)" />, text: 'Rate stores from 1 to 5 stars with live averages' },
              { icon: <Users size={16} color="var(--accent)" />, text: 'Multi-role access for users, owners & admins' },
              { icon: <TrendingUp size={16} color="var(--pink)" />, text: 'Real-time performance insights for store owners' },
            ].map((feat, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: 'var(--bg-base)',
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

        {/* Right Panel — Login Form (Theme-Adaptive) */}
        <div style={{
          flex: '1 1 380px',
          maxWidth: '460px',
          width: '100%',
        }} className="animate-fadeIn">
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2.25rem',
            boxShadow: 'var(--shadow-xl)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
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
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.5rem',
                }}>
                  Account Role
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {roleOptions.map((opt) => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.9rem',
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
                      <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: selectedRole === opt.value ? 'var(--primary)' : 'var(--text-primary)',
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
              marginTop: '1.5rem',
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
    </div>
  );
};

export default Login;
