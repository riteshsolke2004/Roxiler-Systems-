import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import { UserPlus, Eye, Search, Filter } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterName) params.append('name', filterName);
      if (filterEmail) params.append('email', filterEmail);
      if (filterAddress) params.append('address', filterAddress);
      if (filterRole) params.append('role', filterRole);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
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
    { header: 'Name', field: 'name', sortable: true },
    { header: 'Email', field: 'email', sortable: true },
    { header: 'Address', field: 'address', sortable: true },
    {
      header: 'Role',
      field: 'role',
      sortable: true,
      render: (user) => {
        switch (user.role) {
          case 'SYSTEM_ADMIN':
            return <span className="badge badge-admin">System Admin</span>;
          case 'STORE_OWNER':
            return <span className="badge badge-owner">Store Owner</span>;
          case 'NORMAL_USER':
          default:
            return <span className="badge badge-user">Normal User</span>;
        }
      },
    },
    {
      header: 'Actions',
      field: 'actions',
      sortable: false,
      render: (user) => (
        <Link to={`/admin/users/${user.id}`} className="btn btn-secondary btn-sm">
          <Eye size={14} />
          <span>Details</span>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">View, filter, and manage registered system users</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">
          <UserPlus size={18} />
          <span>Add New User</span>
        </Link>
      </div>

      <AlertMessage type="error" message={error} />

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Name</label>
              <input
                type="text"
                placeholder="Filter by name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Email</label>
              <input
                type="text"
                placeholder="Filter by email..."
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Address</label>
              <input
                type="text"
                placeholder="Filter by address..."
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Role</label>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">All Roles</option>
                <option value="NORMAL_USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>
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
                setFilterRole('');
                setTimeout(() => fetchUsers(), 50);
              }}
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader text="Loading user list..." />
      ) : (
        <SortableTable
          columns={columns}
          data={users}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          emptyMessage="No users found matching the filter criteria."
        />
      )}
    </div>
  );
};

export default UserManagement;
