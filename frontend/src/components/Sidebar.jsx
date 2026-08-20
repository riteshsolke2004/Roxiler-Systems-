import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserPlus, Store, PlusCircle, Star, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'var(--primary)' },
    { to: '/admin/users', label: 'User Management', icon: Users, color: 'var(--accent)' },
    { to: '/admin/users/new', label: 'Add User', icon: UserPlus, color: 'var(--pink)' },
    { to: '/admin/stores', label: 'Store Management', icon: Store, color: 'var(--gold)' },
    { to: '/admin/stores/new', label: 'Add Store', icon: PlusCircle, color: 'var(--success)' },
  ];

  const userLinks = [
    { to: '/user/dashboard', label: 'Browse & Rate Stores', icon: Store, color: 'var(--primary)' },
  ];

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Store Dashboard', icon: LayoutDashboard, color: 'var(--primary)' },
    { to: '/owner/ratings', label: 'Customer Ratings', icon: Star, color: 'var(--gold)' },
  ];

  let links = [];
  if (role === 'SYSTEM_ADMIN') links = adminLinks;
  else if (role === 'STORE_OWNER') links = ownerLinks;
  else links = userLinks;

  const getRoleSection = () => {
    if (role === 'SYSTEM_ADMIN') return 'Admin Controls';
    if (role === 'STORE_OWNER') return 'Owner Tools';
    return 'My Space';
  };

  return (
    <aside style={{
      width: '240px',
      background: 'var(--grad-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0.75rem',
      flexShrink: 0,
      gap: '0.25rem',
    }}>
      {/* Section label */}
      <div style={{
        padding: '0 0.75rem 0.75rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '0.5rem',
      }}>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
        }}>
          {getRoleSection()}
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive
                  ? 'linear-gradient(135deg, hsla(252,87%,67%,0.25), hsla(220,85%,62%,0.15))'
                  : 'transparent',
                border: isActive ? '1px solid hsla(252,87%,67%,0.3)' : '1px solid transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive
                      ? 'var(--grad-primary)'
                      : 'var(--bg-elevated)',
                    flexShrink: 0,
                    transition: 'var(--transition)',
                  }}>
                    <Icon
                      size={15}
                      color={isActive ? '#fff' : link.color}
                    />
                  </div>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  {isActive && (
                    <ChevronRight size={14} style={{ opacity: 0.6 }} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom brand watermark */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem 0.75rem 0.5rem',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.4,
        }}>
          <Store size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            StoreRatingHub
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
