import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AlertMessage from '../components/AlertMessage';
import { Store, UserPlus, User, Mail, Lock, MapPin, CheckCircle2, Circle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = [
    { label: '8–16 characters', pass: password.length >= 8 && password.length <= 16 },
    { label: 'At least one uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'At least one special character', pass: /[!@#$%^&*(),.?":{}|<>\-_=+\\/\[\]]/.test(password) },
  ];

  const validateForm = () => {
    if (name.length < 20 || name.length > 60)
      return 'Name must be between 20 and 60 characters in length.';
    if (address.length > 400)
      return 'Address must not exceed 400 characters.';
    if (password.length < 8 || password.length > 16)
      return 'Password must be between 8 and 16 characters in length.';
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*(),.?":{}|<>\-_=+\\/\[\]]/.test(password))
      return 'Password must contain at least one special character.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationErr = validateForm();
    if (validationErr) { setError(validationErr); return; }
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { name, email, password, address });
      if (res.data.success) {
        const { user, token } = res.data.data;
        login(user, token);
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check form inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(186,100%,53%,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-15%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsla(252,87%,67%,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.3,
        }} />
      </div>

      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: 'hsla(228,20%,10%,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid var(--border-strong)',
        borderRadius: 'var(--radius-2xl)',
        padding: '2.5rem',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.5s var(--ease-out) both',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'var(--grad-accent)',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px var(--accent-glow)',
          }}>
            <UserPlus size={26} color="hsl(228,25%,6%)" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.35rem',
            letterSpacing: '-0.02em',
          }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Join StoreRatingHub as a Normal User
          </p>
        </div>

        <AlertMessage type="error" message={error} />

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. Alexander Jonathan Montgomery Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="reg-name"
                style={{ paddingLeft: '2.6rem' }}
              />
              <User size={16} style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="form-hint">Must be 20 to 60 characters</span>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600,
                color: name.length >= 20 && name.length <= 60 ? 'var(--success)' : 'var(--text-muted)',
              }}>
                {name.length}/60
              </span>
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
                id="reg-email"
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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="reg-password"
                style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
              />
              <Lock size={16} style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: '0.85rem', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
              }}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {/* Password checklist */}
            {password.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.35rem' }}>
                {passwordChecks.map((check) => (
                  <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {check.pass
                      ? <CheckCircle2 size={13} color="var(--success)" />
                      : <Circle size={13} color="var(--text-disabled)" />
                    }
                    <span style={{
                      fontSize: '0.72rem',
                      color: check.pass ? 'var(--success)' : 'var(--text-muted)',
                      fontWeight: check.pass ? 600 : 400,
                    }}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Address</label>
            <div style={{ position: 'relative' }}>
              <textarea
                rows={3}
                placeholder="Enter your full physical address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                id="reg-address"
                style={{ paddingLeft: '2.6rem', resize: 'vertical' }}
              />
              <MapPin size={16} style={{
                position: 'absolute', left: '0.85rem', top: '1rem',
                color: 'var(--text-muted)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="form-hint">Maximum 400 characters</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{address.length}/400</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            id="reg-submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.925rem', borderRadius: 'var(--radius-md)' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'hsl(228,25%,6%)' }} />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus size={17} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
