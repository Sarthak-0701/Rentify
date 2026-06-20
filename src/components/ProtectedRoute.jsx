import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../supabase/store/AuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  // 1. Still authenticating token or fetching profiles? Show a smooth placeholder.
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs tracking-widest uppercase text-gray-500">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  // 2. Not logged in? Redirect directly to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is logged in but doesn't have the explicit role permissions required
  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    return <Navigate to="/" replace />;
  }

  // 4. Authorized safely! Render child layout/pages
  return <Outlet />;
};

export default ProtectedRoute;