import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, getDashboardPath } from './context/AuthContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UserDetails from './pages/admin/UserDetails';
import AddUser from './pages/admin/AddUser';
import StoreManagement from './pages/admin/StoreManagement';
import AddStore from './pages/admin/AddStore';

// Normal User Pages
import UserDashboard from './pages/user/UserDashboard';

// Store Owner Pages
import StoreOwnerDashboard from './pages/owner/StoreOwnerDashboard';
import StoreRatings from './pages/owner/StoreRatings';

const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={getDashboardPath(user.role)} replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes inside Main Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Shared Profile Route */}
          <Route path="/profile/change-password" element={<ChangePassword />} />

          {/* System Admin Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['SYSTEM_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/users/new" element={<AddUser />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/stores" element={<StoreManagement />} />
            <Route path="/admin/stores/new" element={<AddStore />} />
          </Route>

          {/* Normal User Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['NORMAL_USER']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/stores" element={<UserDashboard />} />
          </Route>

          {/* Store Owner Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['STORE_OWNER']} />}>
            <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
            <Route path="/owner/ratings" element={<StoreRatings />} />
          </Route>
        </Route>
      </Route>

      {/* Root and Catch-all Redirects */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
