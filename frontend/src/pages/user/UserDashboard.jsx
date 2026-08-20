import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StarDisplay from '../../components/StarDisplay';
import RatingInput from '../../components/RatingInput';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import { Search, Store, MapPin, Star, Edit3, PlusCircle, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const [selectedStore, setSelectedStore] = useState(null);
  const [modalRating, setModalRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);
      const res = await api.get(`/stores?${params.toString()}`);
      if (res.data.success) setStores(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store listing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, [sortBy, order]);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchStores(); };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setModalRating(store.userRating || 5);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async () => {
    if (!modalRating || modalRating < 1 || modalRating > 5) {
      setModalError('Please select a valid rating between 1 and 5 stars.');
      return;
    }
    setSubmitting(true);
    setModalError('');
    try {
      const endpoint = `/stores/${selectedStore.id}/ratings`;
      const method = selectedStore.userRating ? 'put' : 'post';
      const res = await api[method](endpoint, { rating: modalRating });
      if (res.data.success) {
        setSuccess(`Rating ${selectedStore.userRating ? 'updated' : 'submitted'} for ${selectedStore.name}!`);
        setIsModalOpen(false);
        fetchStores();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  const rated = stores.filter(s => s.userRating);
  const unrated = stores.filter(s => !s.userRating);

  return (
    <div style={{ animation: 'fadeIn 0.4s var(--ease-out) both' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Browse & Rate <span style={{
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Stores</span>
          </h1>
          <p className="page-subtitle">
            Discover stores, explore community ratings, and submit your reviews
          </p>
        </div>
        {stores.length > 0 && (
          <div style={{
            display: 'flex', gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
          }}>
            <Star size={14} color="var(--gold)" fill="var(--gold)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {stores.length} stores available
            </span>
          </div>
        )}
      </div>

      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />

      {/* Search & Sort Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search input */}
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by store name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="store-search"
                style={{ paddingLeft: '2.6rem' }}
              />
              <Search size={16} style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
            </div>

            {/* Sort Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={15} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 'auto', minWidth: '150px' }}
              >
                <option value="name">Sort: Name</option>
                <option value="address">Sort: Address</option>
                <option value="rating">Sort: Rating</option>
              </select>
              <button
                type="button"
                onClick={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}
                className="btn btn-secondary btn-sm"
                title="Toggle order"
                style={{ padding: '0.55rem' }}
              >
                <ArrowUpDown size={14} />
              </button>
            </div>

            <button type="submit" className="btn btn-primary btn-sm" id="store-search-btn">
              <Search size={14} />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Stores */}
      {loading ? (
        <Loader text="Loading stores..." />
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Store size={32} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Stores Found</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            No registered stores match your search query.
          </p>
        </div>
      ) : (
        <>
          {/* Rated stores section */}
          {rated.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                <Star size={13} color="var(--gold)" fill="var(--gold)" />
                Your Rated Stores ({rated.length})
              </h2>
              <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {rated.map((store) => <StoreCard key={store.id} store={store} onRate={openRatingModal} />)}
              </div>
            </div>
          )}

          {/* Unrated stores section */}
          {unrated.length > 0 && (
            <div>
              <h2 style={{
                fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                <Store size={13} color="var(--text-muted)" />
                Unrated Stores ({unrated.length})
              </h2>
              <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {unrated.map((store) => <StoreCard key={store.id} store={store} onRate={openRatingModal} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedStore.userRating ? 'Update Rating' : 'Rate'}: ${selectedStore.name}`}
        >
          <AlertMessage type="error" message={modalError} />

          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'hsla(43,96%,56%,0.15)',
              border: '1px solid hsla(43,96%,56%,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              <Star size={28} color="var(--gold)" fill="var(--gold)" />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Select a star rating from 1 (Poor) to 5 (Excellent)
            </p>
            <RatingInput value={modalRating} onChange={(val) => setModalRating(val)} size={40} />
            {modalRating > 0 && (
              <div style={{
                marginTop: '1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][modalRating]} — {modalRating}/5
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={submitting}
              onClick={handleRatingSubmit}
            >
              {submitting ? 'Saving...' : 'Save Rating'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const StoreCard = ({ store, onRate }) => (
  <div className="store-card animate-fadeInUp">
    {/* Store Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'var(--grad-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.75rem',
        }}>
          <Store size={18} color="#fff" />
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {store.name}
        </h3>
      </div>
      {store.userRating && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.25rem 0.65rem',
          background: 'hsla(43,96%,56%,0.15)',
          border: '1px solid hsla(43,96%,56%,0.3)',
          borderRadius: 'var(--radius-full)',
          flexShrink: 0,
        }}>
          <Star size={12} color="var(--gold)" fill="var(--gold)" />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)' }}>
            {store.userRating}/5
          </span>
        </div>
      )}
    </div>

    {/* Address */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
      <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {store.address}
      </p>
    </div>

    {/* Overall Rating */}
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1rem',
    }}>
      <div style={{
        fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem',
      }}>
        Community Rating
      </div>
      <StarDisplay rating={store.averageRating} totalRatings={store.totalRatings} size={18} />
    </div>

    {/* User rating status */}
    {!store.userRating && (
      <p style={{ fontSize: '0.8rem', color: 'var(--text-disabled)', fontStyle: 'italic' }}>
        You haven't rated this store yet.
      </p>
    )}

    {/* CTA Button */}
    <button
      onClick={() => onRate(store)}
      className={`btn ${store.userRating ? 'btn-secondary' : 'btn-primary'}`}
      style={{ width: '100%' }}
    >
      {store.userRating ? (
        <><Edit3 size={15} /><span>Modify Rating</span></>
      ) : (
        <><PlusCircle size={15} /><span>Submit Rating</span></>
      )}
    </button>
  </div>
);

export default UserDashboard;
