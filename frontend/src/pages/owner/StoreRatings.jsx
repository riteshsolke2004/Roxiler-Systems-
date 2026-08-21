import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarDisplay from '../../components/StarDisplay';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import { MessageSquare } from 'lucide-react';

const StoreRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('ratingDate');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get('/store-owner/ratings');
        if (res.data.success) {
          setRatings(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch store ratings.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  // Client-side sorting for store owner rating breakdown
  const sortedRatings = [...ratings].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'ratingDate') {
      valA = new Date(a.ratingDate).getTime();
      valB = new Date(b.ratingDate).getTime();
    } else if (typeof valA === 'string') {
      valA = (valA || '').toLowerCase();
      valB = (valB || '').toLowerCase();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const columns = [
    { header: 'User Name', field: 'userName', sortable: true },
    { header: 'User Email', field: 'userEmail', sortable: true },
    { header: 'User Address', field: 'userAddress', sortable: true },
    {
      header: 'Submitted Rating',
      field: 'rating',
      sortable: true,
      render: (r) => <StarDisplay rating={r.rating} size={16} />,
    },
    {
      header: 'Customer Feedback',
      field: 'feedback',
      sortable: false,
      render: (r) =>
        r.feedback ? (
          <div style={{
            fontSize: '0.825rem',
            color: 'var(--text-primary)',
            fontStyle: 'italic',
            maxWidth: '280px',
            lineHeight: 1.4,
          }}>
            "{r.feedback}"
          </div>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-disabled)', fontStyle: 'italic' }}>
            No comment
          </span>
        ),
    },
    {
      header: 'Submission Date',
      field: 'ratingDate',
      sortable: true,
      render: (r) =>
        new Date(r.ratingDate).toLocaleDateString() +
        ' ' +
        new Date(r.ratingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Ratings & Feedback</h1>
          <p className="page-subtitle">Complete breakdown of registered users and reviews for your store</p>
        </div>
      </div>

      <AlertMessage type="error" message={error} />

      {loading ? (
        <Loader text="Loading customer ratings..." />
      ) : (
        <SortableTable
          columns={columns}
          data={sortedRatings}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          emptyMessage="No customer ratings have been submitted for your store yet."
        />
      )}
    </div>
  );
};

export default StoreRatings;
