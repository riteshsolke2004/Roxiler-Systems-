import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext';
import Loader from './Loader';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Verifying permissions..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect user to their own role dashboard if trying to access unauthorized route
    const redirectPath = getDashboardPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
