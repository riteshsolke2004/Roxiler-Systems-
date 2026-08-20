import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import AlertMessage from '../../components/AlertMessage';
import Loader from '../../components/Loader';
import { PlusCircle, ArrowLeft, Store, Mail, MapPin, UserCheck } from 'lucide-react';

const AddStore = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');

  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await api.get('/admin/users?role=STORE_OWNER');
        if (res.data.success) {
          // Filter to only owners without an assigned store
          const unassigned = res.data.data.filter((u) => !u.ownedStore);
          setOwners(unassigned);
          if (unassigned.length > 0) {
            setOwnerId(unassigned[0].id);
          }
        }
      } catch (err) {
        setError('Failed to fetch available Store Owners.');
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  const validateForm = () => {
    if (name.length < 20 || name.length > 60) {
      return 'Store Name must be between 20 and 60 characters in length.';
    }
    if (address.length > 400) {
      return 'Store Address must not exceed 400 characters.';
    }
    if (!ownerId) {
      return 'Please select a Store Owner.';
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
      const res = await api.post('/admin/stores', {
        name,
        email,
        address,
        ownerId,
      });

      if (res.data.success) {
        setSuccess('Store created successfully!');
        setTimeout(() => {
          navigate('/admin/stores');
        }, 1500);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create store.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOwners) return <Loader text="Loading available Store Owners..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Store</h1>
          <p className="page-subtitle">Register a business store and assign an unassigned Store Owner</p>
        </div>
        <Link to="/admin/stores" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Back to Stores</span>
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <AlertMessage type="error" message={error} />
        <AlertMessage type="success" message={success} />

        {owners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              There are currently no unassigned Store Owner accounts available.
            </p>
            <Link to="/admin/users/new" className="btn btn-primary btn-sm">
              Create a Store Owner Account First
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Minimum 20 to 60 characters..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Store
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
              <label className="form-label">Store Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="info@storebrand.com"
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
              <label className="form-label">Assign Store Owner</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                >
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                <UserCheck
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
              <label className="form-label">Store Address</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  rows={3}
                  placeholder="Enter complete store address..."
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
                <span>Creating Store...</span>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Create Store</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStore;
