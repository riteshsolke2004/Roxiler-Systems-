import React, { useState } from 'react';
import api from '../api/axios';
import AlertMessage from '../components/AlertMessage';
import { Key, Lock, CheckCircle } from 'lucide-react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      setError('New password must be between 8 and 16 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('New password must contain at least one uppercase letter.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>\-_=+\\/\[\]]/.test(newPassword)) {
      setError('New password must contain at least one special character.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/change-password', { oldPassword, newPassword });
      if (res.data.success) {
        setSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s var(--ease-out) both' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Change Password</h1>
          <p className="page-subtitle">Update your account security credentials</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '520px' }}>
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.6rem' }}
              />
              <Lock size={16} style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.6rem' }}
              />
              <Key size={16} style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--primary)',
              }} />
            </div>
            <span className="form-hint">8–16 characters, 1 uppercase letter, 1 special character</span>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.6rem' }}
              />
              <CheckCircle size={16} style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)',
                color: confirmPassword && confirmPassword === newPassword ? 'var(--success)' : 'var(--text-muted)',
              }} />
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <span className="form-error">Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '0.25rem' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '15px', height: '15px', borderWidth: '2px' }} />
                <span>Updating...</span>
              </>
            ) : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
