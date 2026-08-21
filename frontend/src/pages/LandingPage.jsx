import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Store,
  Star,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  BarChart3,
  Sun,
  Moon
} from 'lucide-react';

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      {/* 1. Dynamic Resizing Header / Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--bg-navbar)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: scrolled ? '0.5rem 1.75rem' : '0.95rem 2.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          transition: 'padding 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, background 0.3s ease',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: scrolled ? '32px' : '38px',
              height: scrolled ? '32px' : '38px',
              background: 'var(--grad-primary)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--primary-glow)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <Store size={scrolled ? 17 : 20} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: scrolled ? '1.1rem' : '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              transition: 'font-size 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            StoreRating<span style={{
              background: 'var(--grad-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Hub</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#why-us" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Why Us
          </a>
          <a href="#roles" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Roles & Access
          </a>

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

          {isAuthenticated && user ? (
            <Link
              to={getDashboardPath(user.role)}
              className="btn btn-primary btn-sm"
              style={{
                padding: scrolled ? '0.35rem 0.85rem' : '0.45rem 1rem',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{
                  padding: scrolled ? '0.35rem 0.85rem' : '0.45rem 1rem',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{
                  padding: scrolled ? '0.35rem 0.85rem' : '0.45rem 1rem',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                Register Free
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 2rem 5rem',
          textAlign: 'center',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }} className="animate-fadeInUp">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'hsla(252, 87%, 67%, 0.12)',
              border: '1px solid hsla(252, 87%, 67%, 0.3)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              TRANSPARENT STORE RATINGS & ANALYTICS PLATFORM
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Discover, Rate & Grow{' '}
            <span
              style={{
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Trusted Stores
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
            }}
          >
            A full-stack, enterprise-grade store rating platform designed with multi-role access control,
            real-time dynamic rating calculations, and transparent customer feedback.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: '0.65rem' }}>
              <span>Start Exploring Stores</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              <span>Sign In to Dashboard</span>
            </Link>
          </div>

          {/* Trust points */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '3.5rem',
              flexWrap: 'wrap',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--success)" /> Verified Customer Reviews
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--primary)" /> Strict Role-Based Security
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={16} color="var(--accent)" /> Real-Time Computed Metrics
            </span>
          </div>
        </div>
      </section>

      {/* 3. Why This Project Was Built Section */}
      <section
        id="why-us"
        style={{
          padding: '5rem 2rem',
          background: 'var(--bg-card-hover)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              The Purpose & Mission
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Why StoreRatingHub Was Built
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0.75rem auto 0', fontSize: '0.95rem' }}>
              Solving the challenges of dishonest reviews, lack of role clarity, and fragmented store monitoring.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'hsla(43, 96%, 56%, 0.15)',
                  border: '1px solid hsla(43, 96%, 56%, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={24} color="var(--gold)" fill="var(--gold)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                1. Single Source of Honest Ratings
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Prevent review manipulation through database-level unique constraints (<code style={{ color: 'var(--primary)' }}>userId + storeId</code>),
                ensuring each user can submit exactly one rating per store while allowing instant modification anytime.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'hsla(186, 100%, 53%, 0.15)',
                  border: '1px solid hsla(186, 100%, 53%, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={24} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                2. Real-Time Dynamic Analytics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Store averages are never cached or stale. Every query executes aggregate calculations (<code style={{ color: 'var(--accent)' }}>_avg</code>, <code style={{ color: 'var(--accent)' }}>_count</code>)
                providing live score updates the moment a customer submits feedback.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'hsla(252, 87%, 67%, 0.15)',
                  border: '1px solid hsla(252, 87%, 67%, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                3. True Multi-Role Isolation
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Separate, guarded experiences tailored for Administrators, Store Owners, and Normal Users so everyone accesses only what they need with zero cross-tenant contamination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Roles & Access Hierarchy */}
      <section
        id="roles"
        style={{
          padding: '5rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Role-Based Architecture
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Designed for Three Key Personas
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {/* Normal User */}
            <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
              <div className="badge badge-user" style={{ width: 'fit-content', marginBottom: '1rem' }}>
                Normal User
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Customer & Reviewer
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Self-registration & login
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Browse & search all registered stores
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Submit & modify 1-to-5 star rating
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Personal password management
                </li>
              </ul>
            </div>

            {/* Store Owner */}
            <div className="card" style={{ borderTop: '3px solid var(--gold)' }}>
              <div className="badge badge-owner" style={{ width: 'fit-content', marginBottom: '1rem' }}>
                Store Owner
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Business Representative
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Dedicated store dashboard
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Live average score & total review counts
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Table of customers who reviewed store
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Strict data isolation
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div className="card" style={{ borderTop: '3px solid var(--error)' }}>
              <div className="badge badge-admin" style={{ width: 'fit-content', marginBottom: '1rem' }}>
                System Admin
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Platform Administrator
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Overview metrics (users, stores, ratings)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Create users for any system role
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Create stores & assign store owners
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} color="var(--success)" /> Filterable & sortable data tables
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean, Harmonious Call to Action Banner (Theme-Adaptive) */}
      <section style={{ padding: '3.5rem 2rem 4.5rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            background: 'var(--bg-elevated)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'var(--grad-primary)',
            }}
          />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Ready to Rate Your Favorite Stores?
          </h2>
          <p
            style={{
              fontSize: '0.975rem',
              color: 'var(--text-muted)',
              maxWidth: '520px',
              margin: '0 auto 1.75rem',
              lineHeight: 1.6,
            }}
          >
            Join our transparent community today or sign in to manage your store reviews and ratings.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
              <span>Create Free Account</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer
        style={{
          marginTop: 'auto',
          background: 'var(--bg-card-hover)',
          borderTop: '1px solid var(--border)',
          padding: '2.25rem 2rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--grad-primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
              StoreRatingHub
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <Link to="/login" style={{ color: 'var(--text-muted)' }}>
              Sign In
            </Link>
            <Link to="/register" style={{ color: 'var(--text-muted)' }}>
              Register
            </Link>
            <a href="#why-us" style={{ color: 'var(--text-muted)' }}>
              Why Us
            </a>
            <a href="#roles" style={{ color: 'var(--text-muted)' }}>
              Roles & Access
            </a>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%', textAlign: 'center', marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            © {new Date().getFullYear()} StoreRatingHub.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
