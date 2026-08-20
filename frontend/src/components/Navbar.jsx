import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, Key, ChevronDown, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return { label: 'System Admin', class: 'badge-admin', dot: '#ef4444' };
      case 'STORE_OWNER':
        return { label: 'Store Owner', class: 'badge-owner', dot: '#f59e0b' };
      case 'NORMAL_USER':
      default:
        return { label: 'Normal User', class: 'badge-user', dot: '#7c8dfc' };
    }
  };

  const roleConfig = user ? getRoleConfig(user.role) : null;
  const initials = user ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : '';

  return (
    <header style={{
      background: 'hsla(228, 25%, 6%, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'var(--grad-primary)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px var(--primary-glow)',
        }}>
          <Store size={18} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>
          StoreRating<span style={{
            background: 'var(--grad-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Hub</span>
        </span>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Change Password */}
          <Link
            to="/profile/change-password"
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.4rem', color: 'var(--text-muted)' }}
            title="Change Password"
          >
            <Key size={15} />
            <span style={{ display: 'none', '@media(min-width: 640px)': { display: 'inline' } }}>Password</span>
          </Link>

          {/* Divider */}
          <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="avatar" style={{ width: '34px', height: '34px', fontSize: '0.72rem' }}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
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
              color: 'hsl(4, 86%, 70%)',
              border: '1px solid hsla(4, 86%, 58%, 0.3)',
              gap: '0.4rem',
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
