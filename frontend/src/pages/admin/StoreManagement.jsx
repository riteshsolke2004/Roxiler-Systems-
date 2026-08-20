import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarDisplay from '../../components/StarDisplay';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import { PlusCircle, Filter } from 'lucide-react';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterName) params.append('name', filterName);
      if (filterEmail) params.append('email', filterEmail);
      if (filterAddress) params.append('address', filterAddress);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);

      const res = await api.get(`/admin/stores?${params.toString()}`);
      if (res.data.success) {
        setStores(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const columns = [
    { header: 'Store Name', field: 'name', sortable: true },
    { header: 'Store Email', field: 'email', sortable: true },
    { header: 'Store Address', field: 'address', sortable: true },
    {
      header: 'Store Owner',
      field: 'owner',
      sortable: false,
      render: (store) => store.owner ? store.owner.name : 'Unassigned',
    },
    {
      header: 'Overall Rating',
      field: 'rating',
      sortable: true,
      render: (store) => (
        <StarDisplay rating={store.averageRating} totalRatings={store.totalRatings} size={16} />
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Store Management</h1>
          <p className="page-subtitle">View, filter, and add registered business stores</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Store</span>
        </Link>
      </div>

      <AlertMessage type="error" message={error} />

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Store Name</label>
              <input
                type="text"
                placeholder="Filter by store name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Store Email</label>
              <input
                type="text"
                placeholder="Filter by store email..."
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Store Address</label>
              <input
                type="text"
                placeholder="Filter by store address..."
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              <Filter size={16} />
              <span>Apply Filters</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setFilterName('');
                setFilterEmail('');
                setFilterAddress('');
                setTimeout(() => fetchStores(), 50);
              }}
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {/* Stores Table */}
      {loading ? (
        <Loader text="Loading store list..." />
      ) : (
        <SortableTable
          columns={columns}
          data={stores}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          emptyMessage="No stores found matching the filter criteria."
        />
      )}
    </div>
  );
};

export default StoreManagement;
