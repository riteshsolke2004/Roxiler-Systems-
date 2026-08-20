import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import AlertMessage from '../../components/AlertMessage';
import { UserPlus, ArrowLeft, User, Mail, Lock, MapPin, Shield } from 'lucide-react';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('NORMAL_USER');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (name.length < 20 || name.length > 60) {
      return 'Name must be between 20 and 60 characters in length.';
    }
    if (address.length > 400) {
      return 'Address must not exceed 400 characters.';
    }
    if (password.length < 8 || password.length > 16) {
      return 'Password must be between 8 and 16 characters in length.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>\-_=+\\\/\[\]]/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const valErr = validateForm();
    if (valErr) {
      setError(valErr);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/admin/users', {
        name,
        email,
        password,
        address,
        role,
      });

      if (res.data.success) {
        setSuccess('User created successfully!');
        setTimeout(() => {
          navigate('/admin/users');
        }, 1500);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create user.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New User</h1>
          <p className="page-subtitle">Create a user account with specific role privileges</p>
        </div>
        <Link to="/admin/users" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Back to Users</span>
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Minimum 20 to 60 characters..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)',
                }}
              />
            </div>
            <span className="form-hint">20 to 60 characters ({name.length}/60)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">User Role</label>
            <div style={{ position: 'relative' }}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              >
                <option value="NORMAL_USER">NORMAL_USER (Standard Consumer)</option>
                <option value="STORE_OWNER">STORE_OWNER (Assigned to Business Store)</option>
                <option value="SYSTEM_ADMIN">SYSTEM_ADMIN (Full Platform Administrator)</option>
              </select>
              <Shield
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="8-16 chars, 1 uppercase, 1 special char"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)',
                }}
              />
            </div>
            <span className="form-hint">8-16 characters, 1 uppercase letter & 1 special character</span>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <div style={{ position: 'relative' }}>
              <textarea
                rows={3}
                placeholder="Enter complete address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem', resize: 'vertical' }}
              />
              <MapPin
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '1rem',
                  color: 'var(--text-light)',
                }}
              />
            </div>
            <span className="form-hint">Maximum 400 characters ({address.length}/400)</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? (
              <span>Creating User...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create User</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
