import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Store, LogOut, Key, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return { label: 'System Admin', class: 'badge-admin' };
      case 'STORE_OWNER':
        return { label: 'Store Owner', class: 'badge-owner' };
      case 'NORMAL_USER':
      default:
        return { label: 'Normal User', class: 'badge-user' };
    }
  };

  const roleConfig = user ? getRoleConfig(user.role) : null;
  const initials = user ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : '';

  return (
    <header style={{
      background: 'var(--bg-navbar)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: scrolled ? '0 1.5rem' : '0 2rem',
      height: scrolled ? '54px' : '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      transition: 'height 0.3s cubic-bezier(0.22, 1, 0.36, 1), padding 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
    }}>

      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
        <div style={{
          width: scrolled ? '32px' : '36px',
          height: scrolled ? '32px' : '36px',
          background: 'var(--grad-primary)',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px var(--primary-glow)',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <Store size={scrolled ? 16 : 18} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: scrolled ? '1rem' : '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          transition: 'font-size 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          StoreRating<span style={{
            background: 'var(--grad-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Hub</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
          style={{
            width: scrolled ? '32px' : '36px',
            height: scrolled ? '32px' : '36px',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {theme === 'dark' ? <Sun size={scrolled ? 15 : 17} color="var(--gold)" /> : <Moon size={scrolled ? 15 : 17} color="var(--primary)" />}
        </button>

        {user ? (
          <>
            {/* Change Password */}
            <Link
              to="/profile/change-password"
              className="btn btn-ghost btn-sm"
              style={{ gap: '0.4rem', color: 'var(--text-muted)' }}
              title="Change Password"
            >
              <Key size={15} />
              <span>Password</span>
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: scrolled ? '22px' : '28px', background: 'var(--border)', transition: 'height 0.3s ease' }} />

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="avatar" style={{
                width: scrolled ? '30px' : '34px',
                height: scrolled ? '30px' : '34px',
                fontSize: scrolled ? '0.68rem' : '0.72rem',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                {initials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: scrolled ? '0.78rem' : '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span className={`badge ${roleConfig.class}`} style={{ padding: '0.1rem 0.5rem', marginTop: '2px', fontSize: '0.6rem' }}>
                  {roleConfig.label}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{
                background: 'hsla(4, 86%, 58%, 0.12)',
                color: 'var(--error)',
                border: '1px solid hsla(4, 86%, 58%, 0.3)',
                gap: '0.4rem',
                padding: scrolled ? '0.35rem 0.75rem' : '0.45rem 0.9rem',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
